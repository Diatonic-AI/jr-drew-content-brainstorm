# 🎯 ONE-SHOT CODEX CLI MIGRATION PROMPT

> **Goal**: Transform `/apps/web-next` (Next.js app with good functionality) into a production-ready Vite+React+TypeScript+Tailwind+shadcn submodule that matches the `/apps/web` stack exactly, while archiving unused rize directories.

---

## 📋 EXECUTION CHECKLIST

### Phase 1: Analysis & Archive (5 min)
- [ ] Check `/apps/web` for rize directory references
- [ ] Verify `rize-frontend-analysis` and `rize-turbo` are not imported/referenced
- [ ] Move both to `/archive/` with timestamp
- [ ] Document what was archived in `/archive/ARCHIVE_LOG.md`

### Phase 2: Stack Alignment (15 min)
- [ ] Convert web-next from Next.js to Vite
- [ ] Update all imports from Next.js patterns to Vite/React Router
- [ ] Match exact versions from `/apps/web/package.json`
- [ ] Align tsconfig, vite config, tailwind config with production
- [ ] Replace `@diatonic/shared` references with `@shared` alias

### Phase 3: Component Migration (20 min)
- [ ] Extract functional components from web-next
- [ ] Strip all Next.js specific code (getServerSideProps, Image, Link from next/*)
- [ ] Apply production UI patterns from `/apps/web/src/components`
- [ ] Use `@diatonic/ui` package components where available
- [ ] Ensure all shadcn/ui components use production theming

### Phase 4: Firebase Integration (10 min)
- [ ] Point to `/backend` Firebase configuration
- [ ] Use production Firebase initialization pattern from `/apps/web`
- [ ] Match auth flow and API patterns
- [ ] Ensure emulator support with `VITE_USE_EMULATORS` flag

### Phase 5: Styling & Branding (15 min)
- [ ] Copy CSS variables from `/apps/web/src/styles/globals.css`
- [ ] Match color scheme, typography, spacing
- [ ] Remove all web-next specific branding
- [ ] Apply production design tokens

### Phase 6: Build & Test (10 min)
- [ ] Verify `pnpm install` succeeds
- [ ] Run `pnpm dev` and check for errors
- [ ] Run `pnpm build` and ensure clean build
- [ ] Test with Firebase emulators

---

## 🎨 PRODUCTION STACK SPECIFICATION

### Technology Requirements
```json
{
  "framework": "Vite ^5.4.10 + React ^18.3.1",
  "language": "TypeScript ^5.6.3",
  "styling": "Tailwind CSS ^3.4.14 + tailwindcss-animate ^1.0.7",
  "ui_library": "@diatonic/ui (workspace package) + shadcn/radix components",
  "routing": "react-router-dom ^6.27.0",
  "state": "Zustand ^4.5.0 + TanStack Query ^5.51.0",
  "forms": "react-hook-form ^7.65.0 + zod ^3.25.76",
  "backend": "Firebase ^11.0.0 (pointing to /backend)",
  "build": "Vite with path aliases @/ and @shared/"
}
```

### File Structure Target
```
apps/web-next/
├── src/
│   ├── main.tsx              # Entry point (Vite pattern)
│   ├── App.tsx               # Root component with Router
│   ├── components/           # UI components
│   │   ├── ui/              # shadcn components
│   │   └── ...              # Feature components
│   ├── lib/
│   │   ├── firebase/        # Firebase config (pointing to /backend)
│   │   ├── api/             # API layer
│   │   └── utils.ts         # Utilities
│   ├── hooks/               # Custom hooks
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript types
│   ├── pages/               # Route pages
│   └── styles/
│       └── globals.css      # Global styles (match production)
├── public/                  # Static assets
├── index.html               # Vite entry
├── vite.config.ts          # Match /apps/web config
├── tailwind.config.ts      # Match /apps/web config
├── tsconfig.json           # Match /apps/web config
└── package.json            # Match /apps/web versions
```

---

## 🔧 DETAILED MIGRATION INSTRUCTIONS

### Step 1: Archive Cleanup
```bash
# CWD: /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm

# Create archive directory if missing
mkdir -p archive

# Archive rize directories with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mv rize-frontend-analysis archive/rize-frontend-analysis_${TIMESTAMP}
mv rize-turbo archive/rize-turbo_${TIMESTAMP}

# Log the archive action
cat >> archive/ARCHIVE_LOG.md <<EOF

## Archived: ${TIMESTAMP}
- \`rize-frontend-analysis_${TIMESTAMP}\` — Empty analysis directory (no references found)
- \`rize-turbo_${TIMESTAMP}\` — Old turbo monorepo experiment (superseded by current structure)
- **Reason**: Cluttering root; no active references in /apps/web or /apps/web-next

EOF
```

### Step 2: Convert Next.js to Vite

#### A) Package.json Migration
```json
{
  "name": "@jrpm/web-next",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:emulators": "VITE_USE_EMULATORS=true vite",
    "build": "vite build",
    "preview": "vite preview --host",
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "test": "vitest run",
    "format": "prettier -w ."
  },
  "dependencies": {
    "@diatonic/ui": "workspace:*",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.51.0",
    "@tanstack/react-table": "^8.20.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "firebase": "^11.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.453.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^9.11.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.65.0",
    "react-router-dom": "^6.27.0",
    "sonner": "^1.7.4",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.2",
    "zod": "^3.25.76",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.20",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.13.0",
    "postcss": "^8.4.47",
    "prettier": "^3.3.3",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^5.4.10",
    "vitest": "^2.1.5"
  }
}
```

#### B) Vite Config (apps/web-next/vite.config.ts)
```typescript
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
    port: 3001, // Different port from main web app
  },
})
```

#### C) TypeScript Config (apps/web-next/tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../../shared/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["src"],
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}
```

#### D) Tailwind Config (apps/web-next/tailwind.config.ts)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1200px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down var(--duration-base) var(--easing-smooth)',
        'accordion-up': 'accordion-up var(--duration-base) var(--easing-smooth)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}

export default config
```

#### E) Main Entry Point (apps/web-next/src/main.tsx)
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'

import { ThemeProvider } from '@diatonic/ui'

import App from './App'
import '@diatonic/ui/styles'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
```

#### F) App Component with React Router (apps/web-next/src/App.tsx)
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from './contexts/AuthContext'

// Import your pages here
import HomePage from './pages/HomePage'
// ... other pages

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add other routes */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
```

#### G) Index HTML (apps/web-next/index.html)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JR Drew - Content Brainstorm</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 3: Firebase Configuration

#### Update Firebase Config (apps/web-next/src/lib/firebase/config.ts)
```typescript
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// Point to backend configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)

// Connect to emulators if enabled
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectFunctionsEmulator(functions, 'localhost', 5001)
}
```

### Step 4: Component Migration Pattern

For each component in web-next, follow this pattern:

**REMOVE:**
- `import { useRouter } from 'next/router'` → Replace with `useNavigate` from react-router-dom
- `import Image from 'next/image'` → Replace with standard `<img>` or custom component
- `import Link from 'next/link'` → Replace with `<Link>` from react-router-dom
- Any `getServerSideProps`, `getStaticProps` → Move to client-side data fetching with TanStack Query

**KEEP & ADAPT:**
- All Radix UI components (already compatible)
- Form logic with react-hook-form + zod
- Custom hooks (useCountdown, useExitIntent, useNarrator, useTypewriter)
- Context providers (AuthContext)

**EXAMPLE MIGRATION:**
```typescript
// BEFORE (Next.js)
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

