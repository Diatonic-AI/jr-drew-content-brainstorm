#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_NAME="${0##*/}"
LOG_ROOT="logs/firebase/logs"
PID_ROOT="logs/firebase/pids"
mkdir -p "$LOG_ROOT" "$PID_ROOT"

# Timestamp for this run
TS="$(date +%Y%m%d-%H%M%S)"

# Firebase CLI emits debug logs to firebase-debug.log & firestore-debug.log in CWD.
# We run from repo root but move/stream those files into our structured log directory.

EMULATOR_LOG="$LOG_ROOT/emulators-${TS}.log"
echo "[$SCRIPT_NAME] Starting Firebase emulators; consolidated log: $EMULATOR_LOG" >&2

# Start emulators with debug flag capturing stdout/stderr
firebase emulators:start --project jrpm-dev --config infra/firebase/firebase.json --only auth,firestore,functions,hosting,storage \
  > "$EMULATOR_LOG" 2>&1 &
EMULATOR_PID=$!
echo $EMULATOR_PID > "$PID_ROOT/emulators.pid"
echo "[$SCRIPT_NAME] Emulators PID $EMULATOR_PID" >&2

# Wait a short period for firebase CLI to emit its firebase-debug.log & firestore-debug.log
sleep 3

for f in firebase-debug.log firestore-debug.log; do
  if [[ -f "$f" ]]; then
    # Move & timestamp
    mv "$f" "$LOG_ROOT/${f%.log}-${TS}.log" || true
    echo "[$SCRIPT_NAME] Relocated $f to $LOG_ROOT/${f%.log}-${TS}.log" >&2
  fi
done

echo "[$SCRIPT_NAME] Emulator startup complete. Tail latest log: tail -f $EMULATOR_LOG" >&2
exit 0