#!/usr/bin/env bash
set -Eeuo pipefail

script_name="${0##*/}"
log() { printf '[%s] %s\n' "$script_name" "$*"; }

main() {
    log "Checking for running Firebase emulators..."
    
    # Find emulator processes
    EMULATOR_PIDS=$(ps -ef | grep -E 'firebase.*emulator|cloud-firestore-emulator|pubsub-emulator' | grep -v grep | awk '{print $2}' || true)
    
    if [ -z "$EMULATOR_PIDS" ]; then
        log "No running emulators found"
    else
        log "Found running emulators with PIDs: $EMULATOR_PIDS"
        log "Stopping emulators gracefully..."
        
        for pid in $EMULATOR_PIDS; do
            if kill -0 "$pid" 2>/dev/null; then
                log "Killing process $pid..."
                kill "$pid" || true
            fi
        done
        
        # Wait for processes to terminate
        sleep 2
        
        # Force kill if still running
        for pid in $EMULATOR_PIDS; do
            if kill -0 "$pid" 2>/dev/null; then
                log "Force killing stubborn process $pid..."
                kill -9 "$pid" || true
            fi
        done
        
        log "Emulators stopped"
    fi
    
    # Check for port conflicts
    log "Checking for port conflicts..."
    CONFLICTS=$(netstat -tulpn 2>/dev/null | grep -E ':(9105|9181|5011|5013|9210|9000|8085|4001|4400|4500)\b' || true)
    
    if [ -n "$CONFLICTS" ]; then
        log "⚠️  Port conflicts detected:"
        echo "$CONFLICTS"
        log "You may need to manually kill these processes"
        return 1
    fi
    
    log "✅ All emulator ports are free"
    log ""
    log "To start emulators, run: pnpm dev:emulators"
}

main "$@"
