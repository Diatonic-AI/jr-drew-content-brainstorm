# Contributing

## Prereqs
- Python 3.10+
- Git

## Setup
```
make setup
```

## Branching
- Create feature branches from `develop` (or `main` if no develop): `git checkout -b feature/short-name`

## Commit & PRs
- Small commits, conventional messages preferred
- Open a PR to `develop` or `main`; ensure CI passes

## Common tasks
- Lint: `make lint`
- Format: `make format`
- Test: `make test`
- Docs: `make docs-serve`
