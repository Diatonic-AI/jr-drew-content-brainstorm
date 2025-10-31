# JR-Drew Content Brainstorm Repository Audit
**Date:** 2025-10-31  
**Repository:** JR-Drew-Content-Brainstorm  
**Type:** Monorepo (pnpm workspaces + Python)

---

## 📋 TECHNOLOGIES & FRAMEWORKS

```
FRONTEND STACK:
├─ React 18.3.1 (UI library)
├─ TypeScript 5.6.3 / 5.9.3 (Type safety)
├─ Vite 5.4.10 (Build tool for apps/web)
├─ Electron (Desktop application framework)
├─ React Router 6.27.0 (Client-side routing)
├─ TailwindCSS 3.4.14 (Styling)
├─ Radix UI (Headless component primitives)
├─ Framer Motion 11.0.0 (Animations)
├─ Shadcn/UI (Component library via @diatonic/ui)
├─ Lucide React 0.453.0 (Icons)
└─ Next Themes 0.3.0 (Dark mode)

STATE MANAGEMENT:
├─ Zustand 4.5.0 (Global state)
├─ TanStack Query 5.51.0 (Server state)
└─ React Hook Form 7.65.0 (Form state)

DATA & VALIDATION:
├─ Zod 3.25.76 (Schema validation)
└─ @hookform/resolvers 5.2.2 (Form + Zod integration)

BACKEND/INFRASTRUCTURE:
├─ Firebase 11.0.0 (Auth, Firestore, Functions, Hosting, Storage)
├─ Node.js (Firebase Functions runtime)
└─ Python 3.10+ (Tooling & automation)

PYTHON TOOLING:
├─ FastAPI 0.120.1 (API framework for sandbox)
├─ Uvicorn 0.38.0 (ASGI server)
├─ Typer (CLI framework for pmx tool)
├─ Rich (Terminal output)
├─ Pydantic 2.12.3 (Data validation)
└─ MkDocs Material 9.6.22 (Documentation site)

BUILD & TOOLING:
├─ pnpm 9.12.0 (Package manager)
├─ Vitest 2.1.5 (Testing)
├─ ESLint 9.38.0 (Linting)
├─ Prettier 3.3.3 (Formatting)
├─ Black 25.9.0 (Python formatting)
├─ Ruff 0.14.2 (Python linting)
├─ Mypy 1.18.2 (Python type checking)
└─ Pyright 1.1.407 (Python type checking)

SPECIALIZED LIBRARIES:
├─ Recharts 2.12.7 (Charts/graphs)
├─ libphonenumber-js 1.10.57 (Phone validation)
├─ js-cookie 3.0.5 (Cookie management)
├─ date-fns 3.6.0 (Date utilities)
└─ sonner 1.7.4 (Toast notifications)

CI/CD:
├─ GitHub Actions (6 workflows)
└─ Firebase Hosting/Functions (Deployment)

DOCUMENTATION:
├─ MkDocs 1.6.1
├─ MkDocs Material 9.6.22
├─ MkDocstrings 0.30.1
├─ Obsidian (Markdown editor with plugins)
└─ Dataview plugin (Query/visualization)
```

---

## 📂 DIRECTORY STRUCTURE & PURPOSE

