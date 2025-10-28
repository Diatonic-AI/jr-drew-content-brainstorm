#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

script_name="${0##*/}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { printf '[%s] %s\n' "$script_name" "$*"; }
warn() { printf '[%s][warn] %s\n' "$script_name" "$*" >&2; }
err() { printf '[%s][err] %s\n' "$script_name" "$*" >&2; }
trap 'err "Error on line $LINENO"; exit 1' ERR

# Vars
CURRENT_REPO="/home/daclab-ai/Documents/JR-Drew-Content-Brainstorm"
TARGET_REPO="squidfunk/mkdocs-material"
WORKROOT="${HOME}/tmp/codex-crawl"
TARGET_REPO_DIR="${WORKROOT}/squidfunk__mkdocs-material"
OUT_JSON="${WORKROOT}/mkdocs_material_report.json"
MAX_FILES=100
PLUG_AWK="${SCRIPT_DIR}/plug_parser.awk"
ERRORS="${WORKROOT}/errors.log"

log "CWD=$(pwd)"
mkdir -p "$WORKROOT"
: > "$ERRORS"

# 1) Python venv
if [ ! -d "$WORKROOT/.venv" ]; then
  log "Creating venv at $WORKROOT/.venv"
  python3 -m venv "$WORKROOT/.venv" || { warn "venv creation failed"; echo "err: venv creation failed" >> "$ERRORS"; }
fi
# shellcheck source=/dev/null
. "$WORKROOT/.venv/bin/activate" || { warn "venv activate failed"; echo "err: venv activate failed" >> "$ERRORS"; }
python -m pip -q install --upgrade pip || true
python -m pip -q install mkdocs mkdocs-material || { warn "pip install mkdocs/material failed"; echo "warn: pip install mkdocs/material failed" >> "$ERRORS"; }

# 2) Clone target repo
if [ ! -d "$TARGET_REPO_DIR/.git" ]; then
  log "Cloning $TARGET_REPO -> $TARGET_REPO_DIR"
  if command -v gh >/dev/null 2>&1; then
    gh repo clone "$TARGET_REPO" "$TARGET_REPO_DIR" -- --depth 1 || { warn "gh clone failed, falling back to git"; echo "err: clone failed (gh)" >> "$ERRORS"; }
  fi
  if [ ! -d "$TARGET_REPO_DIR/.git" ]; then
    if command -v git >/dev/null 2>&1; then
      git clone --depth 1 "https://github.com/${TARGET_REPO}.git" "$TARGET_REPO_DIR" || { warn "git clone failed"; echo "err: clone failed (git)" >> "$ERRORS"; }
    else
      warn "git not found"
      echo "fatal: git not found" >> "$ERRORS"
    fi
  fi
else
  log "Repo present: $TARGET_REPO_DIR"
fi

if [ ! -d "$TARGET_REPO_DIR" ]; then
  echo "fatal: target repo dir missing" >> "$ERRORS"
fi

# 3) File lists
: > "$WORKROOT/files.txt"
if [ -d "$TARGET_REPO_DIR/docs" ]; then
  find "$TARGET_REPO_DIR/docs" -type f -regextype posix-extended -regex '.*\.(md|markdown|ya?ml)$' | head -n "$MAX_FILES" >> "$WORKROOT/files.txt" || true
fi
if [ -d "$TARGET_REPO_DIR/src" ]; then
  find "$TARGET_REPO_DIR/src" -type f -regextype posix-extended -regex '.*\.(md|markdown|ya?ml|css|scss)$' | head -n "$MAX_FILES" >> "$WORKROOT/files.txt" || true
fi
if [ -f "$TARGET_REPO_DIR/mkdocs.yml" ]; then
  printf '%s\n' "$TARGET_REPO_DIR/mkdocs.yml" >> "$WORKROOT/files.txt"
fi

# 4) Tree snapshot
if command -v tree >/dev/null 2>&1; then
  tree -a -L 3 -I '.git|site|node_modules|__pycache__' "$TARGET_REPO_DIR" > "$WORKROOT/tree.txt" || true
else
  (cd "$TARGET_REPO_DIR" && find . -maxdepth 3 -print) > "$WORKROOT/tree.txt" || true
fi

# 5) Secret scan (warn-only)
grep -RInE '(token|password|secret|apikey|api_key)' "$TARGET_REPO_DIR" | head -n 50 > "$WORKROOT/secret_scan.txt" || true

# 6) Plugins parsing
if [ ! -f "$PLUG_AWK" ]; then
  warn "plug_parser.awk not found at $PLUG_AWK"
  echo "warn: plug_parser.awk missing" >> "$ERRORS"
else
  if [ -f "$TARGET_REPO_DIR/mkdocs.yml" ]; then
    awk -f "$PLUG_AWK" "$TARGET_REPO_DIR/mkdocs.yml" | sort -u > "$WORKROOT/target_plugins.txt" || true
  fi
  if [ -f "$CURRENT_REPO/mkdocs.yml" ]; then
    awk -f "$PLUG_AWK" "$CURRENT_REPO/mkdocs.yml" | sort -u > "$WORKROOT/current_plugins.txt" || true
  fi
  if [ -f "$WORKROOT/target_plugins.txt" ] && [ -f "$WORKROOT/current_plugins.txt" ]; then
    sort -u "$WORKROOT/target_plugins.txt" > "$WORKROOT/target_plugins.sorted"
    sort -u "$WORKROOT/current_plugins.txt" > "$WORKROOT/current_plugins.sorted"
    comm -13 "$WORKROOT/current_plugins.sorted" "$WORKROOT/target_plugins.sorted" > "$WORKROOT/missing_in_current.txt" || true
    comm -23 "$WORKROOT/current_plugins.sorted" "$WORKROOT/target_plugins.sorted" > "$WORKROOT/extra_in_current.txt" || true
    awk 'NF{print}' "$WORKROOT/missing_in_current.txt" > "$WORKROOT/plugins_focus.txt" || true
  fi
fi

# 7) CSS variables hits
grep -RInE -- '(\-\-md\-|:root|\-\-mkdocs)' "$TARGET_REPO_DIR" | head -n 200 > "$WORKROOT/css_vars_hits.txt" || true

# 8) Build check (non-interactive)
BUILD_STATUS="skip"
if command -v mkdocs >/dev/null 2>&1; then
  (cd "$TARGET_REPO_DIR" && mkdocs -q build >/dev/null 2>&1) && BUILD_STATUS="ok" || BUILD_STATUS="fail"
fi
printf '%s\n' "$BUILD_STATUS" > "$WORKROOT/build.status"

# 9) Summary
log "Outputs in: $WORKROOT"
log "Errors (first 80 lines if any):"
[ -s "$ERRORS" ] && sed -n '1,80p' "$ERRORS" || log "no errors"

exit 0
