#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

script_name="${0##*/}"
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
CONTEXT_PACKAGE="/home/daclab-ai/Downloads/firebase-architecture-schema-docs-pack.zip"
TEMP_DIR="/tmp/firebase-docs-context-$(date +%s)"

cleanup() {
    echo "[$script_name] Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

log() { printf '[%s] %s\n' "$script_name" "$*"; }

main() {
    log "Starting Firebase documentation generation process"
    
    # Verify context package exists
    if [ ! -f "$CONTEXT_PACKAGE" ]; then
        log "Error: Context package not found at $CONTEXT_PACKAGE"
        exit 1
    fi
    
    # Create temp directory and extract
    log "Extracting context package..."
    mkdir -p "$TEMP_DIR"
    unzip -q "$CONTEXT_PACKAGE" -d "$TEMP_DIR/"
    
    # Find the master prompt
    PROMPT_FILE=$(find "$TEMP_DIR" -name "master-agent-prompt.md" -type f | head -1)
    if [ -z "$PROMPT_FILE" ]; then
        log "Error: Master prompt not found in package"
        exit 1
    fi
    
    log "Found master prompt at: $PROMPT_FILE"
    
    # Read prompt content
    PROMPT_CONTENT=$(<"$PROMPT_FILE")
    
    # Copy any template files to project
    if [ -d "$TEMP_DIR/docs" ]; then
        log "Copying documentation templates..."
        cp -r "$TEMP_DIR/docs"/* "$PROJECT_ROOT/docs/" 2>/dev/null || true
    fi
    
    # Create enhanced prompt with context
    log "Preparing enhanced prompt with context..."
    
    # Create a working context directory in the project
    WORKING_CONTEXT="$PROJECT_ROOT/working-context"
    mkdir -p "$WORKING_CONTEXT"
    
    # Copy extracted docs to working context
    cp -r "$TEMP_DIR"/* "$WORKING_CONTEXT/" 2>/dev/null || true
    
    # Create enhanced prompt with project context
    ENHANCED_PROMPT="# Firebase Full-Stack Integration Documentation Generation

## Context Available
- Project Root: $PROJECT_ROOT
- Working Context: ./working-context/ (contains extracted templates and roadmap)
- WARP Configuration: ./WARP.md
- Current Firebase Configuration: ./infra/firebase/
- Frontend Schema Files: ./apps/web/src/schemas/
- Backend Functions: ./infra/firebase/functions/src/

## Master Instructions
$PROMPT_CONTENT

## Final Output Location
Generate the complete documentation at: docs/02-Architecture/firebase-full-stack-integration.md"
    
    # Execute Codex CLI
    log "Executing Codex CLI agent..."
    cd "$PROJECT_ROOT"
    
    codex exec -C "$PROJECT_ROOT" \
        --full-auto \
        --sandbox workspace-write \
        "$ENHANCED_PROMPT"
    
    log "Firebase documentation generation complete!"
    log "Check: $PROJECT_ROOT/docs/02-Architecture/firebase-full-stack-integration.md"
}

main "$@"