```
JR-Drew-Content-Brainstorm/
│
├─ apps/                           # Application workspaces
│  ├─ web/                         # Web application (Vite + React) [275MB]
│  │  ├─ src/
│  │  │  ├─ app/                   # App-level configuration
│  │  │  │  ├─ layouts/            # Page layout components
│  │  │  │  └─ providers/          # Context providers (theme, query)
│  │  │  ├─ components/            # React components
│  │  │  │  ├─ auth/               # Login/Signup modals
│  │  │  │  ├─ breaks/             # Break tracking UI
│  │  │  │  ├─ charts/             # Data visualization (recharts)
│  │  │  │  ├─ dashboard/          # Dashboard widgets
│  │  │  │  ├─ focus/              # Focus timer components
│  │  │  │  ├─ integrations/       # Third-party integrations
│  │  │  │  ├─ modals/             # Contact, exit intent modals
│  │  │  │  ├─ navigation/         # Nav, sidebar, breadcrumbs
│  │  │  │  ├─ productivity/       # Productivity tracking
│  │  │  │  ├─ projects/           # Project management UI
│  │  │  │  ├─ quiz/               # Onboarding quiz funnel
│  │  │  │  ├─ tracking/           # Time tracking
│  │  │  │  └─ ui/                 # Shadcn UI primitives (Button, Dialog, etc.)
│  │  │  ├─ hooks/                 # Custom React hooks
│  │  │  ├─ lib/                   # Utilities
│  │  │  │  └─ data/               # Static data (countries, etc.)
│  │  │  ├─ pages/                 # Route pages (React Router)
│  │  │  │  ├─ public/             # Unauthenticated pages (Landing)
│  │  │  │  ├─ dashboard/          # Dashboard page
│  │  │  │  ├─ projects/           # Project pages
│  │  │  │  ├─ tasks/              # Task management
│  │  │  │  ├─ productivity/       # Productivity pages
│  │  │  │  ├─ Settings/           # Settings pages
│  │  │  │  ├─ team/               # Team management
│  │  │  │  ├─ member/             # Member pages
│  │  │  │  ├─ admin/              # Admin pages
│  │  │  │  ├─ developer/          # Developer tools
│  │  │  │  └─ documentation/      # In-app docs
│  │  │  ├─ schemas/               # Zod validation schemas
│  │  │  ├─ services/              # API/Firebase services
│  │  │  ├─ stores/                # Zustand stores
│  │  │  ├─ styles/                # Global CSS, themes
│  │  │  ├─ types/                 # TypeScript type definitions
│  │  │  └─ __tests__/             # Test files
│  │  ├─ public/                   # Static assets
│  │  ├─ .env.local.example        # Environment template
│  │  └─ package.json              # Web app dependencies
│  │
│  └─ electron/                    # Electron desktop app [431MB]
│     └─ (Electron-specific structure)
│
├─ packages/                       # Shared packages [200KB]
│  └─ ui/                          # @diatonic/ui package
│     ├─ src/
│     │  ├─ components/            # Shared UI components
│     │  ├─ lib/                   # Utilities (cn, etc.)
│     │  └─ styles/                # Shared CSS
│     └─ package.json
│
├─ shared/                         # DEPRECATED shared code [192KB]
│  ├─ components/                  # ⚠️ LEGACY: Duplicates packages/ui
│  │  ├─ common/
│  │  ├─ layouts/
│  │  ├─ providers/
│  │  └─ ui/
│  ├─ lib/                         # Utilities
│  ├─ styles/                      # Styles
│  └─ types/                       # Types
│
├─ infra/                          # Infrastructure configuration [62MB]
│  └─ firebase/                    # Firebase project config
│     ├─ functions/                # Cloud Functions (Node.js)
│     │  ├─ src/                   # Function source code
│     │  └─ package.json
│     ├─ firebase.json             # Firebase hosting/functions config
│     └─ firestore.rules           # Firestore security rules
│
├─ backend/                        # Backend services [32KB]
│  └─ firebase/                    # Firebase-specific backend
│     └─ functions/                # ⚠️ DUPLICATE of infra/firebase/functions?
│
├─ docs/                           # Documentation [27MB]
│  ├─ 00-Meta/                     # Meta documentation
│  ├─ 01-Product/                  # Product specs
│  ├─ 02-Architecture/             # Architecture docs
│  ├─ 04-Runbooks/                 # Operational guides
│  ├─ 05-Decisions-ADRs/           # Architecture Decision Records
│  ├─ 06-Guides/                   # How-to guides
│  ├─ architecture/                # Architecture diagrams
│  ├─ assets/                      # Images, diagrams
│  ├─ automation/                  # Automation docs
│  │  └─ agents/                   # AI agent configuration
│  ├─ backend/                     # Backend docs
│  │  └─ modeling/                 # Data models
│  ├─ blog/                        # Blog posts
│  ├─ forms/                       # Form specs
│  │  ├─ analysis/
│  │  ├─ plan/
│  │  └─ tasks/
│  ├─ governance/                  # Governance policies
│  ├─ guide/                       # User guides
│  ├─ guides/                      # ⚠️ DUPLICATE of guide/?
│  ├─ phase2/                      # Phase 2 planning
│  │  ├─ examples/
│  │  ├─ extractions/
│  │  └─ testing/
│  ├─ project/                     # Project management
│  │  ├─ adr/                      # ADRs
│  │  └─ rfc/                      # RFCs
│  ├─ refactor/                    # Refactoring plans
│  │  ├─ analysis/
│  │  ├─ plan/
│  │  └─ tasks/
│  ├─ reference/                   # API reference
│  └─ templates/                   # Document templates
│
├─ site/                           # Built MkDocs site (gitignore)
│  ├─ architecture/
│  ├─ assets/
│  ├─ automation/
│  ├─ governance/
│  ├─ guide/
│  ├─ guides/
│  ├─ project/
│  ├─ reference/
│  └─ search/
│
├─ src/                            # Python source (pmx tool)
│  └─ pmx/
│     ├─ core/                     # Core modules
│     ├─ tasks/                    # Task automation
│     └─ egg-info/                 # Build artifacts
│
├─ scripts/                        # Build/automation scripts
│  ├─ firebase-audit.mjs           # Firebase security audit
│  └─ inventory-frontend.mjs       # Frontend component inventory
│
├─ tools/                          # Development tools
│  └─ sandbox_server/              # FastAPI sandbox server
│
├─ reports/                        # Analysis reports
│  ├─ 20251029-013721/
│  └─ merge_20251029-020330/
│     ├─ analysis/
│     └─ diffs/
│
├─ archive/                        # Archived/deprecated code
│  ├─ rize-frontend-analysis_20251030_234138/
│  └─ web-next_20251031_010837/    # Archived Next.js migration workspace
│     └─ web-next/
│
├─ $codex/                         # Codex AI tool working directory
│  └─ rize-frontend-analysis/
│
├─ .github/                        # GitHub configuration
│  ├─ ISSUE_TEMPLATE/              # Issue templates
│  └─ workflows/                   # GitHub Actions workflows
│     ├─ ci.yml                    # Main CI pipeline
│     ├─ deploy.yml                # Deployment workflow
│     ├─ docs-deploy.yml           # Docs deployment
│     ├─ docs.yml                  # Docs build
│     ├─ functions-ci.yml          # Firebase Functions CI
│     └─ web-deploy.yml            # Web app deployment
│
├─ .obsidian/                      # Obsidian vault configuration
│  └─ plugins/                     # Obsidian plugins
│     ├─ dataview/                 # Dataview plugin
│     ├─ obsidian-local-rest-api/
│     └─ templater-obsidian/
│
├─ .venv/                          # Python virtual environment
├─ .pip_packages/                  # ⚠️ User-installed Python packages (non-standard)
├─ .cache/                         # pip cache
├─ .local/                         # User-local Python installs
└─ .ruff_cache/                    # Ruff linter cache

ROOT CONFIG FILES:
├─ package.json                    # Monorepo root package
├─ pnpm-workspace.yaml             # pnpm workspace configuration
├─ pnpm-lock.yaml                  # pnpm lockfile
├─ pyproject.toml                  # Python project configuration
├─ mkdocs.yml                      # MkDocs site configuration
├─ eslint.strict.config.mjs        # Strict ESLint rules
├─ eslint.warn.config.mjs          # Warning-only ESLint rules
├─ .pre-commit-config.yaml         # Pre-commit hooks configuration
├─ project.yaml                    # Project metadata
├─ README.md                       # Repository README
├─ CONTRIBUTING.md                 # Contribution guidelines
├─ LICENSE                         # License file
├─ MIGRATION_FINAL_REPORT.md       # Migration documentation
├─ MIGRATION_PROGRESS_REPORT.md    # Migration tracking
├─ WEB_NEXT_REMOVAL_AUDIT.md       # Migration audit
└─ REPO_AUDIT_2025-10-31.md        # This file
```

