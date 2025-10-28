#!/usr/bin/env bash
set -Eeuo pipefail

. .venv/bin/activate || true
mkdocs serve -a 127.0.0.1:8000
