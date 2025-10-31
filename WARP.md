# WARP: JR-Drew Monorepo Orientation

**Version**: 1.0.0  
**Last Updated**: 2025-10-31  
**Repository**: `/home/daclab-ai/Documents/JR-Drew-Content-Brainstorm`  
**Status**: Phase 1 Complete — Dual-Framework Coexistence (Vite + Next.js)

---

## Quick Links

- [Universal Context](#universal-context)
- [Operating Constraints](#operating-constraints)
- [Onboarding Path](#onboarding-path)
- [Repository Discovery](#repository-discovery)
- [Code Review Framework](#code-review-framework)
- [Codex CLI Playbook](#codex-cli-playbook)
- [Testing Matrix](#testing-matrix)
- [Deployment & Release](#deployment--release)

---

## Universal Context

### Mission Statement

The **JR-Drew-Content-Brainstorm** (aka "Diatonic Monorepo") is a full-stack productivity tracking and project management SaaS application with desktop capabilities. This repository supports:

- **apps/web**: Production Vite + React application (port 5173)
- **apps/electron**: Cross-platform desktop application
- **packages/ui**: Shared React component library with shadcn/ui
- **infra/firebase/functions**: Backend serverless functions and Firebase integration
- **docs/**: MkDocs-based documentation site
- **src/pmx**: Python CLI tool for project management automation

**Core Purpose**: Enable teams to track productivity, manage projects, and optimize workflows through web and desktop interfaces with Firebase backend integration.

### Audience Personas

1. **AI Agents (Codex CLI)** — Primary audience for this document
   - Autonomous code generation and refactoring
   - Code review and quality assurance
   - Documentation maintenance
   - Task automation

2. **Frontend Engineers**
   - React/TypeScript development
   - UI/UX implementation
   - State management (Zustand, TanStack Query)
   - Component library maintenance

3. **Backend Engineers**
   - Firebase Functions development
   - API design and optimization
   - Database schema management
   - Security rules authoring

4. **Data Engineers**
   - Analytics implementation
   - Performance monitoring
   - Data flow optimization

5. **Documentation Authors**
   - MkDocs content creation
   - API documentation
   - Runbook maintenance

### Success Metrics

- **PR SLA**: < 24 hours for review, < 48 hours for merge
- **CI Pass Rate**: > 95% on main branch
- **Test Coverage**: > 80% (Python), > 70% (TypeScript)
- **Onboarding Time**: < 4 hours for new contributors
- **Documentation Freshness**: Updated within 1 week of feature merge
- **Build Success Rate**: > 98%
- **Hot Reload Time**: < 2 seconds (dev environment)

### Guiding Principles

1. **Deterministic Workflows**: Every operation should be reproducible
2. **Least Surprise**: Follow established patterns; document deviations
3. **Automation First**: Prefer tooling over manual processes
4. **Fail Fast**: Validation at every stage (lint → test → build → deploy)
5. **Explicit Over Implicit**: Clear naming, typed interfaces, documented APIs
6. **Security by Default**: Authentication, authorization, input validation everywhere
7. **Performance Awareness**: Monitor bundle sizes, query efficiency, render costs
8. **Documentation as Code**: Maintain alongside implementation

### Glossary

- **WARP**: Workflows, Alignment, Rituals, Playbooks — this orientation framework
- **pmx**: Python CLI tool for project management automation (`src/pmx/`)
- **Vitest**: Test runner for TypeScript/JavaScript (Vite ecosystem)
- **TanStack Query**: Data-fetching and caching library (formerly React Query)
- **Zustand**: Lightweight state management library
- **Firebase 11**: Current Firebase SDK version (Auth, Firestore, Functions, Hosting, Storage)
- **MkDocs Material**: Documentation framework with Material Design theme
- **shadcn/ui**: Component library built on Radix UI primitives
- **pnpm**: Fast, disk-efficient package manager (9.12.0)
- **Monorepo**: Single repository containing multiple apps and packages

### Repo Map Snapshot

```
/home/daclab-ai/Documents/JR-Drew-Content-Brainstorm/
├── apps/
│   ├── web/                    # Vite + React SPA (275MB) — PRIMARY WEB APP
│   └── electron/               # Electron desktop app (431MB)
├── packages/
│   └── ui/                     # @diatonic/ui shared components (200KB)
├── shared/                     # ⚠️ DEPRECATED — use packages/ui instead
├── infra/
│   └── firebase/               # Firebase configuration + Cloud Functions (62MB)
├── backend/
│   └── firebase/               # ⚠️ VERIFY: potential duplicate of infra/firebase/functions
├── docs/                       # MkDocs documentation (27MB)
│   ├── 00-Meta/, 01-Product/, 02-Architecture/
│   ├── 04-Runbooks/, 05-Decisions-ADRs/, 06-Guides/
│   └── automation/agents/      # AI agent configurations
├── scripts/                    # Automation scripts
├── src/pmx/                    # Python CLI tool
├── reports/                    # Analysis and merge reports
├── archive/                    # Historical code (web-next, rize-frontend-analysis)
├── .github/workflows/          # CI/CD pipelines (6 workflows)
└── [Root config files]         # package.json, pyproject.toml, mkdocs.yml, etc.
```

---

## Operating Constraints

### Toolchain Versions

**Required Versions:**

- **Node.js**: 18.x or 20.x (via nvm/fnm)
- **pnpm**: 9.12.0 (enforced via `packageManager` field)
- **Python**: 3.10+ (for pmx tool and scripts)
- **Firebase CLI**: Latest (`npm install -g firebase-tools`)
- **MkDocs**: 1.6.1 with mkdocs-material 9.6.22

**Optional but Recommended:**

- **nvm** or **fnm**: Node version management
- **pyenv**: Python version management
- **ripgrep** (`rg`): Fast code search
- **fd**: Fast file finder

### Style Guides

#### TypeScript/JavaScript

- **ESLint**: Two modes available
  - `pnpm lint:warn` — All rules as warnings (development)
  - `pnpm lint:strict` — Enforced rules (pre-commit, CI)
  
- **Config Locations**:
  - `eslint.warn.config.mjs` — Development mode
  - `eslint.strict.config.mjs` — Strict mode (use for CI)

- **Prettier**: Formatting on save
  - Line length: 100 characters
  - Single quotes, trailing commas
  - Semi-colons required

- **Tailwind CSS**: `tailwind.config.js` at workspace roots
  - Follow design tokens from `packages/ui`
  - Avoid arbitrary values unless justified

#### Python

- **Black**: Code formatter
  - Line length: 100 characters (per `pyproject.toml`)
  - Run: `black src/ --check` (CI) or `black src/` (format)

- **Ruff**: Fast linter
  - Config: `[tool.ruff]` in `pyproject.toml`
  - Run: `ruff check src/`

- **Mypy**: Type checker
  - Config: `[tool.mypy]` in `pyproject.toml`
  - `ignore_missing_imports = true` (current setting)
  - Run: `mypy src/`

- **Pyright**: Alternative type checker
  - Used by VS Code Pylance
  - Run: `pyright src/`

### Testing Requirements

#### TypeScript (Vitest)

- **Coverage Threshold**: 70% minimum
- **Location**: `apps/web/src/__tests__/`
- **Run Commands**:
  - `pnpm test` — Run all tests
  - `pnpm test:coverage` — Generate coverage report
  - `pnpm test:watch` — Watch mode for development

#### Python (pytest)

- **Coverage Threshold**: 80% minimum (per `pyproject.toml`)
- **Location**: Tests adjacent to source files or in `tests/`
- **Run Commands**:
  - `pytest src/`
  - `pytest --cov=src --cov-report=html`

#### Firebase Functions

- **Emulator Testing Required**: All functions must be tested via emulators before deployment
- **Command**: `pnpm dev:emulators` (starts all Firebase emulators)
- **Emulator UI**: http://127.0.0.1:4001

#### CI Gating

All PRs must pass:
1. ESLint strict mode (`pnpm lint:strict`)
2. TypeScript type checking (`pnpm typecheck`)
3. Unit tests with coverage (`pnpm test`)
4. Build validation (`pnpm build`)
5. Python linting (Black, Ruff, Mypy)

### Security Policies

#### Secret Management

- **Never commit**:
  - `.env` files (use `.env.local.example` as template)
  - Firebase service account keys
  - API keys, tokens, credentials
  - Private keys, certificates

- **Use Firebase Environment Config**:
  ```bash
  firebase functions:config:set someservice.key="THE_API_KEY"
  ```

- **Local Development**:
  - Copy `.env.local.example` to `.env.local`
  - Add `.env.local` to `.gitignore` (already configured)

#### Firebase Security Rules

- **Firestore Rules**: `infra/firebase/firestore.rules`
- **Storage Rules**: `infra/firebase/storage.rules`
- **Validation**: Test via emulators before deployment
- **Principle**: Deny by default, allow explicitly

#### Input Validation

- **TypeScript**: Use Zod schemas (`apps/web/src/schemas/`)
- **Python**: Use Pydantic models
- **Firebase Functions**: Validate all user inputs via schemas

### Network Restrictions

For AI agents operating in restricted network environments:

- **Prefer Local Documentation**: Use `docs/` over external links
- **Offline-First Commands**: Prioritize `ls`, `cat`, `grep` over network calls
- **Cached Dependencies**: Assume `node_modules/` and `.venv/` are pre-populated
- **Read-Only Discovery**: Use file system inspection rather than API calls

---

## Signals & Dashboards

### CI Pipelines

Located in `.github/workflows/`:

1. **ci.yml** — Main CI pipeline
   - Linting, type checking, testing
   - Triggered on: push, pull_request

2. **deploy.yml** — Production deployment
   - Manual trigger
   - Deploys web app to Firebase Hosting

3. **docs-deploy.yml** — Documentation deployment
   - Auto-deploys to GitHub Pages on main branch

4. **docs.yml** — Documentation validation
   - Checks MkDocs build on PRs

5. **functions-ci.yml** — Firebase Functions CI
   - Linting, testing, deployment validation

6. **web-deploy.yml** — Web app deployment
   - Firebase Hosting deployment
   - Environment-specific configs

### Observability

- **Firebase Console**: https://console.firebase.google.com/
  - Project: `jrpm-dev` (development/staging)
  - Monitor: Auth, Firestore, Functions, Storage

- **GitHub Actions**: https://github.com/[org]/[repo]/actions
  - CI/CD pipeline status
  - Deployment history

- **MkDocs Site**: Deployed via GitHub Pages
  - Check `.github/workflows/docs-deploy.yml` for URL

### Reporting Cadence

- **Daily**: Open PR triage, CI failure review
- **Weekly**: Dependency updates check, doc freshness review
- **Bi-weekly**: Backlog grooming, tech debt assessment
- **Monthly**: Security audit (`pnpm audit`, `safety check`)
- **Quarterly**: WARP.md review and update

---

## Rituals & Cadence

### Daily Rituals

1. **Morning**:
   - Pull latest from main: `git pull origin main`
   - Check open PRs and provide reviews
   - Triage new issues

2. **Before Committing**:
   - Run linters: `pnpm lint:strict`
   - Run tests: `pnpm test`
   - Verify types: `pnpm typecheck`

3. **End of Day**:
   - Push WIP branches
   - Update task status
   - Review WARP.md for updated guidance

### Weekly Rituals

1. **Monday**: Backlog grooming, sprint planning
2. **Wednesday**: Mid-week standup, dependency check
3. **Friday**: Doc updates, WARP.md sync, release prep

### Release Rituals

1. **Pre-Release**:
   - Run full test suite: `pnpm test`
   - Generate coverage reports
   - Update CHANGELOG.md
   - Tag release: `git tag v1.2.3`

2. **Release**:
   - Deploy via GitHub Actions
   - Verify deployment in Firebase console
   - Smoke test critical paths

3. **Post-Release**:
   - Monitor error logs
   - Update documentation
   - Announce in team channels

### Incident Response

**Contact List**:
- Maintainer: [Specify contact]
- On-Call: [Specify rotation]
- Security: [Specify contact]

**Runbook Location**: `docs/04-Runbooks/`

**Escalation Path**:
1. Check logs in Firebase console
2. Review recent deployments in GitHub Actions
3. Rollback if necessary: `firebase hosting:rollback`
4. Contact maintainer if critical

---

## Onboarding Path

### Day 0 Quickstart

```bash
# 1. Clone repository
git clone <repo-url>
cd JR-Drew-Content-Brainstorm

# 2. Install Node.js dependencies
pnpm install

# 3. Setup Python environment (optional, for pmx tool)
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e ".[dev]"

# 4. Copy environment template
cp apps/web/.env.local.example apps/web/.env.local

# 5. Start Vite dev server
pnpm dev:vite
# Open http://localhost:5173

# 6. (Optional) Start Firebase emulators in separate terminal
pnpm dev:emulators
# Open http://127.0.0.1:4001 for Emulator UI
```

### Environment Setup

#### Node.js via nvm

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node 20
nvm install 20
nvm use 20

# Verify
node --version  # Should be v20.x.x
```

#### Python Virtual Environment

```bash
# Create virtual environment
python3 -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -e ".[dev,sandbox]"

# Verify
pmx --version
```

#### Firebase CLI

```bash
# Install globally
npm install -g firebase-tools

# Login
firebase login

# Verify
firebase --version
firebase projects:list
```

### Tools Installation

**Required**:
- pnpm 9.12.0: `npm install -g pnpm@9.12.0`
- Firebase CLI: `npm install -g firebase-tools`

**Optional**:
- MkDocs Material: `pip install mkdocs-material==9.6.22`
- ripgrep: `brew install ripgrep` (macOS) or `apt install ripgrep` (Ubuntu)
- fd: `brew install fd` (macOS) or `apt install fd-find` (Ubuntu)

### First Build

#### Vite App (apps/web)

```bash
# Development server
pnpm dev:vite

# Production build
pnpm --filter @diatonic/web build

# Build output: apps/web/dist/
```

#### Electron App

```bash
# Development mode (with Vite)
ELECTRON_APP=vite pnpm dev:electron

# Package for distribution
pnpm --filter @diatonic/electron build
```

#### Documentation Site

```bash
# Serve locally
pnpm docs:serve
# Open http://localhost:8000

# Build static site
mkdocs build
# Output: site/
```

### First Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Python tests
pytest src/ --cov

# Lint everything
pnpm lint:strict
black src/ --check
ruff check src/
```

### Knowledge Base

**Primary Documentation**: `/docs/`

Key pages:
- `docs/LOCAL_DEVELOPMENT.md` — Local dev setup
- `docs/MIGRATION_STRATEGY.md` — Migration plan and status
- `docs/02-Architecture/` — System architecture
- `docs/06-Guides/` — How-to guides
- `docs/04-Runbooks/` — Operational procedures

**Configuration Reference**:
- `package.json` — Monorepo scripts and dependencies
- `pnpm-workspace.yaml` — Workspace configuration
- `pyproject.toml` — Python project configuration
- `mkdocs.yml` — Documentation site configuration
- `firebase.json` — Firebase hosting and functions config

---

## Repository Discovery

### Directory Deep Dive

#### `/apps/web` — Vite + React Application

**Stack**: React 18.3.1, TypeScript 5.6.3, Vite 5.4.10, TailwindCSS 3.4.14

**Entry Point**: `apps/web/src/main.tsx`

**Key Directories**:
```
apps/web/src/
├── app/                    # App-level config (layouts, providers)
├── components/             # React components
│   ├── auth/              # Login/Signup modals
│   ├── dashboard/         # Dashboard widgets
│   ├── navigation/        # Nav, sidebar, breadcrumbs
│   └── ui/                # shadcn UI primitives
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, helpers
├── pages/                 # Route pages (React Router)
├── schemas/               # Zod validation schemas
├── services/              # API/Firebase services
├── stores/                # Zustand state stores
├── styles/                # Global CSS, Tailwind config
└── types/                 # TypeScript type definitions
```

**Routing**: React Router 6.27.0 (`src/App.tsx`)

**State Management**:
- **Global State**: Zustand stores (`src/stores/`)
- **Server State**: TanStack Query (`src/services/`)
- **Form State**: React Hook Form + Zod resolvers

**Build Output**: `apps/web/dist/`

**Port**: 5173 (dev), configurable for production

#### `/apps/electron` — Desktop Application

**Stack**: Electron + Vite + React

**Key Files**:
- `electron.vite.config.ts` — Electron-Vite configuration
- `src/main/index.ts` — Electron main process
- `src/renderer/` — Renderer process (React app)

**Packaging**: electron-builder

**Shared Modules**: Uses `packages/ui` for components

#### `/packages/ui` — Shared Component Library

**Purpose**: Shared React components and design tokens for all apps

**Structure**:
```
packages/ui/src/
├── components/            # Shared components (shadcn/ui based)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── [more shadcn components]
├── lib/                   # Utilities (cn, etc.)
└── styles/                # Shared CSS, Tailwind config
```

**Usage in Apps**:
```typescript
import { Button } from '@diatonic/ui';
```

**Build**: TypeScript compilation to `dist/`

#### `/infra/firebase/functions` — Cloud Functions

**Runtime**: Node.js 18+, TypeScript

**Structure**:
```
infra/firebase/functions/
├── src/                   # Function source code
│   ├── index.ts          # Export all functions
│   ├── auth.ts           # Auth triggers
│   ├── firestore.ts      # Firestore triggers
│   └── https.ts          # HTTP callable functions
├── package.json          # Function dependencies
└── tsconfig.json         # TypeScript config
```

**Deployment**:
```bash
firebase deploy --only functions
```

**Emulator Testing**:
```bash
pnpm dev:emulators
# Functions available at http://127.0.0.1:5001
```

**Environment Config**:
```bash
firebase functions:config:set key="value"
```

#### `/docs` — MkDocs Documentation

**Framework**: MkDocs 1.6.1 with Material theme 9.6.22

**Structure**:
```
docs/
├── 00-Meta/               # Documentation about documentation
├── 01-Product/            # Product specs
├── 02-Architecture/       # System architecture
├── 04-Runbooks/          # Operational guides
├── 05-Decisions-ADRs/    # Architecture Decision Records
├── 06-Guides/            # How-to guides
├── automation/agents/     # AI agent configurations
└── [various subdirs]
```

**Configuration**: `mkdocs.yml` (root)

**Build**:
```bash
mkdocs serve           # Dev server at :8000
mkdocs build          # Static site to site/
mkdocs gh-deploy      # Deploy to GitHub Pages
```

**Authoring Workflow**:
1. Create/edit `.md` files in `docs/`
2. Update `nav` in `mkdocs.yml` if adding new pages
3. Preview locally: `mkdocs serve`
4. Commit and push — GitHub Actions auto-deploys

#### `/src/pmx` — Python CLI Tool

**Purpose**: Project management automation CLI

**Framework**: Typer + Rich

**Installation**:
```bash
pip install -e .
```

**Usage**:
```bash
pmx --help
pmx [command] [options]
```

**Development**:
```bash
# Format
black src/

# Lint
ruff check src/

# Type check
mypy src/
```

### Cross-Package Dependencies

**Workspace Protocol**: `pnpm` workspaces with `workspace:*` protocol

**Dependency Graph**:
```
apps/web          → packages/ui
apps/electron     → packages/ui
packages/ui       → (standalone, no internal deps)
```

**Shared Utilities**:
- `packages/ui/src/lib/` — Utility functions (cn, etc.)
- `apps/web/src/lib/` — App-specific utilities

**API Contracts**:
- Firebase Functions expose HTTPS callable functions
- Frontend uses Firebase SDK to call functions
- Shared types could be extracted to `packages/types` (future)

### Key Config Files

- **`package.json`** (root) — Monorepo scripts, devDependencies
- **`pnpm-workspace.yaml`** — Workspace definitions
- **`apps/web/package.json`** — Web app dependencies
- **`apps/electron/package.json`** — Electron app dependencies
- **`packages/ui/package.json`** — UI library dependencies
- **`apps/web/tsconfig.json`** — TypeScript config for web app
- **`eslint.warn.config.mjs`** — ESLint warning mode
- **`eslint.strict.config.mjs`** — ESLint strict mode (CI)
- **`tailwind.config.js`** — Tailwind configuration (per app)
- **`firebase.json`** — Firebase hosting and functions config
- **`mkdocs.yml`** — MkDocs site configuration
- **`pyproject.toml`** — Python project configuration (pmx tool)

### Data Flow Overview

```
User Browser
    ↓
React App (apps/web)
    ↓
Firebase SDK (Auth, Firestore, Functions)
    ↓
Firebase Backend (infra/firebase/functions)
    ↓
Firestore Database
```

**Authentication Flow**:
1. User logs in via Firebase Auth (email/password or OAuth)
2. Auth token stored in browser
3. Protected routes use auth guards
4. API calls include auth token

**Data Flow**:
1. React components fetch data via TanStack Query
2. Services layer (`src/services/`) wraps Firebase SDK
3. Firestore queries respect security rules
4. Cloud Functions provide server-side logic for complex operations

### Security Touchpoints

1. **Authentication**:
   - `apps/web/src/components/auth/` — Login/Signup modals
   - Firebase Auth configuration in Firebase console

2. **Firestore Rules**:
   - `infra/firebase/firestore.rules` — Security rules
   - Test via emulators before deployment

3. **API Keys**:
   - `apps/web/.env.local` — Local environment variables
   - Firebase config exposed in client (public API keys)
   - Sensitive keys in Firebase Functions environment config

4. **Input Validation**:
   - `apps/web/src/schemas/` — Zod schemas for forms
   - Cloud Functions should validate all inputs

---

## Code Review Framework

### Review Objectives

1. **Correctness**: Code meets functional requirements and produces expected output
2. **Maintainability**: Code is readable, well-structured, and documented
3. **Security**: No vulnerabilities, proper input validation, secrets management
4. **Performance**: Efficient algorithms, optimized queries, minimal re-renders
5. **Testing**: Adequate coverage, edge cases handled, integration tested
6. **Standards Compliance**: Adheres to style guides, linting rules, type safety

### Submission Requirements

Before submitting a PR:

- [ ] Run `pnpm lint:strict` — No errors
- [ ] Run `pnpm typecheck` — No type errors
- [ ] Run `pnpm test` — All tests pass, coverage maintained
- [ ] Run `pnpm build` — Build succeeds
- [ ] Python: `black src/` + `ruff check src/` + `mypy src/`
- [ ] Update relevant documentation in `docs/`
- [ ] Add/update tests for new functionality
- [ ] Update CHANGELOG.md (if applicable)
- [ ] Self-review code for obvious issues

### Review Artifacts

**PR Template** (create `.github/PULL_REQUEST_TEMPLATE.md`):

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Linting passed (`pnpm lint:strict`)
- [ ] Tests pass (`pnpm test`)
- [ ] Types valid (`pnpm typecheck`)
- [ ] Documentation updated
- [ ] WARP.md reviewed for guidance

## Review Focus
- {{programming language or framework}}
- {{specific areas of concern}}
```

### Communication Norms

- **Asynchronous Reviews**: Expect 24-hour response time
- **Comment Etiquette**:
  - Be constructive, not critical
  - Explain "why" not just "what"
  - Suggest alternatives with examples
- **Blocking vs Non-Blocking**:
  - **Blocking**: Security issues, broken tests, type errors
  - **Non-Blocking**: Style suggestions, minor refactors
- **Approval Requirements**: At least 1 approval required
- **Self-Merge**: Allowed after approval, if CI passes

### Merge Criteria

- [ ] At least 1 approval from maintainer
- [ ] All CI checks pass (linting, tests, build)
- [ ] No unresolved conversations
- [ ] Documentation updated
- [ ] Change size reasonable (< 500 lines preferred)

---

## Code Review Checklist

### TypeScript/React

- [ ] **Component Props**: Typed with explicit interfaces, not `any`
  ```typescript
  // Good
  interface ButtonProps {
    label: string;
    onClick: () => void;
  }
  
  // Bad
  function Button(props: any) { ... }
  ```

- [ ] **Zustand Stores**: Typed and selectors memoized
  ```typescript
  const useStore = create<StoreState>((set) => ({ ... }));
  const count = useStore((state) => state.count); // Selector
  ```

- [ ] **TanStack Query**: Proper keys and caching strategy
  ```typescript
  const { data } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => fetchProject(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  ```

- [ ] **Tailwind Classes**: Align with design tokens, avoid duplication
  - Check for repeated class combinations → extract to component
  - Use `cn()` utility from `packages/ui/src/lib/utils.ts`

- [ ] **API Calls**: Wrapped in typed services, errors handled gracefully
  ```typescript
  try {
    const result = await projectService.create(data);
  } catch (error) {
    console.error('Failed to create project:', error);
    toast.error('Failed to create project');
  }
  ```

- [ ] **Effects Cleanup**: Avoid memory leaks
  ```typescript
  useEffect(() => {
    const subscription = observable.subscribe();
    return () => subscription.unsubscribe(); // Cleanup
  }, []);
  ```

- [ ] **Accessibility**: aria labels, keyboard handlers, semantic HTML
  ```typescript
  <button aria-label="Close modal" onClick={onClose}>
    <X />
  </button>
  ```

- [ ] **React Suspense**: Boundaries or fallback states for async components
  ```typescript
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
  ```

- [ ] **State Derivations**: Prefer selectors over re-render loops
  ```typescript
  const completedCount = useMemo(
    () => tasks.filter(t => t.completed).length,
    [tasks]
  );
  ```

- [ ] **ESLint/Prettier**: Run `pnpm lint:strict`, no overrides without justification
  - Disable rules only with inline comments explaining why

- [ ] **Tests**: Vitest coverage, Testing Library assertions, snapshots approved
  ```typescript
  it('renders button with label', () => {
    render(<Button label="Click me" onClick={vi.fn()} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  ```

### Python

- [ ] **Black Formatting**: Modules adhere to Black formatting (100 char)
  ```bash
  black src/ --check
  ```

- [ ] **Ruff Warnings**: Resolved, no ignored codes without rationale
  ```bash
  ruff check src/
  ```

- [ ] **Type Hints**: Satisfy Mypy, no `Any` leaks
  ```python
  def process_data(data: list[dict[str, Any]]) -> ProcessedData:
      ...
  ```

- [ ] **Pydantic Models**: Validation coverage for all data structures
  ```python
  class ProjectCreate(BaseModel):
      name: str = Field(..., min_length=1, max_length=100)
      description: str | None = None
  ```

- [ ] **CLI Scripts**: Handle errors, exit codes, structured logging
  ```python
  try:
      result = process()
  except Exception as e:
      logger.error("Processing failed", exc_info=e)
      sys.exit(1)
  ```

- [ ] **Dependencies**: Pinned in `pyproject.toml`, security checked
  ```bash
  safety check
  ```

- [ ] **Unit Tests**: Cover edge cases, use fixtures
  ```python
  @pytest.fixture
  def sample_project():
      return Project(name="Test", description="Test project")
  
  def test_project_creation(sample_project):
      assert sample_project.name == "Test"
  ```

- [ ] **Docstrings**: Present for public functions
  ```python
  def calculate_metrics(project: Project) -> Metrics:
      """Calculate project metrics.
      
      Args:
          project: Project instance to analyze
          
      Returns:
          Metrics object with calculated values
      """
      ...
  ```

- [ ] **Resource Cleanup**: Context managers used
  ```python
  with open('file.txt') as f:
      data = f.read()
  ```

### Firebase Functions

- [ ] **Firebase 11 APIs**: Use latest Firebase 11 SDK
  ```typescript
  import { onCall, HttpsError } from 'firebase-functions/v2/https';
  ```

- [ ] **Firestore Rules**: Updated if data model changes
  - Test via emulators: `pnpm dev:emulators`

- [ ] **Environment Variables**: Referenced via `process.env`, safeguarded
  ```typescript
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API_KEY not configured');
  }
  ```

- [ ] **Async Operations**: Awaited, handle timeouts
  ```typescript
  const result = await Promise.race([
    fetchData(),
    timeout(5000)
  ]);
  ```

- [ ] **Cold Start Mitigations**: Avoid heavy initializations in function body
  ```typescript
  // Initialize outside function handler
  const db = getFirestore();
  
  export const myFunction = onCall(async (request) => {
    // Use db here
  });
  ```

- [ ] **Structured Logging**: No secrets in logs
  ```typescript
  logger.info('Processing request', { userId: request.auth?.uid });
  ```

- [ ] **Emulator Tests**: Executed, coverage of triggers
  ```typescript
  // Test via Firebase emulators
  const wrapped = testEnv.wrap(myFunction);
  const result = await wrapped({ data: testData });
  ```

- [ ] **Deployment Config**: `firebase.json` consistent
  ```json
  {
    "functions": {
      "source": "infra/firebase/functions",
      "runtime": "nodejs18"
    }
  }
  ```

### Security

- [ ] **Secrets**: Not committed to git
  - Check `.gitignore` includes `.env`, `.env.local`
  - Use Firebase Functions config or environment variables

- [ ] **Authentication Flows**: Guard components present
  ```typescript
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
  ```

- [ ] **Dependency Updates**: Check for CVEs
  ```bash
  pnpm audit
  pip install safety && safety check
  ```

- [ ] **Input Validation**: Zod for TS, Pydantic for Python
  ```typescript
  const createProjectSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
  });
  ```

- [ ] **CSP/Security Headers**: Configured if relevant
  - Check Firebase Hosting config in `firebase.json`

- [ ] **Permission Scopes**: Firebase, API tokens reviewed
  - Firestore rules enforce least privilege

- [ ] **Encryption**: Sensitive data encrypted or securely stored
  - Use Firebase Auth for user credentials
  - Encrypt data at rest (Firestore handles this)

### Performance

- [ ] **N+1 Queries**: Evaluate code paths for inefficiencies
  ```typescript
  // Bad: N+1 query
  projects.forEach(async (p) => {
    const tasks = await fetchTasks(p.id);
  });
  
  // Good: Batch query
  const tasks = await fetchTasksBatch(projects.map(p => p.id));
  ```

- [ ] **React Re-renders**: Use `memo`, `useMemo`, `useCallback` where needed
  ```typescript
  const MemoizedComponent = memo(ExpensiveComponent);
  
  const handleClick = useCallback(() => {
    doSomething();
  }, [dependency]);
  ```

- [ ] **Caching**: TanStack Query, service response caching
  ```typescript
  const { data } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  ```

- [ ] **Firebase Function Limits**: Memory/time limits configured
  ```typescript
  export const myFunction = onCall({
    memory: '512MB',
    timeoutSeconds: 60,
  }, async (request) => { ... });
  ```

- [ ] **Python Efficiency**: Vectorization, avoid loops
  ```python
  # Use pandas/numpy for data processing
  df['result'] = df['value'].apply(complex_calculation)
  ```

- [ ] **Lazy Loading**: Modules loaded on demand
  ```typescript
  const LazyComponent = lazy(() => import('./HeavyComponent'));
  ```

### Testing

- [ ] **Unit Tests Updated**: Coverage thresholds maintained
  - TypeScript: 70%+ coverage
  - Python: 80%+ coverage

- [ ] **Integration Tests**: Cross-service flows tested
  ```typescript
  it('creates project and fetches it', async () => {
    const project = await createProject(data);
    const fetched = await fetchProject(project.id);
    expect(fetched).toEqual(project);
  });
  ```

- [ ] **Snapshot Tests**: Not masking behavior changes
  - Review snapshot diffs carefully
  - Update only when UI intentionally changed

- [ ] **Mocks**: Represent realistic data, fixtures updated
  ```typescript
  const mockProject = {
    id: '123',
    name: 'Test Project',
    createdAt: new Date('2025-01-01'),
  };
  ```

- [ ] **CI Pipeline**: Includes new tests, config adjusted
  - Check `.github/workflows/` files

- [ ] **Manual QA**: Documentation updated for manual testing steps
  - Add to `docs/04-Runbooks/` if complex

### Documentation

- [ ] **README/WARP Cross-Links**: Updated
  - Link to relevant sections in WARP.md
  - Update README.md if features added

- [ ] **MkDocs Navigation**: New features included
  - Update `mkdocs.yml` nav section
  - Create new docs pages as needed

- [ ] **Code Comments**: Added only where necessary
  - Explain "why" not "what"
  - Remove obvious comments

- [ ] **Changelogs**: Updated
  - Add entry to CHANGELOG.md (if exists)
  - Include in PR description

- [ ] **Feature Flags**: Documented
  - Explain when flag should be enabled
  - Document rollout plan

- [ ] **Diagrams**: Updated if architecture changed
  - Use Mermaid for inline diagrams
  - Store complex diagrams in `docs/assets/`

---

## Codex CLI Playbook

### Agent Context Bootstrapping

**When starting a Codex CLI session**, the agent should:

1. **Discover WARP.md**:
   ```bash
   # Check current directory first
   if [ -f "./WARP.md" ]; then
     echo "Found WARP.md in current directory"
   elif [ -f "../WARP.md" ]; then
     echo "Found WARP.md in parent directory"
   else
     echo "No WARP.md found — using universal rules"
   fi
   ```

2. **Parse Relevant Sections**:
   - Extract headings and anchors
   - Focus on: "Rules", "Next Steps", "Diagnostics", "Do Not Touch"
   - Apply context to current operation

3. **Echo Context**:
   ```bash
   echo "Using WARP context from: ./WARP.md#Code-Review-Framework"
   ```

### Safe Command Patterns

**Read-Only Commands** (always safe):

```bash
# Directory listing
ls -la
ls -R | head -50

# File inspection
cat WARP.md
head -50 package.json
tail -50 apps/web/src/App.tsx

# Search patterns
rg "import.*React" apps/web/src/
rg "function.*Component" --type ts

# File finding
find . -name "*.ts" -type f | head -20
fd "\.tsx$" apps/web/src/

# Git history
git log --oneline --decorate --graph --max-count=20
git diff HEAD~1..HEAD

# Configuration inspection
cat tsconfig.json
cat firebase.json
```

**Safe Analysis Commands**:

```bash
# Dependency tree
pnpm list --depth=1

# Type checking (read-only)
pnpm typecheck

# Linting (check mode)
pnpm lint:strict

# Python checks
black src/ --check
ruff check src/
mypy src/
```

### Task Execution Flow

1. **Plan First**: Generate plan before making changes
2. **Show Diffs**: Present diffs for user approval
3. **Apply Patches**: Use `git apply` or similar for changes
4. **Verify**: Run linters and tests after changes
5. **Document**: Update WARP.md or docs if needed

### Terminal Prompt Template

```bash
$ codex task --interactive

Task: Provide a comprehensive list of the most critical elements to evaluate when conducting a code review.

Definitions:
- Code review: The systematic examination of source code with the goal of identifying defects, improving code quality, and ensuring adherence to coding standards and best practices.

Directions:
- Review the code for correctness, ensuring it meets the functional requirements and produces the expected output.
- Check for adherence to the project's coding standards, style guide, and best practices.
- Evaluate the code's readability, maintainability, and documentation.
- Identify potential performance bottlenecks, security vulnerabilities, and scalability issues.
- Look for opportunities to simplify the code, remove duplication, and improve modularity.
- Ensure proper error handling and logging mechanisms are in place.
- Verify that the code is well-tested, including edge cases and potential failure scenarios.
- Consider the impact of the changes on the existing codebase and architecture.
- Provide constructive feedback and suggestions for improvement.

User Inputs:
- {{programming language or framework being used}}
- {{specific areas of concern or focus for the review, if applicable}}
```

**Usage**: Replace placeholders before execution:
- `{{programming language or framework being used}}` → e.g., "TypeScript/React 18.3.1"
- `{{specific areas of concern or focus for the review}}` → e.g., "hooks patterns, performance, security"

### Profiles & Flags

**Recommended Codex CLI Flags**:

```bash
# Read-only exploration
codex exec -C /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm \
  -s read-only \
  "Analyze repository structure and list key files"

# Full automation (workspace write)
codex exec -C /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm \
  --full-auto \
  "Refactor components to use shared UI library"

# With explicit context
codex exec -C /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm \
  -c "context_file=WARP.md" \
  "Review code changes for security issues"
```

**Environment Variables**:

```bash
export CODEX_REPO_ROOT="/home/daclab-ai/Documents/JR-Drew-Content-Brainstorm"
export WARP_MD_PATH="$CODEX_REPO_ROOT/WARP.md"
```

### Example Commands

**Discovery**:

```bash
# List workspace apps and packages
codex exec -s read-only -C /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm \
  "List all TypeScript files in apps/web/src/components/"
```

**Analysis**:

```bash
# Analyze component for best practices
codex exec -C /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm \
  "Review apps/web/src/components/dashboard/StatCard.tsx for:
   - TypeScript type safety
   - React hooks patterns
   - Performance optimizations
   Provide specific suggestions with line numbers"
```

**Code Review**:

```bash
# Review changes in PR
codex exec -C /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm \
  "Review the following changes:
   Language: TypeScript/React
   Focus: Security, performance, type safety
   Files: apps/web/src/services/projectService.ts
   
   Apply WARP.md code review checklist and provide detailed feedback"
```

### Operational Guidance

- **Placeholder Replacement**: Always replace `{{placeholders}}` before execution
- **Network Restrictions**: In restricted environments, rely on local `docs/` rather than external links
- **Collaboration**: Share CLI prompt snippets in WARP for consistent onboarding
- **Maintenance**: Update CLI examples when new stacks are added
- **Troubleshooting**: See [Troubleshooting](#troubleshooting) section for sandbox errors

### Logging

**Recommended Logging Setup**:

```bash
# Create logs directory
mkdir -p logs/codex

# Run with logging
codex exec -C /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm \
  "Task description" \
  > logs/codex/session-$(date +%Y%m%d-%H%M%S).log 2>&1
```

---

## Command Recipes (Read-Only)

### Directory Listing

```bash
# List files recursively (limited)
ls -R | head -100

# Tree view (if installed)
tree -L 2 -d

# Find specific file types
find . -name "*.ts" -type f | head -50
fd "\.tsx$" apps/web/src/components/
```

### Search Patterns

```bash
# Search for imports
rg "import.*from" apps/web/src/ --type ts

# Find TODO comments
rg "TODO|FIXME" apps/ --color=always

# Search for function definitions
rg "function\s+\w+" --type ts
```

### Config Inspection

```bash
# View package.json
cat /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm/package.json

# View TypeScript config
cat /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm/apps/web/tsconfig.json

# View ESLint config
cat /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm/eslint.strict.config.mjs

# View Firebase config
cat /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm/firebase.json
```

### Git History

```bash
# Recent commits
git log --oneline --decorate --graph --max-count=20

# Changes in last commit
git diff HEAD~1..HEAD

# List changed files
git diff --name-only HEAD~5..HEAD

# Show file history
git log --follow --oneline -- apps/web/src/App.tsx
```

### Python Checks

```bash
# Black formatting check
black src/ --check

# Ruff linting
ruff check src/

# Mypy type checking
mypy src/

# Run all checks
black src/ --check && ruff check src/ && mypy src/
```

### Firebase Emulators

**⚠️ Caution**: Emulators start local services (not purely read-only)

```bash
# Start all emulators
pnpm dev:emulators

# Start specific emulators
firebase emulators:start --only functions,firestore

# Access Emulator UI
# http://127.0.0.1:4001
```

---

## Testing Matrix

### TypeScript Tests

**Framework**: Vitest 2.1.5 + Testing Library

**Commands**:

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch

# Run specific test file
pnpm test apps/web/src/components/Button.test.tsx
```

**Coverage Thresholds**:
- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

**Linting**:

```bash
# Warning mode (development)
pnpm lint:warn

# Strict mode (CI)
pnpm lint:strict
```

### React Component Tests

**Testing Library**: @testing-library/react

**Example Test**:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={vi.fn()} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### Electron Tests

**Smoke Tests**: Verify app starts and core functionality works

**Packaging Checks**: Ensure builds succeed for all platforms

```bash
# Build for current platform
pnpm --filter @diatonic/electron build

# Test packaging
pnpm --filter @diatonic/electron build --dir
```

### Python Tests

**Framework**: pytest + coverage

**Commands**:

```bash
# Run all tests
pytest src/

# With coverage
pytest src/ --cov=src --cov-report=html --cov-report=term

# Coverage threshold: 80% (enforced in pyproject.toml)
```

**Type Checking**:

```bash
# Mypy
mypy src/

# Pyright
pyright src/
```

### Firebase Function Tests

**Emulator-Based Testing**:

```bash
# Start emulators
pnpm dev:emulators

# In separate terminal, run tests
cd infra/firebase/functions
npm test
```

**Integration Tests**: Test functions via HTTP calls to emulated endpoints

### Documentation Tests

**Build Validation**:

```bash
# Serve locally and check for errors
mkdocs serve
# Check http://localhost:8000

# Build static site
mkdocs build
# Check for build errors

# Deploy to GitHub Pages (validates build)
mkdocs gh-deploy --force
```

**Link Checking**: Use MkDocs plugins or external tools to verify links

---

## Deployment & Release

### Web Deployment

**Target**: Firebase Hosting

**Pipeline**:

1. Triggered via `.github/workflows/web-deploy.yml`
2. Builds Vite app (`pnpm build`)
3. Deploys to Firebase Hosting
4. Invalidates CDN cache

**Manual Deployment**:

```bash
# Build app
pnpm --filter @diatonic/web build

# Deploy to Firebase
firebase deploy --only hosting --project jrpm-dev

# Deploy to production
firebase deploy --only hosting --project jrpm-prod
```

**Rollback**:

```bash
firebase hosting:rollback --project jrpm-dev
```

### Electron Release

**Build Tool**: electron-builder

**Packaging**:

```bash
# Build for current platform
pnpm --filter @diatonic/electron build

# Build for all platforms (CI)
pnpm --filter @diatonic/electron build:all
```

**Auto-Update Channels**:
- Configure in `electron-builder.yml`
- Use electron-updater for seamless updates

**Distribution**: Artifacts uploaded to GitHub Releases or CDN

### Firebase Functions Deployment

**Deployment**:

```bash
# Deploy all functions
firebase deploy --only functions --project jrpm-dev

# Deploy specific function
firebase deploy --only functions:myFunction --project jrpm-dev

# Production deployment
firebase deploy --only functions --project jrpm-prod
```

**Environment Config**:

```bash
# Set config
firebase functions:config:set someservice.key="VALUE" --project jrpm-dev

# Get config
firebase functions:config:get --project jrpm-dev
```

**Emulator Testing First**:

```bash
# Always test via emulators before deploying
pnpm dev:emulators
# Test functions at http://127.0.0.1:5001
```

### Documentation Deployment

**Target**: GitHub Pages

**Pipeline**:

1. Triggered via `.github/workflows/docs-deploy.yml`
2. Builds MkDocs site (`mkdocs build`)
3. Deploys to `gh-pages` branch
4. Available at GitHub Pages URL

**Manual Deployment**:

```bash
mkdocs gh-deploy --force
```

### Release Checklist

**Pre-Release**:

- [ ] All tests pass (`pnpm test`)
- [ ] Linting clean (`pnpm lint:strict`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Firebase emulator tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in `package.json`
- [ ] Git tag created: `git tag v1.2.3`

**Release**:

- [ ] Merge to main branch
- [ ] Push tag: `git push origin v1.2.3`
- [ ] GitHub Actions deploys automatically
- [ ] Verify deployment in Firebase console
- [ ] Smoke test critical paths

**Post-Release**:

- [ ] Monitor Firebase logs for errors
- [ ] Check analytics for anomalies
- [ ] Update team channels with release notes
- [ ] Close related GitHub issues

---

## Governance

### Ownership Matrix

| Directory | Owner | Backup |
|-----------|-------|--------|
| `apps/web/` | Frontend Lead | [TBD] |
| `apps/electron/` | Desktop Lead | [TBD] |
| `packages/ui/` | Design System Lead | [TBD] |
| `infra/firebase/` | Backend Lead | [TBD] |
| `docs/` | Documentation Lead | [TBD] |
| `src/pmx/` | DevOps Lead | [TBD] |
| `.github/workflows/` | DevOps Lead | [TBD] |
| `WARP.md` | Tech Lead | All Maintainers |

### Update Ritual

**Quarterly WARP Review**:

- **Schedule**: First Monday of each quarter
- **Attendees**: All maintainers
- **Agenda**:
  1. Review WARP.md for outdated information
  2. Update technology stack versions
  3. Revise code review checklists
  4. Update onboarding path
  5. Collect feedback from new contributors

**PR Template Updates**:

- Sync with WARP.md checklists quarterly
- Update `.github/PULL_REQUEST_TEMPLATE.md`

### Feedback Loop

**Channels**:

- GitHub Issues: Label `warp-update`
- Team Slack: #warp-feedback channel
- Quarterly review meetings

**Process**:

1. Anyone can propose WARP updates via GitHub issue
2. Label issue with `warp-update`
3. Maintainers review and approve
4. Update WARP.md in PR
5. Announce changes in team channels

### Change Log

**WARP.md Versioning**:

- **Major**: Complete restructure (1.x.x → 2.0.0)
- **Minor**: New sections added (1.0.x → 1.1.0)
- **Patch**: Content updates, fixes (1.0.0 → 1.0.1)

**Edit History**:

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-31 | Codex Agent | Initial WARP.md creation |

---

## Appendices

### FAQ

**Q: Where do I start if I'm new?**  
A: Follow the [Onboarding Path](#onboarding-path) section. Start with Day 0 Quickstart.

**Q: How do I run the app locally?**  
A: `pnpm dev:vite` for web app (port 5173), or `pnpm dev:emulators` + `pnpm dev:vite` for full-stack development.

**Q: What's the difference between `shared/` and `packages/ui/`?**  
A: `shared/` is deprecated. Use `packages/ui/` for all shared components.

**Q: How do I test Firebase Functions?**  
A: Use Firebase emulators: `pnpm dev:emulators`. Access Emulator UI at http://127.0.0.1:4001.

**Q: How do I add a new page to MkDocs?**  
A: Create `.md` file in `docs/`, update `nav` in `mkdocs.yml`, preview with `mkdocs serve`.

**Q: Where do I put new shared components?**  
A: `packages/ui/src/components/`. Export from `packages/ui/src/index.ts`.

**Q: How do I update WARP.md?**  
A: Create PR with changes, label with `warp-update`, get maintainer approval.

**Q: What's the deployment process?**  
A: Merge to main → GitHub Actions auto-deploys. See [Deployment & Release](#deployment--release).

### References

**External Style Guides**:

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)

**API Documentation**:

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://zod.dev/)

**Tools Documentation**:

- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [MkDocs Material](https://squidfunk.github.io/mkdocs-material/)
- [pnpm](https://pnpm.io/)
- [Typer](https://typer.tiangolo.com/)

### Templates

#### PR Checklist Template

```markdown
## PR Checklist

- [ ] Code follows style guides
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] WARP.md consulted for guidance
- [ ] Linting passed (`pnpm lint:strict`)
- [ ] Tests pass (`pnpm test`)
- [ ] Types valid (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)

## Review Focus

**Language/Framework**: {{TypeScript/React}}
**Specific Areas**: {{hooks patterns, performance, security}}
```

#### Code Review Summary Template

```markdown
## Code Review Summary

**Files Reviewed**: [list]

**TS/React**:
- [ ] Component props typed
- [ ] Hooks patterns correct
- [ ] State management appropriate

**Python**:
- [ ] Black formatted
- [ ] Type hints present
- [ ] Tests cover edge cases

**Firebase**:
- [ ] Security rules updated
- [ ] Emulator tested
- [ ] Logging structured

**Security**:
- [ ] No secrets committed
- [ ] Input validation present
- [ ] Auth flows correct

**Performance**:
- [ ] No N+1 queries
- [ ] Caching appropriate
- [ ] Lazy loading where possible

**Testing**:
- [ ] Coverage thresholds met
- [ ] Integration tests pass
- [ ] Snapshots reviewed

**Documentation**:
- [ ] WARP.md cross-links updated
- [ ] MkDocs nav updated
- [ ] Comments appropriate

**Overall Assessment**: [LGTM / Needs Changes]

**Blocking Issues**: [list]
**Non-Blocking Suggestions**: [list]
```

### Glossary Expansions

- **ADR**: Architecture Decision Record — Document recording a significant architecture decision
- **CDN**: Content Delivery Network
- **CI/CD**: Continuous Integration / Continuous Deployment
- **CSP**: Content Security Policy
- **CVE**: Common Vulnerabilities and Exposures
- **HMR**: Hot Module Replacement — Vite feature for fast dev updates
- **LGTM**: Looks Good To Me — Approval indicator in code reviews
- **PR**: Pull Request
- **SLA**: Service Level Agreement
- **SSR**: Server-Side Rendering
- **SSG**: Static Site Generation
- **TS**: TypeScript
- **TTL**: Time To Live — Cache expiration time
- **UX**: User Experience
- **VCS**: Version Control System (e.g., Git)
- **WIP**: Work In Progress

### Link Index

Quick navigation anchors:

- [Universal Context](#universal-context)
- [Operating Constraints](#operating-constraints)
- [Signals & Dashboards](#signals--dashboards)
- [Rituals & Cadence](#rituals--cadence)
- [Onboarding Path](#onboarding-path)
- [Repository Discovery](#repository-discovery)
- [Code Review Framework](#code-review-framework)
- [Code Review Checklist](#code-review-checklist)
  - [TypeScript/React](#typescriptreact)
  - [Python](#python)
  - [Firebase Functions](#firebase-functions)
  - [Security](#security)
  - [Performance](#performance)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [Codex CLI Playbook](#codex-cli-playbook)
- [Command Recipes (Read-Only)](#command-recipes-read-only)
- [Testing Matrix](#testing-matrix)
- [Deployment & Release](#deployment--release)
- [Governance](#governance)
- [Appendices](#appendices)

---

## Do Not Touch

⚠️ **These directories/files should not be modified without explicit approval**:

- `.obsidian/` — Obsidian editor configuration
- `.backup/` — Migration backups (DO NOT DELETE)
- `archive/` — Historical reference only (read-only)
- `node_modules/` — Managed by pnpm
- `.venv/` — Python virtual environment
- `site/` — Generated MkDocs output (gitignored)
- `.git/` — Git internals

⚠️ **Deprecated directories** (read-only, will be removed in Phase 3):

- `shared/` — Use `packages/ui/` instead
- `backend/firebase/functions/` — Verify not duplicate of `infra/firebase/functions/`

---

## Working Notes

**Note**: This section is for ephemeral notes during active work. For persistent documentation, create files in `~/Documents/working-warp/JR-Drew-Content-Brainstorm/`.

**Current Work Session**: [Add session-specific notes here]

**Next Actions**:
1. [Add immediate next steps here]

---

**End of WARP.md** — Last updated: 2025-10-31

For updates or feedback, create an issue with label `warp-update`.
