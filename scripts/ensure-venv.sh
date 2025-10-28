#!/usr/bin/env bash
set -Eeuo pipefail

# Ensure local .venv exists and has required packages
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi
. .venv/bin/activate
pip install -U pip
pip install -e ".[dev,sandbox]"
if [[ -f requirements.txt ]]; then
  pip install -r requirements.txt
fi