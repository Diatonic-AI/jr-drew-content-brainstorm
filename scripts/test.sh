#!/usr/bin/env bash
set -Eeuo pipefail

. .venv/bin/activate
pytest -q
