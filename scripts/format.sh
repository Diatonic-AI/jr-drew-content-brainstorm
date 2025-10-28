#!/usr/bin/env bash
set -Eeuo pipefail

. .venv/bin/activate
# Auto-fix formatting and simple lint issues
ruff check --fix .
black .
isort .
