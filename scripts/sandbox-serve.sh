#!/usr/bin/env bash
set -Eeuo pipefail

# Launch the standalone sandbox API server
REPO_DIR="$(cd -- "${BASH_SOURCE[0]%/*}/.." && pwd)"
cd "$REPO_DIR"

if [[ ! -d .venv ]]; then
  echo "[sandbox] bootstrapping .venv" >&2
  bash ./scripts/bootstrap.sh
fi
. .venv/bin/activate

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8787}"
WORKERS="${WORKERS:-2}"

exec uvicorn tools.sandbox_server.app:app --host "$HOST" --port "$PORT" --workers "$WORKERS"