---

## 🚨 CRITICAL ISSUES & AREAS OF CONCERN

### 1. DUPLICATE & CONFLICTING DIRECTORIES

**Issue:** Multiple directories serving same purpose, causing confusion and maintenance burden.

```
DUPLICATES FOUND:
├─ shared/ vs packages/ui/
│  ├─ shared/components/ui/          ⚠️ DUPLICATE
│  └─ packages/ui/src/components/    ✓ CANONICAL (referenced in apps/web)
│  └─ ACTION: Delete shared/ entirely or migrate remaining unique code
│
├─ backend/firebase/functions/ vs infra/firebase/functions/
│  ├─ backend/firebase/functions/    ⚠️ DUPLICATE/ORPHANED
│  └─ infra/firebase/functions/      ✓ CANONICAL (has package.json, actual code)
│  └─ ACTION: Delete backend/ directory if empty or consolidate
│
├─ docs/guide/ vs docs/guides/
│  ├─ Similar naming, unclear differentiation
│  └─ ACTION: Merge into single docs/guides/ directory
│
└─ docs/{guide,reference,blog,assets}/
   ├─ Empty placeholder directory name
   └─ ACTION: Remove or rename properly
```

**Impact:**
- Developers don't know which directory to use
- Code may be outdated in one copy
- Import paths inconsistent (some use shared/, some use @diatonic/ui)
- Wastes storage (shared/ = 192KB, mostly duplicated)

