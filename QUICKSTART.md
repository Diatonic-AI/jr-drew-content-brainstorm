# 🚀 Quick Start Guide - Diatonic Monorepo

**Phase 1: Coexistence** is **COMPLETE** ✅  
Both Vite and Next.js apps are ready to use!

---

## ⚡ Start Developing (Choose One)

### Option 1: Vite App (Existing, Production)
```bash
pnpm dev:vite
```
Open **http://localhost:5173**

### Option 2: Next.js App (New, with shadcn/ui)
```bash
pnpm dev:next
```
Open **http://localhost:3001**

### Option 3: Run Both Simultaneously
```bash
pnpm dev:all
```
- Vite: **http://localhost:5173**
- Next.js: **http://localhost:3001**

---

## 🔥 Firebase Local Development

### Start Full Stack Development (Two Terminals)

**Terminal 1 — Firebase Emulators**
```bash
pnpm dev:emulators
```
→ Opens http://127.0.0.1:4001 (Emulator UI)

**Terminal 2 — Frontend with Emulator Connection**
```bash
pnpm --filter @jrpm/web dev:emulators
```
→ Opens http://127.0.0.1:5173 (connected to local Firebase)

**Verification**
```bash
./scripts/validate-dev-env.sh
```

**Access Points**
- **Vite App**: http://127.0.0.1:5173
- **Emulator UI**: http://127.0.0.1:4001 (Auth, Firestore, Functions, Storage)
- **Emulated Hosting**: http://127.0.0.1:5013

**📖 Full Guide**: [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md)

---

## 📁 Project Structure

```
diatonic-monorepo/
├── apps/
│   ├── web/              # ⚡ Vite + React (port 5173)
│   ├── web-next/         # 🎨 Next.js 14 + shadcn/ui (port 3001)
│   └── electron/         # 🖥️  Desktop app
├── shared/               # 📦 Shared components & utilities
│   ├── components/       # React components (both apps can use)
│   ├── lib/             # Utilities, hooks, Firebase helpers
│   └── types/           # TypeScript definitions
└── backend/
    └── firebase/         # 🔥 Firebase backend (unified)
```

---

## 💻 Development Commands

### Start Development
```bash
# Vite app
pnpm dev:vite

# Next.js app
pnpm dev:next

# Both apps
pnpm dev:all

# Electron (with Vite)
ELECTRON_APP=vite pnpm dev:electron

# Electron (with Next.js)
ELECTRON_APP=next pnpm dev:electron
```

### Build for Production
```bash
# Build everything
pnpm build

# Build specific app
pnpm --filter @diatonic/web build
pnpm --filter @diatonic/web-next build
```

### Testing & Linting
```bash
# Run all tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm typecheck
```

---

## 🎯 What's Available

### In apps/web (Vite)
- ⚡ Fast HMR (Hot Module Replacement)
- 🎨 TailwindCSS styling
- 🔥 Firebase integration
- 📱 Responsive design
- 🔧 `@shared` imports configured

### In apps/web-next (Next.js)
- ✨ **shadcn/ui components**:
  - Button
  - Card
  - Input
  - Label
- 📊 **Custom components**:
  - DailyTimeline
  - StatCard
  - Sidebar
- 🎨 TailwindCSS + dark mode
- 🔥 Firebase integration
- 🚀 Next.js 14 features (SSR, SSG, App Router)

### In shared/
- 📦 Shared component library (ready to populate)
- 🛠️ Utilities and hooks
- 🔥 Firebase helpers
- 📝 TypeScript types

---

## 🧩 Using Shared Components

### Step 1: Create a shared component
```bash
mkdir -p shared/components/common/MyButton
```

```tsx
// shared/components/common/MyButton/MyButton.tsx
export function MyButton({ children, ...props }) {
  return <button className="btn" {...props}>{children}</button>
}

// shared/components/common/MyButton/index.ts
export { MyButton } from './MyButton'
```

### Step 2: Use in Vite app
```tsx
// apps/web/src/App.tsx
import { MyButton } from '@shared/components/common/MyButton'

export function App() {
  return <MyButton>Click me</MyButton>
}
```

### Step 3: Use in Next.js app
```tsx
// apps/web-next/app/page.tsx
import { MyButton } from '@shared/components/common/MyButton'

export default function Page() {
  return <MyButton>Click me</MyButton>
}
```

---

## 📚 Documentation

- **Migration Strategy**: [docs/MIGRATION_STRATEGY.md](docs/MIGRATION_STRATEGY.md)
- **Merge Summary**: [reports/merge_20251029-020330/MERGE_SUMMARY.md](reports/merge_20251029-020330/MERGE_SUMMARY.md)
- **Full Logs**: `logs/merge_intelligent_*.log`
- **Backup**: `.backup/merge_20251029-020330/`

---

## 🎓 Next Steps

### Phase 2: Gradual Adoption (4-6 weeks)

#### Week 1-2: Extract Components
```bash
# Audit existing components
find apps/web/src/components -name "*.tsx" > docs/component-inventory.txt

# Extract a component to shared
mkdir -p shared/components/common/Button
cp apps/web/src/components/Button.tsx shared/components/common/Button/
# Update imports in both apps
```

#### Week 3-4: Build New Features
```bash
# Create new feature in Next.js
mkdir -p apps/web-next/app/analytics
cd apps/web-next/app/analytics
touch page.tsx layout.tsx loading.tsx

# Start developing
pnpm dev:next
```

#### Week 5-6: Test Everything
```bash
# Test both apps
pnpm dev:vite  # Verify no regressions
pnpm dev:next  # Verify new features work

# Run tests
pnpm test
```

---

## 🐛 Troubleshooting

### Vite app not starting?
```bash
cd apps/web
rm -rf node_modules .vite
pnpm install
pnpm dev
```

### Next.js app build errors?
```bash
cd apps/web-next
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Shared components not found?
```bash
# Check path mappings in tsconfig.json
cat apps/web/tsconfig.json | grep @shared
cat apps/web-next/tsconfig.json | grep @shared
```

### Port already in use?
```bash
# Kill processes on ports
kill $(lsof -t -i:5173)  # Vite
kill $(lsof -t -i:3001)  # Next.js
```

---

## 🔄 Rollback

If something goes wrong:
```bash
# Restore from backup
rsync -av .backup/merge_20251029-020330/ ./ --exclude='.backup'

# Or use git
git checkout apps/ package.json pnpm-workspace.yaml
```

---

## ✅ Verification Checklist

- [ ] Dependencies installed: `pnpm install`
- [ ] Vite app runs: `pnpm dev:vite`
- [ ] Next.js app runs: `pnpm dev:next`
- [ ] Shared components accessible in both apps
- [ ] Firebase backend configured
- [ ] Documentation reviewed

---

## 🆘 Need Help?

1. Check [docs/MIGRATION_STRATEGY.md](docs/MIGRATION_STRATEGY.md) for detailed guide
2. Review logs in `logs/` directory
3. Check merge reports in `reports/` directory
4. Restore from backup if needed: `.backup/merge_20251029-020330/`

---

## 📊 Current Status

**✅ Phase 1: COMPLETE**
- Both apps running independently
- Shared library structure created
- Backend consolidated
- Dependencies installed
- Documentation generated

**🔜 Phase 2: READY TO START**
- Extract components to `shared/`
- Build new features in Next.js
- Update Vite app to use shared components

**📅 Phase 3: PLANNED**
- Choose primary framework
- Complete migration
- Optional: deprecate secondary framework

---

**Happy coding!** 🎉
