# ✈️ Pre-Flight Checklist — Migration Safety

Run these checks **before** executing the migration to ensure a smooth process.

---

## 🔍 Step 1: Verify Current State

```bash
cd /home/daclab-ai/Documents/JR-Drew-Content-Brainstorm

# Check git status (should commit or stash changes)
git status

# If you have uncommitted changes, commit them first:
git add -A
git commit -m "Pre-migration snapshot: Before web-next Vite conversion"

# OR stash them:
git stash save "Pre-migration backup $(date +%Y%m%d_%H%M%S)"
```

**Why?** This ensures you can easily revert if needed.

---

## 📦 Step 2: Verify Dependencies

```bash
# Check pnpm is installed
pnpm --version
# ✅ Should show version (e.g., 8.x.x or 9.x.x)

# Check codex CLI is available
which codex
# ✅ Should show path OR install with: npm install -g @codex-cli/core

# Verify node version
node --version
# ✅ Should be v18+ or v20+
```

---

## 🔐 Step 3: Backup Critical Files

```bash
# Create backup directory
mkdir -p .migration-backup

# Backup web-next current state
cp -r apps/web-next .migration-backup/web-next_$(date +%Y%m%d_%H%M%S)

# Backup rize directories (in case you need them later)
[ -d rize-frontend-analysis ] && cp -r rize-frontend-analysis .migration-backup/
[ -d rize-turbo ] && cp -r rize-turbo .migration-backup/

echo "✅ Backups created in .migration-backup/"
```

**Why?** Belt-and-suspenders safety. You can restore from git, but this is faster.

---

## 🧪 Step 4: Test Production App Still Works

```bash
# Ensure production app builds successfully before migration
pnpm --filter @jrpm/web build

# Expected output: "✓ built in XXXms" with no errors
```

**If this fails**: Fix production app first before proceeding.

---

## 📋 Step 5: Verify Migration Files Exist

```bash
# Check all migration documentation is present
ls -lh MIGRATE_WEBNEXT_TO_PRODUCTION.md
ls -lh MIGRATION_SUMMARY.md
ls -lh execute-migration.sh

# All three should exist
```

---

## 🎯 Step 6: Review What Will Change

```bash
# Quick scan of what will be archived
echo "=== Directories to Archive ==="
ls -lh rize-frontend-analysis/
ls -lh rize-turbo/

# Check if anything in web-next is actively used elsewhere
echo "=== Checking for web-next references in production ==="
grep -r "web-next" apps/web/ --include="*.ts" --include="*.tsx" --include="*.json" 2>/dev/null || echo "✅ No references found"

# Check if rize directories are referenced
echo "=== Checking for rize references in apps ==="
grep -r "rize-turbo\|rize-frontend-analysis" apps/ --include="*.ts" --include="*.tsx" --include="*.json" 2>/dev/null || echo "✅ No references found"
```

**Expected**: No references should be found. If found, review before archiving.

---

## ⚡ Step 7: Quick Disk Space Check

```bash
# Ensure you have enough space for build artifacts
df -h .
# ✅ Should have at least 1GB free
```

---

## 🔧 Step 8: Prepare Environment Variables

```bash
# Check if production has .env files we need to replicate
ls -la apps/web/.env* 2>/dev/null

# If .env.local exists, prepare to copy pattern to web-next
[ -f apps/web/.env.local ] && echo "📝 Remember to copy Firebase env vars after migration"
```

---

## ✅ Final Checklist

Before running `./execute-migration.sh`, confirm:

- [ ] Git status clean OR changes committed/stashed
- [ ] `pnpm`, `node`, `codex` installed and working
- [ ] Backups created in `.migration-backup/`
- [ ] Production app (`@jrpm/web`) builds successfully
- [ ] No active references to rize directories found
- [ ] At least 1GB disk space available
- [ ] Migration documentation files present
- [ ] You've read `MIGRATION_SUMMARY.md` and understand the changes

---

## 🚀 Ready to Execute?

If all checks pass:

```bash
# Execute the migration
./execute-migration.sh

# OR run codex directly
codex cli --cwd . --task "Execute complete migration from MIGRATE_WEBNEXT_TO_PRODUCTION.md"
```

---

## 🛟 Emergency Rollback

If something goes wrong during migration:

```bash
# Option 1: Git restore (fastest)
git restore apps/web-next/
git clean -fd apps/web-next/

# Option 2: Restore from backup
rm -rf apps/web-next
cp -r .migration-backup/web-next_* apps/web-next

# Option 3: Restore archived directories
mv archive/rize-*_* ./

# Then reinstall dependencies
pnpm install
```

---

## 📞 Support Checklist

If migration fails, gather this info:

```bash
# System info
node --version
pnpm --version
codex --version

# Error logs
cat MIGRATION_COMPLETE.md  # If it was generated
tail -50 apps/web-next/build.log  # If build failed

# Current state
git status
git diff apps/web-next/package.json
```

---

**All green?** Proceed with confidence! 🎯

Run: `./execute-migration.sh`