**Fix Priority:** 🔴 HIGH — Address within 1 week


### 2. NON-STANDARD PYTHON PACKAGE INSTALLATION

**Issue:** Python packages installed to `.pip_packages/` instead of virtual environment.

```
CURRENT STATE:
├─ .venv/                          # Correct virtual environment
├─ .pip_packages/                  # ⚠️ 150+ packages installed HERE
└─ .local/                         # User-local installs

PROBLEMS:
- Packages not isolated to project
- pip list won't show these packages
- Breaks reproducibility
- Non-standard for Python projects
- Likely caused by --target flag or PIP_TARGET env var
```

**Impact:**
- Other developers can't replicate environment
- CI/CD pipelines won't have same packages
- Security vulnerabilities hidden from dependency scanners
- Cannot use pip freeze > requirements.txt correctly

**Fix Priority:** 🔴 HIGH — Fix immediately

**Solution:**
```bash
# 1. Activate virtual environment
source .venv/bin/activate

# 2. Reinstall all dependencies properly
pip install -e ".[dev,sandbox]"

# 3. Verify packages are in .venv/
pip list

# 4. Remove non-standard directories
rm -rf .pip_packages .local .cache

# 5. Update .gitignore to prevent recurrence
echo ".pip_packages/" >> .gitignore
echo ".local/" >> .gitignore
```


### 3. INCONSISTENT PAGE DIRECTORY STRUCTURE

**Issue:** Multiple subdirectories with overlapping or unclear purposes in apps/web/src/pages/.

```
CURRENT:
apps/web/src/pages/
├─ Tasks/                          # Capital T
├─ tasks/                          # Lowercase t ⚠️ DUPLICATE?
├─ Projects/                       # Capital P
├─ projects/                       # Lowercase p ⚠️ DUPLICATE?
├─ Settings/                       # Capital S
└─ settings/                       # Lowercase s ⚠️ DUPLICATE?

CASE-SENSITIVITY ISSUES:
- Linux/macOS: Two different directories
- Windows: Potential conflicts
- Git: May not track case changes properly
```

**Impact:**
- Import confusion (import from Tasks or tasks?)
- Route naming inconsistency
- Merge conflicts on case-insensitive filesystems
- Developer confusion

**Fix Priority:** 🟡 MEDIUM — Fix within 2 weeks

