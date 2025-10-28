# JR-Drew-Content-Brainstorm — Docker Sandbox

## Quick start (Docker)

```bash
# Build
docker compose build

# Run sandbox API at http://localhost:8787
docker compose up sandbox

# (Optional) Run docs server at http://localhost:8000
docker compose up docs
```

Env toggles:
- `SANDBOX_SHARE_VENV=1` — use repo `.venv` (shared with host)
- default `0` — isolated `/opt/venv` inside container

# JR Drew Content Brainstorm

This is your new *vault*.

Make a note of something, [[create a link]], or try [the Importer](https://help.obsidian.md/Plugins/Importer)!

When you're ready, delete this note and make the vault your own.