export default function Component() {
  const router = useRouter()
  const handleClick = () => router.push('/dashboard')
  
  return (
    <div>
      <Link href="/about">About</Link>
      <Image src="/logo.png" width={100} height={100} alt="Logo" />
    </div>
  )
}

// AFTER (Vite + React Router)
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function Component() {
  const navigate = useNavigate()
  const handleClick = () => navigate('/dashboard')
  
  return (
    <div>
      <Link to="/about">About</Link>
      <img src="/logo.png" width={100} height={100} alt="Logo" />
    </div>
  )
}
```

### Step 5: Global Styles Migration

Copy the exact CSS variables from `/apps/web/src/styles/globals.css` to ensure consistent theming.

### Step 6: Environment Variables

Create `.env.local` template:
```bash
# Firebase Configuration (pointing to /backend)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Emulator Support
VITE_USE_EMULATORS=false
```

---

## 🚀 CODEX CLI EXECUTION COMMAND

```bash
# From project root
cd /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm

# Execute the migration with codex
codex cli --cwd . --task "Execute the complete migration plan from MIGRATE_WEBNEXT_TO_PRODUCTION.md:
1. Archive rize-frontend-analysis and rize-turbo directories
2. Convert apps/web-next from Next.js to Vite following exact specs from apps/web
3. Migrate all components to React Router and Vite patterns
4. Update Firebase config to point to /backend
5. Match all styling and theming from production apps/web
6. Ensure clean build with pnpm install && pnpm build
7. Create MIGRATION_COMPLETE.md report with before/after comparison"
```

---

## ✅ SUCCESS CRITERIA

1. **No Next.js dependencies** in `apps/web-next/package.json`
2. **Vite starts successfully** on port 3001: `pnpm --filter @jrpm/web-next dev`
3. **Clean build** with no TypeScript errors: `pnpm --filter @jrpm/web-next build`
4. **Firebase integration** works with emulators and production
5. **Styling matches** `/apps/web` exactly (colors, typography, components)
6. **All routes work** with React Router
7. **Archived directories** moved to `/archive/` with documentation
8. **Code quality** passes lint: `pnpm --filter @jrpm/web-next lint`

---

## 📦 DELIVERABLES

Upon completion, you should have:

1. ✅ Clean `/apps/web-next` with Vite + React + TypeScript stack
2. ✅ Archived `/archive/rize-frontend-analysis_TIMESTAMP/`
3. ✅ Archived `/archive/rize-turbo_TIMESTAMP/`
4. ✅ Updated `/archive/ARCHIVE_LOG.md` with details
5. ✅ Production-ready build passing all checks
6. ✅ `MIGRATION_COMPLETE.md` report documenting changes

---

## 🔍 POST-MIGRATION VALIDATION

```bash
# Run from project root
cd /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm

# Install dependencies
pnpm install

# Test web-next dev server
pnpm --filter @jrpm/web-next dev
# Should start on http://localhost:3001

# Test with emulators
pnpm --filter @jrpm/web-next dev:emulators
# Should connect to Firebase emulators

# Test production build
pnpm --filter @jrpm/web-next build
# Should complete without errors

# Run linter
pnpm --filter @jrpm/web-next lint
# Should pass with no errors

# Verify directory structure
tree -L 3 apps/web-next
# Should match target structure above

# Verify archives
ls -la archive/
# Should show rize directories with timestamps
```

---

**End of Migration Specification**