**Solution:**
```bash
# Standardize to lowercase for all page directories
# Keep only one version, migrate imports
mv apps/web/src/pages/Tasks/* apps/web/src/pages/tasks/
mv apps/web/src/pages/Projects/* apps/web/src/pages/projects/
mv apps/web/src/pages/Settings/* apps/web/src/pages/settings/
rm -rf apps/web/src/pages/Tasks
rm -rf apps/web/src/pages/Projects
rm -rf apps/web/src/pages/Settings
```


### 4. MISSING ENVIRONMENT FILES

**Issue:** No .env files for development, only examples.

```
MISSING:
├─ apps/web/.env.local             # ⚠️ NOT CREATED
├─ apps/electron/.env              # ⚠️ NOT CHECKED
└─ infra/firebase/functions/.env   # ⚠️ NOT CHECKED

EXISTS:
└─ apps/web/.env.local.example     # ✓ Template exists
```

**Impact:**
- Apps won't run without manual .env creation
- No clear instructions in README for setup
- Developers must reverse-engineer required variables
- Firebase emulators may fail to start

**Fix Priority:** 🟡 MEDIUM — Fix within 1 week

**Solution:**
```bash
# 1. Copy example to actual env file
cp apps/web/.env.local.example apps/web/.env.local

# 2. Add to README.md setup instructions
cat >> README.md <<EOF

## Environment Setup

1. Copy environment template:
   \`\`\`bash
   cp apps/web/.env.local.example apps/web/.env.local
   \`\`\`

2. Fill in required values:
   - Firebase credentials (from Firebase Console)
   - Google Places API key (from Google Cloud Console)
   - Set VITE_USE_EMULATORS=true for local development

EOF

# 3. Ensure .env.local is in .gitignore
echo "**/.env.local" >> .gitignore
```


### 5. GITHUB WORKFLOWS DUPLICATION

**Issue:** Multiple similar workflows for docs deployment.

```
.github/workflows/
├─ docs.yml                        # Docs build workflow
├─ docs-deploy.yml                 # Docs deployment workflow ⚠️ DUPLICATE?
└─ (Total: 6 workflows)

POTENTIAL ISSUES:
- docs.yml and docs-deploy.yml may do same thing
- Workflows may conflict or run redundantly
- Unclear which is canonical
```

**Impact:**
- Wasted CI/CD minutes
- Confusing which workflow to modify
- Potential race conditions

**Fix Priority:** 🟢 LOW — Review and consolidate within 1 month

**Solution:**
```bash
# Review both workflow files
cat .github/workflows/docs.yml
cat .github/workflows/docs-deploy.yml

# If duplicates, keep one and delete other
# If different purposes, rename for clarity:
# - docs-build.yml (for PR checks)
# - docs-deploy.yml (for production deployment)
```


### 6. MONOREPO WORKSPACE CONFIGURATION INCOMPLETE

