# 🎯 Migration Summary: web-next → Production Stack

## 📌 Quick Overview

**Problem**: `/apps/web-next` built with Next.js has good functionality but wrong tech stack  
**Solution**: Convert to Vite + React + TypeScript matching `/apps/web` production stack  
**Bonus**: Archive unused `rize-frontend-analysis` and `rize-turbo` directories  

---

## 🚀 Execute Migration (One Command)

```bash
cd /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm
./execute-migration.sh
```

Or run codex directly:
```bash
codex cli --cwd /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm \
  --task "Execute complete migration from MIGRATE_WEBNEXT_TO_PRODUCTION.md"
```

---

## 📋 What Gets Changed

### 1. Archived (moved to `/archive/`)
- ❌ `rize-frontend-analysis/` → Empty directory, no references
- ❌ `rize-turbo/` → Old monorepo experiment, superseded

### 2. Stack Transformation
| Component | Before (Next.js) | After (Vite) |
|-----------|-----------------|--------------|
| Framework | Next.js 14 | Vite 5.4.10 + React 18.3.1 |
| Routing | next/router | react-router-dom 6.27 |
| Images | next/image | Standard `<img>` |
| Links | next/link | react-router-dom Link |
| Port | 3001 | 3001 (maintained) |

### 3. Dependencies Updated
- Match `/apps/web/package.json` versions exactly
- Remove: `next`, `next-themes` (Next-specific)
- Add: `@vitejs/plugin-react`, `vite`, `react-router-dom`
- Keep: All Radix UI, shadcn, TanStack, Firebase

### 4. Configuration Files
- ✅ `vite.config.ts` - Match `/apps/web` with port 3001
- ✅ `tailwind.config.ts` - Exact copy from `/apps/web`
- ✅ `tsconfig.json` - Match `/apps/web` with Vite types
- ✅ `index.html` - New Vite entry point
- ✅ `src/main.tsx` - New React entry (not App.tsx from Next)

### 5. Component Migrations
```typescript
// Pattern: Replace Next.js imports
- import { useRouter } from 'next/router'
+ import { useNavigate } from 'react-router-dom'

- import Link from 'next/link'
+ import { Link } from 'react-router-dom'

- import Image from 'next/image'
+ // Use standard <img> or custom wrapper

// Keep these unchanged:
✓ Radix UI components
✓ react-hook-form + zod
✓ Custom hooks (useCountdown, useExitIntent, etc.)
✓ Firebase integration
✓ Zustand stores
```

---

## ✅ Success Validation

After migration completes:

```bash
cd /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm

# 1. Install dependencies
pnpm install

# 2. Test dev server
pnpm --filter @jrpm/web-next dev
# ✅ Should start on http://localhost:3001

# 3. Test production build
pnpm --filter @jrpm/web-next build
# ✅ Should complete with no errors

# 4. Run linter
pnpm --filter @jrpm/web-next lint
# ✅ Should pass

# 5. Check no Next.js remains
grep -r "from 'next" apps/web-next/src
# ✅ Should return nothing

# 6. Verify archives
ls -la archive/
# ✅ Should show rize directories with timestamps
```

---

## 📦 Key Files to Review After Migration

1. **MIGRATION_COMPLETE.md** - Detailed before/after report
2. **apps/web-next/package.json** - Verify no Next.js deps
3. **apps/web-next/vite.config.ts** - Check aliases and port
4. **apps/web-next/src/main.tsx** - New entry point
5. **apps/web-next/src/App.tsx** - React Router setup
6. **archive/ARCHIVE_LOG.md** - What was archived and why

---

## 🎯 Tech Stack Reference

### Production Stack (from `/apps/web`)
```json
{
  "name": "@jrpm/web-next",
  "framework": "Vite 5.4.10 + React 18.3.1",
  "language": "TypeScript 5.6.3",
  "styling": "Tailwind CSS 3.4.14",
  "ui": "@diatonic/ui + shadcn/Radix",
  "routing": "react-router-dom 6.27.0",
  "state": "Zustand 4.5.0 + TanStack Query 5.51.0",
  "forms": "react-hook-form 7.65.0 + zod 3.25.76",
  "backend": "Firebase 11.0.0",
  "port": "3001"
}
```

### Directory Structure After Migration
```
apps/web-next/
├── src/
│   ├── main.tsx              ← New Vite entry
│   ├── App.tsx               ← React Router setup
│   ├── components/
│   │   └── ui/              ← shadcn components
│   ├── lib/
│   │   ├── firebase/        ← Points to /backend
│   │   └── utils.ts
│   ├── hooks/               ← Preserved custom hooks
│   ├── contexts/            ← AuthContext preserved
│   ├── pages/               ← Route components
│   └── styles/
│       └── globals.css      ← Copied from /apps/web
├── public/
├── index.html               ← New Vite entry HTML
├── vite.config.ts           ← New (was next.config.js)
├── tailwind.config.ts       ← Matched to /apps/web
├── tsconfig.json            ← Updated for Vite
└── package.json             ← No Next.js deps
```

---

## 🔧 Troubleshooting

### Migration fails with "codex not found"
```bash
# Install codex CLI first
npm install -g @codex-cli/core
# Or use npx
npx @codex-cli/core cli --cwd . ...
```

### Want to see the plan without executing?
```bash
# Read the detailed specification
cat MIGRATE_WEBNEXT_TO_PRODUCTION.md | less
```

### Need to undo the migration?
```bash
# Restore from git (if committed before)
git restore apps/web-next/
git restore rize-frontend-analysis rize-turbo

# Or restore from archive
cd archive
# Extract most recent backup if needed
```

---

## 📚 Documentation References

- **Full Spec**: `MIGRATE_WEBNEXT_TO_PRODUCTION.md` (598 lines)
- **Execution**: `execute-migration.sh` (44 lines)
- **This Summary**: Quick reference and validation

---

## 🎯 Expected Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Archive | 5 min | Move rize directories |
| Stack Align | 15 min | Update configs, dependencies |
| Components | 20 min | Migrate Next.js → React Router |
| Firebase | 10 min | Update backend integration |
| Styling | 15 min | Copy globals.css, match theming |
| Build & Test | 10 min | Validate everything works |
| **Total** | **~75 min** | **Complete migration** |

---

**Ready to execute?** Run `./execute-migration.sh` and check `MIGRATION_COMPLETE.md` when done! 🚀
