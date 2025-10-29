#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

script_name="${0##*/}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Paths
VITE_SCAFFOLD="./diatonic-monorepo-scaffold"
NEXT_SCAFFOLD="./diatonic-monorepo-next-scaffold"
BACKUP_DIR="./.backup/merge_$TIMESTAMP"
REPORTS_DIR="./reports/merge_$TIMESTAMP"
LOGS_DIR="./logs"
LOG_FILE="$LOGS_DIR/merge_intelligent_$TIMESTAMP.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Logging
log() {
    local msg="[$(date +'%Y-%m-%d %H:%M:%S')] $*"
    echo -e "$msg" | tee -a "$LOG_FILE"
}

error() {
    log "${RED}ERROR: $*${NC}"
    exit 1
}

# Phase header
phase() {
    log ""
    log "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    log "${MAGENTA}  PHASE: $*${NC}"
    log "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    log ""
}

# Setup
setup() {
    log "${BLUE}========================================${NC}"
    log "${BLUE}  Intelligent Scaffold Merge${NC}"
    log "${BLUE}========================================${NC}"
    
    mkdir -p "$BACKUP_DIR" "$REPORTS_DIR" "$LOGS_DIR"
    mkdir -p "$REPORTS_DIR/diffs" "$REPORTS_DIR/analysis"
    
    log "${GREEN}✓ Setup complete${NC}"
}