**Issue:** pnpm-workspace.yaml includes infra/* but not all subdirectories are valid packages.

```
pnpm-workspace.yaml:
workspaces:
  - "apps/*"
  - "packages/*"
  - "infra/*"           # ⚠️ infra/firebase/functions has package.json
                        # but infra/firebase does NOT

PROBLEM:
- infra/firebase/ is not a package, only infra/firebase/functions/ is
- Causes pnpm warnings or errors
```

**Impact:**
- pnpm install warnings
- Unclear package structure
- infra/firebase/ config files not cleanly separated from functions code

**Fix Priority:** 🟡 MEDIUM — Fix within 2 weeks

**Solution:**
```yaml
# Option 1: Be more specific
workspaces:
  - "apps/*"
  - "packages/*"
  - "infra/firebase/functions"

# Option 2: Restructure infra/ to match pattern
# Move infra/firebase/firebase.json to root or separate config/ directory
```


### 7. UNUSED/ORPHANED DIRECTORIES

**Issue:** Several directories appear to be temporary, experimental, or no longer used.

```
QUESTIONABLE:
├─ $codex/                         # Codex AI tool output? Add to .gitignore?
├─ reports/                        # Old analysis reports (Oct 29)
├─ archive/                        # ✓ GOOD: Timestamped archives
├─ site/                           # MkDocs build output (should be in .gitignore)
├─ .stdout.json                    # Debug output? Should be gitignored
└─ .cache/, .ruff_cache/           # Should be in .gitignore
```

**Impact:**
- Clutter in repository
- Confusion about what's production vs. experimental
- Wasted storage in git history

**Fix Priority:** 🟢 LOW — Clean up within 1 month

**Solution:**
```bash
# Add to .gitignore
cat >> .gitignore <<EOF
$codex/
site/
.stdout.json
.cache/
.ruff_cache/
reports/
EOF

# Remove from git if already tracked
git rm -r --cached $codex/ site/ reports/ .stdout.json .cache/ .ruff_cache/
```


### 8. MISSING TYPE DEFINITIONS

**Issue:** Some services and stores may lack proper TypeScript types.

```
CHECK THESE:
apps/web/src/services/           # ✓ auth.service.ts exists
apps/web/src/stores/             # Need to verify all stores have types
apps/web/src/types/              # Central type definitions
```

**Impact:**
- Type errors at build time
- Poor IDE autocomplete
- Runtime errors from type mismatches

**Fix Priority:** 🟢 LOW — Review and improve over time

**Solution:**
```bash
# Run TypeScript compiler in strict mode
cd apps/web
pnpm exec tsc --noEmit --strict

# Fix any type errors reported
# Add explicit types to all function parameters and return values
```


### 9. TEST COVERAGE MISSING

**Issue:** Test directory exists but likely minimal test coverage.

```
TESTING:
apps/web/src/__tests__/            # ⚠️ May be empty or minimal
apps/web/package.json:
  "test": "vitest run"             # ✓ Test script exists

NO COVERAGE REPORTS FOUND
NO CI TEST RUNS IN WORKFLOWS (need to verify)
```

**Impact:**
- Regressions go undetected
- Refactoring is risky
- No confidence in code quality

**Fix Priority:** 🟡 MEDIUM — Start adding tests incrementally

**Solution:**
```bash
# 1. Add test coverage to package.json
"test:coverage": "vitest run --coverage"

# 2. Add test step to .github/workflows/ci.yml
- name: Run tests
  run: pnpm test

# 3. Start with critical paths (auth, data fetching)
# 4. Aim for 60%+ coverage before considering "done"
```


### 10. DOCUMENTATION STRUCTURE UNCLEAR

**Issue:** Docs directory has overlapping categories and inconsistent naming.

```
docs/
├─ 00-Meta/                        # ✓ GOOD: Numbered prefix
├─ 01-Product/
├─ 02-Architecture/
├─ 04-Runbooks/                    # ⚠️ Where is 03-???
├─ 05-Decisions-ADRs/
├─ 06-Guides/
├─ guide/                          # ⚠️ DUPLICATE of 06-Guides?
├─ guides/                         # ⚠️ DUPLICATE of 06-Guides?
├─ governance/
├─ reference/
└─ templates/

MISSING:
└─ 03-* directory (gap in numbering)
```

**Impact:**
- Contributors don't know where to put new docs
- Duplicate content across guide/, guides/, 06-Guides/
- MkDocs navigation may be confusing

**Fix Priority:** 🟢 LOW — Reorganize during next doc sprint

**Solution:**
```bash
# 1. Consolidate guide directories
mkdir -p docs/06-Guides
mv docs/guide/* docs/06-Guides/ 2>/dev/null || true
mv docs/guides/* docs/06-Guides/ 2>/dev/null || true
rm -rf docs/guide docs/guides

# 2. Add missing category or renumber
# If 03 is intentionally skipped, document why

# 3. Update mkdocs.yml nav structure to match
```


### 11. ESLINT CONFIGURATION SPLIT

**Issue:** Two ESLint configs (strict vs. warn) but unclear when to use which.

```
ROOT:
├─ eslint.strict.config.mjs        # Strict rules
└─ eslint.warn.config.mjs          # Warning-only rules

package.json scripts:
├─ "lint:warn": "eslint ... eslint.warn.config.mjs"
├─ "lint:strict": "eslint ... eslint.strict.config.mjs"
└─ "lint:report": "eslint ... eslint.warn.config.mjs"

QUESTIONS:
- Which config is used in CI?
- Which should developers run locally?
- Should there be a migration path from warn → strict?
```

**Impact:**
- Inconsistent code quality
- Developers may ignore warnings
- CI may pass with warn config but fail with strict

**Fix Priority:** 🟡 MEDIUM — Clarify usage within 2 weeks

**Solution:**
```bash
# 1. Document in CONTRIBUTING.md:
cat >> CONTRIBUTING.md <<EOF

## Linting

- **Local development:** Run \`pnpm lint:warn\` (warnings only)
- **Pre-commit:** \`lint:strict\` runs automatically via pre-commit hooks
- **CI:** \`lint:strict\` runs on all PRs (must pass)

Migration plan: All new code must pass strict mode. Legacy code has warnings.

EOF

# 2. Update .github/workflows/ci.yml to use strict mode
- run: pnpm lint:strict
```


### 12. FIREBASE CONFIGURATION DUPLICATION

**Issue:** Firebase config appears in multiple locations.

```
FIREBASE CONFIGS:
apps/web/src/lib/firebase.ts       # Firebase SDK initialization
infra/firebase/firebase.json       # Firebase project config
backend/firebase/                  # ⚠️ Unclear purpose

POTENTIAL ISSUES:
- Firestore rules, functions, hosting config all in infra/firebase/
- But backend/firebase/functions/ may be duplicate
```

**Impact:**
- Unclear where to update Firebase settings
- Risk of deploying wrong config

**Fix Priority:** 🟡 MEDIUM — Consolidate within 2 weeks

**Solution:**
```bash
# 1. Verify backend/firebase/functions/ is actually used
# 2. If duplicate, delete it
# 3. Keep ALL Firebase infrastructure in infra/firebase/
# 4. Document in README.md that infra/ is source of truth
```


### 13. MISSING CHANGELOG

**Issue:** No CHANGELOG.md file to track version history and changes.

```
FOUND:
├─ README.md                       # ✓ Exists
├─ CONTRIBUTING.md                 # ✓ Exists
├─ LICENSE                         # ✓ Exists
└─ CHANGELOG.md                    # ⚠️ MISSING

MIGRATION DOCS EXIST:
├─ MIGRATION_FINAL_REPORT.md       # ✓ Good one-time doc
├─ MIGRATION_PROGRESS_REPORT.md
└─ WEB_NEXT_REMOVAL_AUDIT.md
```

**Impact:**
- No record of what changed between versions
- Hard to understand when bugs were introduced
- Poor communication with stakeholders

**Fix Priority:** 🟢 LOW — Create within 1 month

**Solution:**
```bash
# Create CHANGELOG.md with standard format
cat > CHANGELOG.md <<EOF
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with monorepo structure

## [0.1.0] - 2025-10-31

### Added
- Web application (Vite + React)
- Electron desktop application
- Firebase backend (Auth, Firestore, Functions)
- Quiz funnel onboarding flow
- Productivity tracking features
- MkDocs documentation site

### Fixed
- Migrated from Next.js to Vite
- Consolidated authentication to Zustand + services

EOF
```


### 14. PRE-COMMIT HOOKS NOT DOCUMENTED

**Issue:** .pre-commit-config.yaml exists but not mentioned in setup docs.

```
FOUND:
└─ .pre-commit-config.yaml         # ⚠️ Exists but no install instructions

CONTRIBUTING.md:
- No mention of pre-commit hooks
- No instructions to run `pre-commit install`
```

**Impact:**
- Developers commit code without running hooks
- Linting/formatting only caught in CI
- Wasted CI runs and developer time

**Fix Priority:** 🟡 MEDIUM — Document within 1 week

**Solution:**
```bash
# Add to CONTRIBUTING.md:
cat >> CONTRIBUTING.md <<EOF

## Setup Pre-Commit Hooks

We use pre-commit hooks to enforce code quality before commits.

\`\`\`bash
# Install pre-commit (once)
pip install pre-commit

# Install git hooks
pre-commit install

# Manually run hooks on all files (optional)
pre-commit run --all-files
\`\`\`

Hooks configured:
- ESLint (strict mode)
- Prettier (formatting)
- Python: black, isort, ruff, mypy
- Trailing whitespace removal
- File size checks

EOF
```


### 15. LARGE APP SIZES

**Issue:** apps/electron is 431MB, apps/web is 275MB (including node_modules).

```
SIZES:
apps/electron/       431MB          # ⚠️ Very large for Electron app
apps/web/            275MB          # ⚠️ Large but acceptable with node_modules
infra/               62MB
docs/                27MB
```

**Impact:**
- Slow git clone times
- Large CI/CD artifact storage
- Slow local development (node_modules reinstalls)

**Fix Priority:** 🟢 LOW — Review after other issues resolved

**Solution:**
```bash
# 1. Check if dist/ or node_modules committed by mistake
find apps/electron -name "node_modules" -o -name "dist" -o -name "build"

# 2. Ensure .gitignore has:
**/node_modules/
**/dist/
**/build/
**/.next/

