#!/usr/bin/env bash
set -Eeuo pipefail

# Navigate to project root
cd /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm

echo "🎯 Starting Migration: web-next Next.js → Vite + Production Stack"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create prompt file
cat > /tmp/migration-prompt.txt << 'CODEX_PROMPT'
You are executing a complete migration following the specification in MIGRATE_WEBNEXT_TO_PRODUCTION.md

**Your mission:**
1. Archive unused directories (rize-frontend-analysis, if present, and rize-turbo, if present) to /archive/ with timestamps
2. Convert /apps/web-next from Next.js to Vite matching /apps/web stack exactly
3. Migrate all components from Next.js patterns to React Router + Vite
4. Update Firebase configuration to point to /backend
5. Match all styling, theming, and component patterns from /apps/web
6. Ensure clean build: pnpm install && pnpm build
7. Generate MIGRATION_COMPLETE.md with detailed before/after comparison

**Critical requirements:**
- Match EXACT package versions from /apps/web/package.json
- Use Vite ^5.4.10, React ^18.3.1, TypeScript ^5.6.3
- Configure port 3001 for web-next (avoid conflict with web:5173)
- Preserve custom hooks (useCountdown, useExitIntent, useNarrator, useTypewriter)
- Remove ALL Next.js imports (next/router, next/image, next/link, etc.)
- Use react-router-dom for routing
- Maintain @diatonic/ui integration
- Copy globals.css from /apps/web for consistent theming
- Support Firebase emulators with VITE_USE_EMULATORS flag

**Validation:**
- Run lint, build, and dev checks
- Verify no Next.js dependencies remain
- Document everything in MIGRATION_COMPLETE.md

Read MIGRATE_WEBNEXT_TO_PRODUCTION.md for full specifications and execute the complete migration now.
CODEX_PROMPT

# Execute with codex CLI using prompt file
codex "$(cat /tmp/migration-prompt.txt)"

echo ""
echo "✅ Migration execution complete!"
echo "📋 Check MIGRATION_COMPLETE.md for detailed report"
