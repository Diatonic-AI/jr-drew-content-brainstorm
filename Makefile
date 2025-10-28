# Makefile

.PHONY: setup lint format test docs-serve docs-build agent

VENV=.venv
PY=python3

setup:
	$(PY) -m venv $(VENV)
	. $(VENV)/bin/activate && pip install -U pip && pip install -e .[dev]
	. $(VENV)/bin/activate && pre-commit install

lint:
	. $(VENV)/bin/activate && black --check . && isort --check-only . && flake8 .

format:
	. $(VENV)/bin/activate && black . && isort .

test:
	. $(VENV)/bin/activate && pytest -q

docs-serve:
	. $(VENV)/bin/activate && mkdocs serve

docs-build:
	. $(VENV)/bin/activate && mkdocs build --strict

agent:
	./scripts/run-agent.sh
