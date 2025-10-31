#!/usr/bin/env bash
set -Eeuo pipefail

LOG_ROOT="logs/lint/logs"
PID_ROOT="logs/lint/pids"
mkdir -p "$LOG_ROOT" "$PID_ROOT"
LOG_FILE="$LOG_ROOT/lint-run.log"
echo "[lint.sh] Writing lint output to $LOG_FILE" >&2
exec > >(tee "$LOG_FILE") 2>&1

. .venv/bin/activate
# Static analysis suite
ruff check .
black --check .
isort --check-only .
flake8 .
mypy .
bandit -q -r .
