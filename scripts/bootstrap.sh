#!/usr/bin/env bash
set -Eeuo pipefail

python3 -m venv .venv
. .venv/bin/activate
pip install -U pip
# Install project in editable mode with dev+sandbox extras
pip install -e ".[dev,sandbox]"
# Also install docs requirements if present
if [[ -f requirements.txt ]]; then
  pip install -r requirements.txt
fi
pre-commit install
