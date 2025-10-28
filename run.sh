#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

SCRIPT_DIR=$(cd -- "${BASH_SOURCE[0]%/*}" && pwd)
REPO_DIR="$SCRIPT_DIR"
CODEX_DIR="$REPO_DIR/.codex"
BUILD_DIR="$CODEX_DIR/.build"
mkdir -p "$BUILD_DIR"

# Prefer project venv for any Python used in this script
if [[ -d "$REPO_DIR/.venv/bin" ]]; then
  export VIRTUAL_ENV="$REPO_DIR/.venv"
  export PATH="$REPO_DIR/.venv/bin:$PATH"
fi

PROFILE="${CODEX_PROFILE:-default}"
MODEL=""
EXTRA_ARGS=()
DRY_RUN=0

usage() {
  cat <<USAGE
Usage: ./run.sh [-p profile] [-m model] [--] [extra codex args]
Assembles .codex prompts/context, merges env from repo ~/.codex profiles, and runs codex CLI.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--profile) PROFILE="$2"; shift 2;;
    -m|--model) MODEL="$2"; shift 2;;
    --dry-run) DRY_RUN=1; shift;;
    -h|--help) usage; exit 0;;
    --) shift; EXTRA_ARGS+=("$@"); break;;
    *) EXTRA_ARGS+=("$1"); shift;;
  esac
done

