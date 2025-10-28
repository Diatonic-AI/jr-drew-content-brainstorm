#!/usr/bin/env bash
set -Eeuo pipefail

. .venv/bin/activate || true
mkdocs build --strict
