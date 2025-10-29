# GitHub Copilot Instructions

## Project Overview
This is a **hybrid monorepo** supporting both **Vite + React** (`apps/web`) and **Next.js** (`apps/web-next`) frontends sharing components through a unified library (`shared/`). The project focuses on productivity tracking, form handling with React Hook Form + shadcn/ui, and Firebase integration.

## Architecture Pattern
- **Multi-frontend coexistence**: Vite (port 5173) for existing features, Next.js (port 3001) for new development
- **Shared component library**: `shared/components/ui/` contains shadcn/ui primitives with `@shared` alias
- **Firebase-first backend**: Unified backend at `infra/firebase/` with emulator suite for local development
- **Workspace management**: pnpm workspaces with cross-app dependency sharing

## Critical Development Workflows

### Starting Development Environment
```bash
# Terminal 1: Firebase emulators (required first)
pnpm dev:emulators

# Terminal 2: Choose your frontend
pnpm dev:web      # Vite app (existing, port 5173)
pnpm dev:next     # Next.js app (new, port 3001)
pnpm dev:all      # Both simultaneously
```

### Import Patterns (Essential)
```tsx
// Shared components (preferred for new code)
import { Button, Card } from '@shared/components/ui/button'
import { useFirebase } from '@shared/lib/hooks/useFirebase'

// Local app components
import { MyPage } from '@/pages/MyPage'  // Vite app
import { MyPage } from '@/app/MyPage'    // Next.js app
```

### Form Handling Convention
Use **React Hook Form + shadcn/ui + Zod** pattern seen in `apps/web/src/pages/Settings/Connections.tsx`:
```tsx
import { useForm } from 'react-hook-form'
import { Button, Input, Card } from '@shared/components/ui'

const { register, handleSubmit, formState: { isSubmitting } } = useForm({
  defaultValues: { /* ... */ }
})
```

## Firebase Integration Patterns

### Local Development Setup
- **Environment**: Always use emulators via `VITE_USE_EMULATORS=true`
- **Config location**: `infra/firebase/firebase.json` with ports: Auth(9105), Firestore(9181), Functions(5011)
- **Client config**: `apps/web/src/lib/firebase/client.ts` handles emulator connections

### Data Access Patterns
```tsx
// Collection/document patterns (from apps/web/src/lib/firebase/collections.ts)
const users = collection(db, 'users')
const projects = collection(db, 'orgs', orgId, 'projects')
const tasks = doc(db, 'orgs', orgId, 'projects', projectId, 'tasks', taskId)
```

## Component Library Standards

### File Organization
- **Shared components**: `shared/components/ui/{component}/` with index.ts exports
- **Component naming**: PascalCase files (`Button.tsx`) with lowercase directories (`button/`)
- **shadcn/ui integration**: Import and customize shadcn components in `shared/`, not directly in apps

### Styling Approach
- **Tailwind CSS**: Primary styling system with utility-first approach
- **Class composition**: Use `cn()` helper from `@shared/lib/utils` for conditional classes
- **Theme support**: `next-themes` provider in `shared/components/providers/theme-provider`

## Build System & Tooling

### Package Management
```bash
# Install deps for specific app
pnpm --filter @jrpm/web install package-name
pnpm --filter @jrpm/web-next install package-name

# Workspace-wide operations
pnpm -r build    # Build all packages
pnpm -r lint     # Lint all packages
```

### Key Scripts
- `pnpm bootstrap`: Install dependencies across all apps
- `pnpm lint:strict`: Runs strict ESLint config (see `eslint.strict.config.mjs`)
- `pnpm audit:firebase`: Custom Firebase configuration audit
- `make setup`: Python venv setup for CLI tools

### Directory-Specific Commands
- **MkDocs**: `pnpm docs:serve` or `make docs-serve` (requires Python venv)
- **Firebase**: All commands run from `infra/firebase/` directory
- **Electron**: `ELECTRON_APP=vite|next pnpm dev:electron` to choose frontend

## Integration Points & External Dependencies

### State Management
- **Zustand stores**: `apps/web/src/stores/` with entities, timer, and UI state
- **Persistence**: Some stores use Zustand persist middleware
- **Cross-app sharing**: Move stores to `shared/lib/stores/` when needed by both apps

### Testing & Quality
- **ESLint configs**: Dual configs (`warn` vs `strict`) - see `reports/eslint-tightening.md`
- **Firebase rules**: Firestore/Storage rules in `infra/firebase/` with emulator testing
- **Type safety**: Strict TypeScript across all packages

## Branch-Specific Context
Current branch `feat/forms-rhf-shadcn-firebase` indicates active work on:
- React Hook Form integration patterns
- shadcn/ui component standardization  
- Firebase form data persistence

## Troubleshooting Quick Reference
- **Port conflicts**: Run `scripts/validate-dev-env.sh` to check port availability
- **Import errors**: Check `@shared` alias in `vite.config.ts` and `tsconfig.json`
- **Firebase connection**: Verify emulators running and `VITE_USE_EMULATORS=true`
- **Build failures**: Check workspace dependencies with `pnpm -r install`

## Documentation Locations
- **Local development**: `docs/LOCAL_DEVELOPMENT.md`
- **Project structure**: `reports/merge_*/MERGE_SUMMARY.md`
- **Firebase setup**: `reports/firebase-audit.md`