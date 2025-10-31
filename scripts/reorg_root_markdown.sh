#!/usr/bin/env bash
set -euo pipefail

# Reorganize root-level markdown files into docs/ taxonomy with normalized naming.
# Naming convention: YYYY-MM-DD-title-slug.md (all lowercase, hyphenated)
# If original filename already begins with a date pattern (YYYY-MM-DD-...), preserve that date prefix.

REPO_ROOT="$(git rev-parse --show-toplevel)"
DOCS_DIR="$REPO_ROOT/docs"

declare -A MAP
# Manual classification mapping: filename -> target subfolder (relative under docs)
MAP[BRANCHING.md]="governance"
MAP[CODE_OF_CONDUCT.md]="governance"
MAP[CONTRIBUTING.md]="guides"
MAP[codex-context-blackscreen-diagnosis.md]="automation/agents"
MAP[FIREBASE_DOCS_COMPLETION_SUMMARY.md]="backend"
MAP[FIREBASE_EMULATORS_COMPLETE.md]="backend"
MAP[FIREBASE_FUNCTIONS_ANALYSIS_20251031.md]="backend"
MAP[fix-all-issues.md]="refactor/tasks"
MAP[GIT_BRANCH_RESTRUCTURE_REPORT.md]="governance"
MAP[IMPLEMENTATION_SUMMARY.md]="00-Meta"
MAP[MIGRATE_WEBNEXT_TO_PRODUCTION.md]="phase2"
MAP[MIGRATION_COMPLETE.md]="phase2"
MAP[MIGRATION_FINAL_REPORT.md]="phase2"
MAP[MIGRATION_INDEX.md]="phase2"
MAP[MIGRATION_PROGRESS_REPORT.md]="phase2"
MAP[MIGRATION_SUMMARY.md]="phase2"
MAP[MONITORING_CHECKLIST_20251031.md]="backend"
MAP[PRE_FLIGHT_CHECKLIST.md]="phase2"
MAP[QUICKSTART.md]="guides"
MAP[README.md]="00-Meta"
MAP[REPO_AUDIT_2025-10-31.md]="00-Meta"
MAP[RUNNING_SERVICES.md]="backend"
MAP[SUCCESS_REPORT_20251031_1239.md]="backend"
MAP[WARP.md]="automation"
MAP[WARP_PLANNING_OUTPUT.md]="automation"
MAP[WARP_VALIDATION_REPORT.md]="automation"
MAP[WEB_NEXT_REMOVAL_AUDIT.md]="phase2"
MAP[Welcome.md]="00-Meta"
MAP[2025-10-27-62530-Brainstorm.md]="00-Meta"

slugify() {
  local input="$1"
  # Lowercase, replace non alphanum with hyphen, collapse multiple hyphens.
  echo "$input" \
    | tr 'A-Z' 'a-z' \
    | sed -E 's/[^a-z0-9]+/-/g' \
    | sed -E 's/^-+|-+$//g' \
    | sed -E 's/-{2,}/-/g'
}

extract_date_prefix() {
  local filename="$1"
  if [[ $filename =~ ^([0-9]{4}-[0-9]{2}-[0-9]{2})[-_] ]]; then
    echo "${BASH_REMATCH[1]}"
  else
    # Default to today's date if no prefix
    date +%Y-%m-%d
  fi
}

normalize_title_from_header() {
  local file="$1"
  local header
  header=$(grep -m1 '^#' "$file" || echo "")
  header=${header#\# } # remove leading '# '
  if [[ -z "$header" ]]; then
    header="${file%.md}" # fallback to filename sans extension
  fi
  slugify "$header"
}

process_file() {
  local file="$1"
  local src_path="$REPO_ROOT/$file"
  [[ -f $src_path ]] || { echo "Skip missing $file"; return; }
  local target_subdir="${MAP[$file]:-uncategorized}"
  local date_prefix
  date_prefix=$(extract_date_prefix "$file")
  local title_slug
  title_slug=$(normalize_title_from_header "$src_path")
  local new_name="${date_prefix}-${title_slug}.md"
  local dest_dir="$DOCS_DIR/$target_subdir"
  mkdir -p "$dest_dir"

  # Rewrite header line to match new slug (keep date prefix visible)
  local tmp_file
  tmp_file=$(mktemp)
  local first_line_replaced=0
  while IFS='' read -r line || [[ -n "$line" ]]; do
    if [[ $first_line_replaced -eq 0 && $line =~ ^# ]]; then
      echo "# ${date_prefix} ${title_slug}" >> "$tmp_file"
      first_line_replaced=1
    else
      echo "$line" >> "$tmp_file"
    fi
  done < "$src_path"
  if [[ $first_line_replaced -eq 0 ]]; then
    echo "# ${date_prefix} ${title_slug}" | cat - "$src_path" > "$tmp_file"
  fi

  mv "$tmp_file" "$src_path"
  git mv "$src_path" "$dest_dir/$new_name"
  echo "Moved $file -> $dest_dir/$new_name"
}

main() {
  cd "$REPO_ROOT"
  local files=( $(ls -1 *.md 2>/dev/null) )
  if [[ ${#files[@]} -eq 0 ]]; then
    echo "No root markdown files found."; exit 0;
  fi
  for f in "${files[@]}"; do
    process_file "$f"
  done
}

main "$@"