# 1) Assemble prompt
PROMPT_FILE="$BUILD_DIR/assembled_prompt.md"
{
  echo "# Repository: $(basename "$REPO_DIR")"
  echo "\n## Prompts"
  if compgen -G "$CODEX_DIR/prompts/*.md" > /dev/null; then
    while IFS= read -r f; do
      echo "\n---\n# $(basename "$f")\n"; cat "$f"
    done < <(ls -1 "$CODEX_DIR"/prompts/*.md | sort)
  fi
  echo "\n## Auto-Detected Project Context"
  # Include mkdocs.yml if present
  if [[ -f "$REPO_DIR/mkdocs.yml" ]] || [[ -f "$REPO_DIR/mkdocs.yaml" ]]; then
    MKCFG="$REPO_DIR/mkdocs.yml"; [[ -f "$REPO_DIR/mkdocs.yaml" ]] && MKCFG="$REPO_DIR/mkdocs.yaml"
    echo "\n### Existing mkdocs config: $(basename "$MKCFG")"
    echo '\n```yaml'
    sed -e 's/\t/  /g' "$MKCFG"
    echo '\n```'
  fi
  # Include docs/ tree summary
  if [[ -d "$REPO_DIR/docs" ]]; then
    echo "\n### docs/ tree (dirs up to depth 3)"
    echo '\n```text'
    find "$REPO_DIR/docs" -maxdepth 3 -type d -printf '%P\n' | sed '/^$/d' | sort
    echo '```'
    echo "\n### Markdown files (depth ≤ 3)"
    echo '\n```text'
    find "$REPO_DIR/docs" -maxdepth 3 -type f -name '*.md' -printf '%P\n' | sort
    echo '```'
    echo "\n### .pages files"
    echo '\n```text'
    find "$REPO_DIR/docs" -type f -name '.pages' -printf '%P\n' | sort || true
    echo '```'
  fi
  echo "\n## Context"
  if compgen -G "$CODEX_DIR/context/*.md" > /dev/null; then
    while IFS= read -r f; do
      echo "\n---\n# $(basename "$f")\n"; cat "$f"
    done < <(ls -1 "$CODEX_DIR"/context/*.md | sort)
  fi
  if [[ -f "$CODEX_DIR/tools.yaml" ]]; then
    echo "\n## Tools"
    echo '\n```yaml'
    cat "$CODEX_DIR/tools.yaml"
    echo '\n```'
  fi
} > "$PROMPT_FILE"

# 2) Merge env from repo .codex/profile.yaml over user profile ~/.codex/codex-yaml-profiles/${PROFILE}.yaml
ENV_FILE="$BUILD_DIR/env.sh"
python3 - "$CODEX_DIR" "$PROFILE" "$ENV_FILE" <<'PY'
import os, sys, yaml
repo_codex, profile, env_out = sys.argv[1], sys.argv[2], sys.argv[3]
user_prof = os.path.expanduser(f"~/.codex/codex-yaml-profiles/{profile}.yaml")
repo_prof = os.path.join(repo_codex, 'profile.yaml')

def load(p):
    if os.path.isfile(p):
        with open(p,'r',encoding='utf-8') as f:
            return yaml.safe_load(f) or {}
    return {}
user = load(user_prof)
repo = load(repo_prof)

def merged_map(key):
    m = {}
    for d in (user.get(key) or {}, repo.get(key) or {}):
        # dict merge; repo overrides
        m.update(d)
    return m
env = merged_map('env')
secrets = merged_map('secrets')
lines = []
for k,v in env.items():
    if v is None: v = ''
    lines.append(f"export {k}='{str(v).replace("'","'\''")}'")
# secrets: docker-secret => ~/.codex/secrets/<name>
for name,spec in (secrets or {}).items():
    if not isinstance(spec, dict):
        continue
    src = spec.get('source','docker-secret')
    val = None
    if src == 'env':
        ref = spec.get('ref', name)
        val = os.environ.get(ref)
    elif src == 'file':
        p = spec.get('path')
        if p and os.path.isfile(p):
            val = open(p,'r',encoding='utf-8').read().strip()
    else:
        secname = spec.get('name', name.lower())
        p = os.path.expanduser(f"~/.codex/secrets/{secname}")
        if os.path.isfile(p):
            val = open(p,'r',encoding='utf-8').read().strip()
    if val is not None:
        lines.append(f"export {name}='{str(val).replace("'","'\''")}'")
with open(env_out,'w',encoding='utf-8') as f:
    f.write("\n".join(lines)+"\n")
print(env_out)
PY
# shellcheck disable=SC1090
source "$ENV_FILE" || true

# Allow -m override from CLI or CODEX_MODEL from env/profile
if [[ -n "${MODEL:-}" ]]; then
  EXTRA_ARGS+=("-m" "$MODEL")
elif [[ -n "${CODEX_MODEL:-}" ]]; then
  EXTRA_ARGS+=("-m" "$CODEX_MODEL")
fi

# 3) Choose invocation style
CODEx_BIN=$(command -v codex || true)
if [[ -z "$CODEx_BIN" ]]; then
  echo "[run.sh] ERROR: codex CLI not found in PATH." >&2
  echo "Hint: install codex or run within your configured agent environment." >&2
  exit 1
fi

STYLE=stdin
if codex exec --help 2>/dev/null | grep -qiE -- '--(input|file|prompt-file)'; then
  STYLE=file
fi

set -x
if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "DRY-RUN profile=$PROFILE style=$STYLE prompt=$PROMPT_FILE args=${EXTRA_ARGS[*]}"
  exit 0
fi

# Try execution; if 401/invalid token, surface guidance.
set +e
if [[ "$STYLE" == file ]]; then
  if codex exec --help 2>/dev/null | grep -qi -- "--input"; then
    codex exec --input "$PROMPT_FILE" "${EXTRA_ARGS[@]}"; rc=$?
  elif codex exec --help 2>/dev/null | grep -qi -- "--file"; then
    codex exec --file "$PROMPT_FILE" "${EXTRA_ARGS[@]}"; rc=$?
  elif codex exec --help 2>/dev/null | grep -qi -- "--prompt-file"; then
    codex exec --prompt-file "$PROMPT_FILE" "${EXTRA_ARGS[@]}"; rc=$?
  else
    codex exec < "$PROMPT_FILE" "${EXTRA_ARGS[@]}"; rc=$?
  fi
else
  codex exec < "$PROMPT_FILE" "${EXTRA_ARGS[@]}"; rc=$?
fi
set -e

if [[ $rc -ne 0 ]]; then
  echo "[run.sh] codex exec failed (rc=$rc). If this is invalid_token/401, try: codex logout && codex login --device-auth" >&2
  exit $rc
fi