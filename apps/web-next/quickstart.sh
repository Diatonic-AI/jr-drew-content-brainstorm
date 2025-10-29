#!/usr/bin/env bash
set -Eeuo pipefail

script_name="${0##*/}"
log() { printf '[%s] %s\n' "$script_name" "$*"; }

main() {
  log "Diatonic AI - Quick Start"
  
  # Check if .env.local exists
  if [ ! -f .env.local ]; then
    log "⚠️  No .env.local found. Creating from template..."
    if [ -f .env.example ]; then
      cp .env.example .env.local
      log "✅ Created .env.local - PLEASE EDIT IT WITH YOUR CREDENTIALS"
      log "   You need to add:"
      log "   - Firebase config (from console.firebase.google.com)"
      log "   - Google Places API key (from console.cloud.google.com)"
    else
      log "❌ No .env.example found!"
      exit 1
    fi
  else
    log "✅ Found .env.local"
  fi
  
  # Check if node_modules exists
  if [ ! -d node_modules ]; then
    log "📦 Installing dependencies..."
    pnpm install
  else
    log "✅ Dependencies already installed"
  fi
  
  # Clear Next.js cache
  if [ -d .next ]; then
    log "🧹 Clearing Next.js cache..."
    rm -rf .next
  fi
  
  log ""
  log "🚀 Starting development server..."
  log "   URL: http://localhost:3000"
  log ""
  log "📋 What to test:"
  log "   1. Quiz funnel with typewriter animation"
  log "   2. Exit intent detection (move mouse to close browser)"
  log "   3. Authentication modals (login/signup)"
  log "   4. Phone number formatting"
  log "   5. Address autocomplete"
  log "   6. Protected route redirects"
  log ""
  log "⚠️  REMINDER: Configure .env.local with your API keys!"
  log ""
  
  pnpm dev
}

main "$@"
