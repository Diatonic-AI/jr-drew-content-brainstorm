#!/usr/bin/env bash
set -Eeuo pipefail

# Script to run Codex CLI agent for Firebase backend implementation
# Based on comprehensive audit findings

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Codex CLI: Firebase Backend Implementation ==="
echo "Project: $PROJECT_ROOT"
echo "Task: audits/CODEX_TASK_FIREBASE_IMPLEMENTATION.md"
echo ""

# Check if codex is installed
if ! command -v codex &> /dev/null; then
    echo "❌ Error: codex CLI not found"
    echo "Please install Codex CLI first"
    exit 1
fi

# Navigate to project root
cd "$PROJECT_ROOT"

# Verify required files exist
REQUIRED_FILES=(
    "audits/AUDIT_SUMMARY.md"
    "audits/schema-map.json"
    "audits/firebase-checklist.md"
    "audits/CODEX_TASK_FIREBASE_IMPLEMENTATION.md"
    "WARP.md"
)

echo "Checking required files..."
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        exit 1
    fi
    echo "✓ $file"
done

echo ""
echo "All audit files present. Ready to execute."
echo ""

# Option 1: Interactive mode with explicit context files
echo "=== Execution Option 1: Interactive with Context ===="
echo ""
cat << 'EOF'
codex exec --interactive \
  --context-files "audits/AUDIT_SUMMARY.md,audits/schema-map.json,audits/firebase-checklist.md,WARP.md" \
  -C "$PROJECT_ROOT" \
  "Review audits/CODEX_TASK_FIREBASE_IMPLEMENTATION.md and execute all 7 phases sequentially. Focus ONLY on backend Firebase infrastructure - no frontend changes. Test thoroughly in emulators before deploying to jrpm-dev environment."
EOF

echo ""
echo "=== Execution Option 2: Simple Task Reference ===="
echo ""
cat << 'EOF'
codex exec -C "$PROJECT_ROOT" \
  "Read and execute the task specification in audits/CODEX_TASK_FIREBASE_IMPLEMENTATION.md. Work phase by phase, commit after each phase, and ask for approval before deploying to production."
EOF

echo ""
echo "=== Execution Option 3: Full Automation (Advanced) ===="
echo ""
cat << 'EOF'
codex exec --full-auto \
  -C "$PROJECT_ROOT" \
  --context-files "audits/AUDIT_SUMMARY.md,audits/schema-map.json,audits/firebase-checklist.md,WARP.md,audits/CODEX_TASK_FIREBASE_IMPLEMENTATION.md" \
  "Implement Firebase backend infrastructure as specified in CODEX_TASK_FIREBASE_IMPLEMENTATION.md. Execute phases 1-6 (review, data model, indexes, security rules, functions, testing). Stop before deployment and await approval."
EOF

echo ""
echo "---"
echo "Choose an option and execute manually, or uncomment one below:"
echo ""

# Uncomment one of these to auto-execute:

# Option 1: Recommended - Interactive with checkpoints
# codex exec --interactive \
#   --context-files "audits/AUDIT_SUMMARY.md,audits/schema-map.json,audits/firebase-checklist.md,WARP.md" \
#   -C "$PROJECT_ROOT" \
#   "Review audits/CODEX_TASK_FIREBASE_IMPLEMENTATION.md and execute all 7 phases sequentially."

# Option 2: Simple
# codex exec -C "$PROJECT_ROOT" \
#   "Read and execute audits/CODEX_TASK_FIREBASE_IMPLEMENTATION.md"

# Option 3: Full automation (use with caution)
# codex exec --full-auto \
#   -C "$PROJECT_ROOT" \
#   --context-files "audits/AUDIT_SUMMARY.md,audits/schema-map.json,audits/firebase-checklist.md,WARP.md,audits/CODEX_TASK_FIREBASE_IMPLEMENTATION.md" \
#   "Implement Firebase backend per CODEX_TASK_FIREBASE_IMPLEMENTATION.md. Stop before deployment."

echo "To execute, uncomment desired option in this script and re-run."
echo "Or copy/paste a command above into your terminal."