# 3. Audit dependencies for unused packages
pnpm -C apps/electron exec depcheck
pnpm -C apps/web exec depcheck

# 4. Consider splitting Electron app into separate repo if unrelated to web
```

---

## 🔧 RECOMMENDED ACTION PLAN

### Phase 1: Critical Fixes (Week 1)

```
PRIORITY 🔴 HIGH:
1. Fix Python package installation (.pip_packages → .venv)
2. Delete duplicate directories (shared/, backend/)
3. Create .env files from examples
4. Document environment setup in README
5. Fix page directory case-sensitivity (Tasks → tasks)

EFFORT: 4-6 hours
IMPACT: Immediate improvement in developer experience
```

### Phase 2: Structure & Configuration (Weeks 2-3)

```
PRIORITY 🟡 MEDIUM:
6. Consolidate docs structure (guide/ guides/ 06-Guides/)
7. Fix pnpm workspace configuration
8. Clarify ESLint config usage (warn vs strict)
9. Document pre-commit hooks in CONTRIBUTING.md
10. Add test coverage reporting to CI
11. Review and consolidate GitHub workflows

EFFORT: 8-10 hours
IMPACT: Better project organization and developer clarity
```

### Phase 3: Quality & Documentation (Month 1)

```
PRIORITY 🟢 LOW:
12. Create CHANGELOG.md
13. Add .gitignore entries for build artifacts
14. Review and improve TypeScript types
15. Start incremental test coverage (aim for 60%)
16. Audit Electron app size
17. Clean up orphaned directories ($codex, reports)

