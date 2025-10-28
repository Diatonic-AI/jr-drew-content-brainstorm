#!/usr/bin/env bash
set -Eeuo pipefail

. .venv/bin/activate
# Static analysis suite
ruff check .
black --check .
isort --check-only .
flake8 .
mypy .
bandit -q -r .
