#!/usr/bin/env bash
set -Eeuo pipefail

# Component extraction automation script
# Usage: ./scripts/extract-component.sh <component-name> <component-path>

COMPONENT_NAME="${1:-}"
SOURCE_PATH="${2:-apps/web-next/components/ui/${COMPONENT_NAME}.tsx}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${CYAN}[extract]${NC} $*"
}

error() {
    echo -e "${RED}[error]${NC} $*"
    exit 1
}

success() {
    echo -e "${GREEN}[success]${NC} $*"
}

warn() {
    echo -e "${YELLOW}[warning]${NC} $*"
}

# Validate input
if [[ -z "$COMPONENT_NAME" ]]; then
    error "Usage: $0 <component-name> [source-path]"
fi

log "Extracting component: ${YELLOW}${COMPONENT_NAME}${NC}"

# Determine target path
TARGET_DIR="shared/components/ui/${COMPONENT_NAME}"

# Check if source exists
if [[ ! -f "$SOURCE_PATH" ]]; then
    error "Source component not found: $SOURCE_PATH"
fi

log "Source: $SOURCE_PATH"
log "Target: $TARGET_DIR"

# Create target directory
mkdir -p "$TARGET_DIR"
success "Created directory: $TARGET_DIR"

# Copy component file
COMPONENT_FILE="${COMPONENT_NAME}.tsx"
cp "$SOURCE_PATH" "$TARGET_DIR/$COMPONENT_FILE"
success "Copied component file"

# Create index.ts export
cat > "$TARGET_DIR/index.ts" <<EOF
// Auto-generated export file
export * from './${COMPONENT_NAME}'
EOF
success "Created index.ts export"

# Extract component name patterns for proper casing
PASCAL_NAME=$(echo "$COMPONENT_NAME" | sed -r 's/(^|-)([a-z])/\U\2/g')

# Analyze imports
log "Analyzing dependencies..."
IMPORTS=$(grep -E "^import" "$TARGET_DIR/$COMPONENT_FILE" || true)

if echo "$IMPORTS" | grep -q "@/"; then
    warn "Component has local imports (@/), may need adjustment"
    echo "$IMPORTS" | grep "@/"
fi

if echo "$IMPORTS" | grep -q "\.\./"; then
    warn "Component has relative imports (../), may need adjustment"
    echo "$IMPORTS" | grep "\.\.\/"
fi

# Create README
cat > "$TARGET_DIR/README.md" <<EOF
# ${PASCAL_NAME}

Extracted: $(date)  
Source: \`${SOURCE_PATH}\`

## Usage

\`\`\`tsx
import { ${PASCAL_NAME} } from '@shared/components/ui/${COMPONENT_NAME}'

export function Example() {
  return <${PASCAL_NAME}>Content</${PASCAL_NAME}>
}
\`\`\`

## Props

See TypeScript definitions in \`${COMPONENT_FILE}\`

## Notes

- Extracted from Next.js app
- Shared between Vite and Next.js apps
- Uses shadcn/ui patterns

## TODO

- [ ] Update imports in Next.js app
- [ ] Add usage in Vite app
- [ ] Write unit tests
- [ ] Document all props
EOF
success "Created README.md"

# Update Next.js app imports
log "Updating imports in Next.js app..."
NEXT_FILES=$(find apps/web-next -name "*.tsx" -o -name "*.ts" | grep -v node_modules || true)

UPDATED_COUNT=0
for file in $NEXT_FILES; do
    if grep -q "from.*['\"].*components/ui/${COMPONENT_NAME}" "$file" 2>/dev/null; then
        sed -i "s|from ['\"].*components/ui/${COMPONENT_NAME}['\"]|from '@shared/components/ui/${COMPONENT_NAME}'|g" "$file"
        UPDATED_COUNT=$((UPDATED_COUNT + 1))
        log "  Updated: $file"
    fi
done

if [[ $UPDATED_COUNT -gt 0 ]]; then
    success "Updated $UPDATED_COUNT files in Next.js app"
else
    warn "No import updates needed in Next.js app"
fi

# Generate extraction report
REPORT_FILE="docs/phase2/extractions/extraction-${COMPONENT_NAME}-${TIMESTAMP}.md"
mkdir -p "$(dirname "$REPORT_FILE")"

cat > "$REPORT_FILE" <<EOF
# Component Extraction Report: ${PASCAL_NAME}

**Date**: $(date)  
**Component**: ${COMPONENT_NAME}  
**Status**: ✅ Extracted

## Details

- **Source**: \`${SOURCE_PATH}\`
- **Target**: \`${TARGET_DIR}\`
- **Files Created**:
  - \`${TARGET_DIR}/${COMPONENT_FILE}\`
  - \`${TARGET_DIR}/index.ts\`
  - \`${TARGET_DIR}/README.md\`
- **Files Updated**: ${UPDATED_COUNT} files in Next.js app

## Dependencies

\`\`\`
${IMPORTS}
\`\`\`

## Next Steps

- [ ] Test component in Next.js app: \`pnpm dev:next\`
- [ ] Use component in Vite app
- [ ] Write unit tests
- [ ] Update documentation

## Commands

\`\`\`bash
# Test Next.js app
pnpm --filter @diatonic/web-next dev

# Test Vite app (when ready)
pnpm --filter @diatonic/web dev

# View component
cat ${TARGET_DIR}/${COMPONENT_FILE}
\`\`\`
EOF

success "Created extraction report: $REPORT_FILE"

# Final summary
log ""
log "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
log "${GREEN}✨ Component Extraction Complete!${NC}"
log "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
log ""
log "Component: ${YELLOW}${PASCAL_NAME}${NC}"
log "Location: ${CYAN}${TARGET_DIR}${NC}"
log "Report: ${CYAN}${REPORT_FILE}${NC}"
log ""
log "📝 Next Steps:"
log "  1. Test Next.js app: ${YELLOW}pnpm dev:next${NC}"
log "  2. Use in Vite app: ${YELLOW}import { ${PASCAL_NAME} } from '@shared/components/ui/${COMPONENT_NAME}'${NC}"
log "  3. Write tests: ${YELLOW}shared/components/ui/${COMPONENT_NAME}/${COMPONENT_NAME}.test.tsx${NC}"
log ""