EFFORT: 12-15 hours
IMPACT: Long-term maintainability and code quality
```

---

## ✅ CHECKLIST FOR TEAM LEAD

```
IMMEDIATE (This Week):
☐ Assign Phase 1 tasks to developers
☐ Create .env.local files for all apps
☐ Fix Python package installation
☐ Delete shared/ and backend/ directories
☐ Standardize page directory names (lowercase)

SHORT-TERM (Next 2 Weeks):
☐ Consolidate docs structure
☐ Update CONTRIBUTING.md with setup instructions
☐ Fix pnpm workspace config
☐ Review all GitHub workflows for duplication
☐ Add test step to CI pipeline

ONGOING:
☐ Enforce pre-commit hooks on all commits
☐ Write tests for new features (aim for 60% coverage)
☐ Update CHANGELOG.md with each release
☐ Monitor bundle sizes and dependency count
☐ Review eslint warnings weekly and fix incrementally
```

---

**SUMMARY:**
- **15 issues identified** across directory structure, configuration, and code quality
- **Priority breakdown:** 2 critical (🔴), 8 medium (🟡), 5 low (🟢)
- **Estimated effort:** 24-31 hours total to address all issues
- **Immediate blockers:** Python packages, duplicate directories, missing env files

---

**END OF AUDIT**
