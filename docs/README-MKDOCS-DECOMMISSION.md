# MkDocs Decommission (2025-10-31)

The repository previously used MkDocs + Material theme to publish documentation to a static site (`site/` output, `mkdocs.yml` config, build/serve scripts, and GitHub Actions workflows).

## What Changed
Removed:
- `mkdocs.yml` configuration file
- Generated `site/` directory (untracked, deleted locally)
- Build/serve scripts: `scripts/docs-build.sh`, `scripts/docs-serve.sh`, `run_mkdocs_audit.sh`
- Makefile targets: `docs-serve`, `docs-build`
- NPM scripts: `docs:serve`, `docs:deploy`
- Python dependencies: mkdocs, mkdocs-material, mkdocstrings, mkdocs-roamlinks-plugin, mkdocs-awesome-pages-plugin
- Disabled GitHub workflows related to docs deployment
- MkDocs detection logic in `run.sh`

## Rationale
We migrated raw markdown files into a structured taxonomy under `docs/` with normalized chronological filenames. A static site build added maintenance overhead not aligned with current goals.

## Current Documentation Strategy
1. Author markdown directly under `docs/` categories.
2. Use the normalization script `scripts/reorg_root_markdown.sh` for any new root-level markdown.
3. Consume docs via repository browsing, IDE, or future lightweight viewer tooling (TBD).

## Adding New Documentation
1. Choose the correct category folder (e.g., `phase2/`, `backend/`, `governance/`).
2. Name file `YYYY-MM-DD-title-slug.md`.
3. First header line should mirror filename: `# YYYY-MM-DD title-slug`.
4. Cross-link with relative paths where helpful.

## If MkDocs Needs Revival
Re-instate by restoring `mkdocs.yml` and dependencies from git history (commit before `14b9b9a4`). Recreate Makefile targets and npm scripts as needed.

## Related Commits
- Reorganization commit: see commit hashes in history prior to removal.
- Decommission commit: `14b9b9a4`.

## Next Possible Enhancements
- Implement a small Vite-powered docs preview.
- Add a script to generate an index page with links grouped by category and date.
- Integrate linting for markdown (e.g., `markdownlint`).

---
Maintainer Note: Keep this file updated if documentation tooling strategy changes.