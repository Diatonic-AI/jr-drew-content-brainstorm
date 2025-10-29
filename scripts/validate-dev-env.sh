#!/usr/bin/env bash
set -Eeuo pipefail

echo "🔍 Validating Local Development Environment"
echo "=============================================="
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
NODE_VERSION=$(node --version)
echo "   ✅ Node.js: $NODE_VERSION"

# Check Java
echo "☕ Checking Java..."
JAVA_VERSION=$(java --version | head -n 1)
echo "   ✅ Java: $JAVA_VERSION"
if [[ "$JAVA_VERSION" == *"17."* ]]; then
  echo "   ⚠️  Java 17 detected. Consider upgrading to Java 21 for future compatibility."
fi

# Check Firebase CLI
echo "🔥 Checking Firebase CLI..."
FIREBASE_VERSION=$(firebase --version)
echo "   ✅ Firebase CLI: $FIREBASE_VERSION"

# Check port availability
echo ""
echo "🔌 Checking port availability..."
PORTS=(9105 9181 5011 5013 9210 4001 5173)
PORT_NAMES=("Auth" "Firestore" "Functions" "Hosting" "Storage" "Emulator UI" "Vite Dev")

for i in "${!PORTS[@]}"; do
  PORT="${PORTS[$i]}"
  NAME="${PORT_NAMES[$i]}"
  if lsof -i ":$PORT" > /dev/null 2>&1; then
    PROCESS=$(lsof -i ":$PORT" | tail -n 1 | awk '{print $1, $2}')
    echo "   ⚠️  Port $PORT ($NAME): IN USE by $PROCESS"
  else
    echo "   ✅ Port $PORT ($NAME): Available"
  fi
done

# Check Firebase configuration
echo ""
echo "📋 Checking Firebase configuration..."
if [ -f "infra/firebase/firebase.json" ]; then
  echo "   ✅ firebase.json exists"
else
  echo "   ❌ firebase.json NOT FOUND"
  exit 1
fi

if [ -f "infra/firebase/.firebaserc" ]; then
  PROJECT=$(cat infra/firebase/.firebaserc | grep -o '"default": "[^"]*"' | cut -d'"' -f4)
  echo "   ✅ .firebaserc exists (project: $PROJECT)"
else
  echo "   ⚠️  .firebaserc NOT FOUND"
fi

# Check Firestore rules
if [ -f "infra/firebase/firestore.rules" ]; then
  echo "   ✅ firestore.rules exists"
else
  echo "   ⚠️  firestore.rules NOT FOUND (emulator will use open rules)"
fi

# Check web app configuration
echo ""
echo "🌐 Checking web app configuration..."
if [ -f "apps/web/.env.development.local" ]; then
  echo "   ✅ .env.development.local exists"
  if grep -q "VITE_USE_EMULATORS=true" apps/web/.env.development.local; then
    echo "   ✅ VITE_USE_EMULATORS=true is set"
  else
    echo "   ⚠️  VITE_USE_EMULATORS not set to true"
  fi
else
  echo "   ⚠️  .env.development.local NOT FOUND"
  echo "      Run: cd apps/web && cp .env.development.local.example .env.development.local"
fi

if [ -f "apps/web/src/lib/firebase/client.ts" ]; then
  if grep -q "connectAuthEmulator" apps/web/src/lib/firebase/client.ts; then
    echo "   ✅ Firebase client configured for emulators"
  else
    echo "   ⚠️  Firebase client missing emulator connections"
  fi
fi

echo ""
echo "=============================================="
echo "📚 Next Steps:"
echo ""
echo "1. Terminal A — Start Firebase Emulators:"
echo "   pnpm dev:emulators"
echo ""
echo "2. Terminal B — Start Vite Dev Server:"
echo "   pnpm --filter @jrpm/web dev:emulators"
echo ""
echo "3. Access:"
echo "   • Vite App:     http://127.0.0.1:5173"
echo "   • Emulator UI:  http://127.0.0.1:4001"
echo ""
echo "📖 Full documentation: docs/LOCAL_DEVELOPMENT.md"
echo ""
