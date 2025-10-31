#!/usr/bin/env bash

echo "=== Firebase Documentation Setup Verification ==="
echo

# Check for context package
PACKAGE="/home/daclab-ai/Downloads/firebase-architecture-schema-docs-pack.zip"
if [ -f "$PACKAGE" ]; then
    echo "✓ Context package found: $PACKAGE"
    echo "  Size: $(du -h "$PACKAGE" | cut -f1)"
else
    echo "✗ Context package NOT found at: $PACKAGE"
fi

# Check for Codex CLI
if command -v codex &> /dev/null; then
    echo "✓ Codex CLI is installed"
    echo "  Version: $(codex --version 2>/dev/null || echo 'version unknown')"
else
    echo "✗ Codex CLI is NOT installed"
fi

# Check project structure
PROJECT_ROOT="/home/daclab-ai/Documents/JR-Drew-Content-Brainstorm"
if [ -f "$PROJECT_ROOT/WARP.md" ]; then
    echo "✓ WARP.md found in project root"
else
    echo "✗ WARP.md NOT found"
fi

if [ -d "$PROJECT_ROOT/docs/02-Architecture" ]; then
    echo "✓ Documentation directory exists"
else
    echo "⚠ Documentation directory will be created"
fi

# Check for execution script
if [ -f "$PROJECT_ROOT/execute-firebase-docs.sh" ]; then
    echo "✓ Execution script created"
else
    echo "✗ Execution script not found"
fi

echo
echo "=== Next Steps ==="
echo "1. Ensure Codex CLI is installed and configured"
echo "2. Run: cd $PROJECT_ROOT"
echo "3. Execute: ./execute-firebase-docs.sh"
echo