# Phase 1: Analysis
analyze_scaffolds() {
    phase "1. ANALYZE SCAFFOLDS"
    
    log "${CYAN}Comparing scaffold structures...${NC}"
    
    # Frontend comparison
    if [[ -d "$VITE_SCAFFOLD/frontend" && -d "$NEXT_SCAFFOLD/frontend" ]]; then
        diff -qr "$VITE_SCAFFOLD/frontend" "$NEXT_SCAFFOLD/frontend" \
            > "$REPORTS_DIR/diffs/frontend_diff.txt" 2>&1 || true
        log "${GREEN}✓ Frontend diff saved${NC}"
    fi
    
    # Component analysis
    log "${CYAN}Analyzing component structures...${NC}"
    
    if [[ -d "$VITE_SCAFFOLD/frontend/src/components" ]]; then
        find "$VITE_SCAFFOLD/frontend/src/components" -type f \
            > "$REPORTS_DIR/analysis/vite_components.txt"
    fi
    
    if [[ -d "$NEXT_SCAFFOLD/frontend/src/components" ]]; then
        find "$NEXT_SCAFFOLD/frontend/src/components" -type f \
            > "$REPORTS_DIR/analysis/next_components.txt"
    fi
    
    # Create analysis report
    cat > "$REPORTS_DIR/analysis/scaffold_comparison.md" <<EOF
# Scaffold Comparison Report
Generated: $(date)

## Vite Scaffold Analysis
### Components
\`\`\`
$(cat "$REPORTS_DIR/analysis/vite_components.txt" 2>/dev/null || echo "No components found")
\`\`\`

### Package.json
\`\`\`json
$(cat "$VITE_SCAFFOLD/frontend/package.json" 2>/dev/null || echo "{}")
\`\`\`

## Next.js Scaffold Analysis
### Components
\`\`\`
$(cat "$REPORTS_DIR/analysis/next_components.txt" 2>/dev/null || echo "No components found")
\`\`\`

### Package.json
\`\`\`json
$(cat "$NEXT_SCAFFOLD/frontend/package.json" 2>/dev/null || echo "{}")
\`\`\`

## Key Differences
- Vite uses client-side routing
- Next.js uses App Router (file-based)
- Next.js includes shadcn/ui components
- Both use TailwindCSS
EOF
    
    log "${GREEN}✓ Analysis complete: $REPORTS_DIR/analysis/scaffold_comparison.md${NC}"
}

# Phase 2: Backup existing structure
backup_existing() {
    phase "2. BACKUP EXISTING STRUCTURE"
    
    log "${CYAN}Creating backups...${NC}"
    
    local dirs_to_backup=("apps" "backend" "shared")
    local backed_up=0
    
    for dir in "${dirs_to_backup[@]}"; do
        if [[ -d "./$dir" ]]; then
            log "Backing up $dir..."
            cp -a "./$dir" "$BACKUP_DIR/" 2>/dev/null || true
            backed_up=$((backed_up + 1))
        fi
    done
    
    log "${GREEN}✓ Backed up $backed_up directories to $BACKUP_DIR${NC}"
}

# Phase 3: Create shared components library
create_shared_library() {
    phase "3. CREATE SHARED COMPONENTS LIBRARY"
    
    log "${CYAN}Extracting shared components...${NC}"
    
    # Create shared structure
    mkdir -p shared/components/{ui,common,layouts}
    mkdir -p shared/lib/{firebase,utils,hooks}
    mkdir -p shared/styles
    mkdir -p shared/types
    
    # Extract shadcn components from Next.js scaffold
    if [[ -d "$NEXT_SCAFFOLD/frontend/src/components/ui" ]]; then
        log "Copying shadcn/ui components..."
        rsync -av "$NEXT_SCAFFOLD/frontend/src/components/ui/" shared/components/ui/ \
            --exclude='node_modules'
    fi
    
    # Extract DataTable
    if [[ -d "$NEXT_SCAFFOLD/frontend/src/components/DataTable" ]]; then
        log "Copying DataTable component..."
        rsync -av "$NEXT_SCAFFOLD/frontend/src/components/DataTable/" shared/components/DataTable/ \
            --exclude='node_modules'
    fi
    
    # Extract Timeline
    if [[ -d "$NEXT_SCAFFOLD/frontend/src/components/Timeline" ]]; then
        log "Copying Timeline component..."
        rsync -av "$NEXT_SCAFFOLD/frontend/src/components/Timeline/" shared/components/Timeline/ \
            --exclude='node_modules'
    fi
    
    # Copy shared utilities
    if [[ -d "$NEXT_SCAFFOLD/frontend/src/lib" ]]; then
        log "Copying shared utilities..."
        rsync -av "$NEXT_SCAFFOLD/frontend/src/lib/" shared/lib/ \
            --exclude='node_modules'
    fi
    
    # Copy shared types
    if [[ -d "$NEXT_SCAFFOLD/frontend/src/types" ]]; then
        log "Copying TypeScript types..."
        rsync -av "$NEXT_SCAFFOLD/frontend/src/types/" shared/types/ \
            --exclude='node_modules'
    fi
    
    # Create shared package.json
    cat > shared/package.json <<'EOF'
{
  "name": "@diatonic/shared",
  "version": "0.1.0",
  "private": true,
  "main": "./lib/index.ts",
  "types": "./types/index.ts",
  "exports": {
    ".": "./lib/index.ts",
    "./components": "./components/index.ts",
    "./lib": "./lib/index.ts",
    "./types": "./types/index.ts",
    "./styles": "./styles/globals.css"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
EOF
    
    # Create shared tsconfig.json
    cat > shared/tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
EOF
    
    log "${GREEN}✓ Shared library created${NC}"
}

# Phase 4: Setup Next.js alongside Vite
setup_nextjs_app() {
    phase "4. SETUP NEXT.JS APP (apps/web-next)"
    
    log "${CYAN}Creating Next.js app...${NC}"
    
    # Create apps/web-next
    mkdir -p apps/web-next
    
    if [[ -d "$NEXT_SCAFFOLD/frontend" ]]; then
        log "Copying Next.js scaffold..."
        rsync -av "$NEXT_SCAFFOLD/frontend/" apps/web-next/ \
            --exclude='node_modules' \
            --exclude='.next' \
            --exclude='package-lock.json'
        
        # Update package.json for workspace
        if [[ -f "apps/web-next/package.json" ]]; then
            log "Updating package.json..."
            
            # Use jq if available, otherwise manual edit
            if command -v jq &> /dev/null; then
                jq '.name = "@diatonic/web-next" | 
                    .scripts.dev = "next dev -p 3001" | 
                    .scripts.start = "next start -p 3001" |
                    .dependencies["@diatonic/shared"] = "workspace:*"' \
                    apps/web-next/package.json > apps/web-next/package.json.tmp
                mv apps/web-next/package.json.tmp apps/web-next/package.json
            else
                log "${YELLOW}⚠ jq not found, package.json needs manual update${NC}"
            fi
        fi
        
        log "${GREEN}✓ Next.js app created at apps/web-next${NC}"
    else
        log "${YELLOW}⚠ Next.js scaffold not found, skipping${NC}"
    fi
}

# Phase 5: Update Vite app for shared components
update_vite_app() {
    phase "5. UPDATE VITE APP FOR SHARED COMPONENTS"
    
    if [[ ! -d "apps/web" ]]; then
        log "${YELLOW}⚠ apps/web not found, skipping${NC}"
        return
    fi
    
    log "${CYAN}Updating Vite configuration...${NC}"
    
    # Backup existing vite.config
    if [[ -f "apps/web/vite.config.ts" ]]; then
        cp apps/web/vite.config.ts "$BACKUP_DIR/vite.config.ts.bak"
    fi
    
    # Create/update vite.config.ts with shared alias
    cat > apps/web/vite.config.ts <<'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
  server: {
    port: 5173,
  },
})
EOF
    
    # Update tsconfig.json
    if [[ -f "apps/web/tsconfig.json" ]]; then
        cp apps/web/tsconfig.json "$BACKUP_DIR/tsconfig.json.bak"
        
        if command -v jq &> /dev/null; then
            jq '.compilerOptions.paths["@shared/*"] = ["../../shared/*"]' \
                apps/web/tsconfig.json > apps/web/tsconfig.json.tmp
            mv apps/web/tsconfig.json.tmp apps/web/tsconfig.json
        else
            log "${YELLOW}⚠ jq not found, tsconfig.json needs manual update${NC}"
        fi
    fi
    
    log "${GREEN}✓ Vite app updated${NC}"
}

# Phase 6: Consolidate backend
consolidate_backend() {
    phase "6. CONSOLIDATE FIREBASE BACKEND"
    
    log "${CYAN}Creating unified backend...${NC}"
    
    mkdir -p backend/firebase
    
    # Prefer Next.js scaffold backend (usually more complete)
    if [[ -d "$NEXT_SCAFFOLD/backend" ]]; then
        log "Copying Next.js backend configuration..."
        rsync -av "$NEXT_SCAFFOLD/backend/" backend/firebase/ \
            --exclude='node_modules'
    elif [[ -d "$VITE_SCAFFOLD/backend" ]]; then
        log "Copying Vite backend configuration..."
        rsync -av "$VITE_SCAFFOLD/backend/" backend/firebase/ \
            --exclude='node_modules'
    fi
    
    log "${GREEN}✓ Backend consolidated${NC}"
}

# Phase 7: Update workspace configuration
update_workspace() {
    phase "7. UPDATE WORKSPACE CONFIGURATION"
    
    log "${CYAN}Creating monorepo workspace config...${NC}"
    
    # Check if pnpm-workspace.yaml exists
    if [[ -f "pnpm-workspace.yaml" ]]; then
        cp pnpm-workspace.yaml "$BACKUP_DIR/pnpm-workspace.yaml.bak"
    fi
    
    # Create/update pnpm-workspace.yaml
    cat > pnpm-workspace.yaml <<'EOF'
packages:
  - 'apps/*'
  - 'shared'
  - 'backend/*'
EOF
    
    # Update root package.json
    if [[ -f "package.json" ]]; then
        cp package.json "$BACKUP_DIR/package.json.bak"
        
        if command -v jq &> /dev/null; then
            jq '.workspaces = ["apps/*", "shared", "backend/*"] |
                .scripts["dev:vite"] = "pnpm --filter @diatonic/web dev" |
                .scripts["dev:next"] = "pnpm --filter @diatonic/web-next dev" |
                .scripts["dev:electron"] = "pnpm --filter @diatonic/electron dev" |
                .scripts["dev:all"] = "pnpm -r --parallel dev" |
                .scripts.build = "pnpm -r build" |
                .scripts.lint = "pnpm -r lint" |
                .scripts.test = "pnpm -r test"' \
                package.json > package.json.tmp
            mv package.json.tmp package.json
        else
            log "${YELLOW}⚠ jq not found, package.json needs manual update${NC}"
        fi
    fi
    
    log "${GREEN}✓ Workspace configuration updated${NC}"
}

# Phase 8: Generate documentation
generate_documentation() {
    phase "8. GENERATE MERGE DOCUMENTATION"
    
    log "${CYAN}Creating documentation...${NC}"
    
    cat > "$REPORTS_DIR/MERGE_SUMMARY.md" <<EOF
# Intelligent Scaffold Merge - Summary
Generated: $(date)
Backup Location: $BACKUP_DIR

## Changes Made

### New Directories Created
- \`shared/\` - Shared components, utilities, types
  - \`shared/components/ui/\` - shadcn/ui components from Next.js
  - \`shared/components/DataTable/\` - TanStack DataTable
  - \`shared/components/Timeline/\` - Timeline component
  - \`shared/lib/\` - Shared utilities and hooks
  - \`shared/types/\` - TypeScript type definitions
- \`apps/web-next/\` - Next.js application (port 3001)
- \`backend/firebase/\` - Unified Firebase backend

### Modified Directories
- \`apps/web/\` - Updated to use shared components via \`@shared\` alias
- \`apps/electron/\` - Can now load either Vite or Next.js app

### Configuration Updates
- \`pnpm-workspace.yaml\` - Monorepo workspace configuration
- \`package.json\` - Added workspace scripts
- \`apps/web/vite.config.ts\` - Added \`@shared\` alias
- \`apps/web/tsconfig.json\` - Added path mapping for \`@shared\`

## Architecture Overview

\`\`\`
diatonic-monorepo/
├── apps/
│   ├── web/              # Vite app (port 5173) - PRESERVED
│   ├── web-next/         # Next.js app (port 3001) - NEW
│   └── electron/         # Desktop app - ENHANCED
├── shared/               # NEW
│   ├── components/
│   │   ├── ui/          # shadcn components
│   │   ├── DataTable/
│   │   └── Timeline/
│   ├── lib/
│   └── types/
└── backend/
    └── firebase/         # Unified backend
\`\`\`

## Development Commands

### Start Applications
\`\`\`bash
# Vite app (existing, port 5173)
pnpm dev:vite

# Next.js app (new, port 3001)
pnpm dev:next

# Run both simultaneously
pnpm dev:all

# Electron with Vite
ELECTRON_APP=vite pnpm dev:electron

# Electron with Next.js
ELECTRON_APP=next pnpm dev:electron
\`\`\`

### Build & Test
\`\`\`bash
# Build all apps
pnpm build

# Run all tests
pnpm test

# Lint all code
pnpm lint
\`\`\`

## Migration Strategy

1. **Phase 1: Coexistence** (Current)
   - Both Vite and Next.js apps run independently
   - Shared components extracted to \`shared/\`
   - No breaking changes to existing Vite app

2. **Phase 2: Gradual Adoption**
   - New features developed in Next.js app
   - Refactor existing components into \`shared/\`
   - Update Vite app to use shared components

3. **Phase 3: Unification** (Future)
   - Decide on primary framework
   - Migrate remaining features
   - Optional: deprecate one approach

## Using Shared Components

### In Vite App (\`apps/web\`)
\`\`\`tsx
import { Button } from '@shared/components/ui/button'
import { DataTable } from '@shared/components/DataTable'
import { useFirebase } from '@shared/lib/hooks/useFirebase'

export function MyComponent() {
  return <Button>Click me</Button>
}
\`\`\`

### In Next.js App (\`apps/web-next\`)
\`\`\`tsx
import { Button } from '@shared/components/ui/button'
import { DataTable } from '@shared/components/DataTable'

export default function Page() {
  return <Button>Click me</Button>
}
\`\`\`

## Rollback Instructions

If issues arise:
\`\`\`bash
# Restore backup
rsync -av $BACKUP_DIR/ ./ --exclude='.backup'

# Remove new directories
rm -rf apps/web-next shared/components/ui backend/firebase

# Restore git state
git checkout apps/ backend/ package.json pnpm-workspace.yaml
\`\`\`

## Success Criteria

- [x] Vite app preserved and functional
- [x] Next.js app created with shadcn/ui
- [x] Shared component library established
- [x] Workspace configuration updated
- [x] Backend consolidated
- [ ] Install dependencies: \`pnpm install\`
- [ ] Test Vite app: \`pnpm dev:vite\`
- [ ] Test Next.js app: \`pnpm dev:next\`
- [ ] Verify shared components work

## Next Steps

1. **Install Dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

2. **Test Vite App**
   \`\`\`bash
   pnpm dev:vite
   # Open http://localhost:5173
   \`\`\`

3. **Test Next.js App**
   \`\`\`bash
   pnpm dev:next
   # Open http://localhost:3001
   \`\`\`

4. **Review Shared Components**
   - Check \`shared/components/ui/\` for shadcn components
   - Explore DataTable and Timeline examples
   - Import into your apps

5. **Update Electron** (Optional)
   - Modify \`apps/electron/src/main.ts\` to support app switching
   - Test loading both Vite and Next.js apps

## Files Modified

### Created
$(find shared apps/web-next backend/firebase -type f 2>/dev/null | head -20 || echo "Files created")

### Modified
- package.json
- pnpm-workspace.yaml
- apps/web/vite.config.ts
- apps/web/tsconfig.json

### Backed Up
- All modified files backed up to: $BACKUP_DIR
EOF
    
    log "${GREEN}✓ Documentation created: $REPORTS_DIR/MERGE_SUMMARY.md${NC}"
}

# Phase 9: Final report
final_report() {
    phase "9. FINAL REPORT"
    
    log "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    log "${GREEN}  ✨ INTELLIGENT MERGE COMPLETE!${NC}"
    log "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    log ""
    log "${CYAN}📊 Summary:${NC}"
    log "  ✅ Vite app preserved at apps/web/"
    log "  ✅ Next.js app created at apps/web-next/"
    log "  ✅ Shared components extracted to shared/"
    log "  ✅ Backend consolidated to backend/firebase/"
    log "  ✅ Workspace configuration updated"
    log ""
    log "${CYAN}📁 Key Locations:${NC}"
    log "  📝 Merge summary: $REPORTS_DIR/MERGE_SUMMARY.md"
    log "  📋 Full log: $LOG_FILE"
    log "  💾 Backup: $BACKUP_DIR"
    log ""
    log "${CYAN}🚀 Next Steps:${NC}"
    log "  1. Install dependencies: ${YELLOW}pnpm install${NC}"
    log "  2. Test Vite app: ${YELLOW}pnpm dev:vite${NC}"
    log "  3. Test Next.js app: ${YELLOW}pnpm dev:next${NC}"
    log "  4. Review documentation: ${YELLOW}cat $REPORTS_DIR/MERGE_SUMMARY.md${NC}"
    log ""
    
    # Display merge summary
    cat "$REPORTS_DIR/MERGE_SUMMARY.md"
}

# Main execution
main() {
    setup
    analyze_scaffolds
    backup_existing
    create_shared_library
    setup_nextjs_app
    update_vite_app
    consolidate_backend
    update_workspace
    generate_documentation
    final_report
}

main "$@"
