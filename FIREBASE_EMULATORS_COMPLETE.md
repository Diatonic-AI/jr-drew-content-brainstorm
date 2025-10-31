# Firebase Emulators - Complete Setup Summary

**Date**: 2025-10-31  
**Status**: ✅ ALL EMULATORS RUNNING  
**Configuration**: Full suite with Database, Pub/Sub, and Extensions support

---

## ✅ What Was Completed

### 1. ESLint Configuration Fixed
- ✅ Created `infra/firebase/functions/eslint.config.mjs`
- ✅ Imports repo-wide flat ESLint configuration
- ✅ Verified: `pnpm -C infra/firebase/functions lint` works successfully

### 2. Realtime Database Emulator Configured
- ✅ **Database rules**: `infra/firebase/database.rules.json` enhanced with:
  - Multi-tenant security rules
  - User presence tracking support (`/orgs/{orgId}/presence/{uid}`)
  - Realtime notifications support
  - Proper validation for status and lastSeen fields
- ✅ **Emulator port**: 127.0.0.1:9000
- ✅ **Emulator UI**: http://127.0.0.1:4001/database

### 3. Pub/Sub Emulator Configured
- ✅ **Emulator port**: 127.0.0.1:8085
- ✅ Now the `scheduleDueSoon` function can run properly
- ✅ Enables scheduled function testing locally

### 4. Extensions Emulator Configured
- ✅ Created `infra/firebase/extensions/extensions.yaml` manifest
- ✅ Template includes popular extensions:
  - Delete User Data
  - Send Email (Firestore trigger)
  - Resize Images (Storage trigger)
  - Algolia Search integration
  - BigQuery Export
- ✅ **Emulator port**: 127.0.0.1:5011 (shares Functions port)
- ✅ **Emulator UI**: http://127.0.0.1:4001/extensions

### 5. Updated Startup Scripts
- ✅ `pnpm dev:emulators` - Starts ALL emulators (new default)
- ✅ `pnpm dev:emulators:core` - Starts core 5 only (fallback)
- ✅ Created `scripts/restart-emulators.sh` - Safe restart utility

---

## 🚀 Currently Running Emulators

```
┌────────────────┬────────────────┬──────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI              │
├────────────────┼────────────────┼──────────────────────────────────┤
│ Authentication │ 127.0.0.1:9105 │ http://127.0.0.1:4001/auth       │
│ Functions      │ 127.0.0.1:5011 │ http://127.0.0.1:4001/functions  │
│ Firestore      │ 127.0.0.1:9181 │ http://127.0.0.1:4001/firestore  │
│ Database       │ 127.0.0.1:9000 │ http://127.0.0.1:4001/database   │
│ Hosting        │ 127.0.0.1:5013 │ n/a                              │
│ Pub/Sub        │ 127.0.0.1:8085 │ n/a                              │
│ Storage        │ 127.0.0.1:9210 │ http://127.0.0.1:4001/storage    │
│ Extensions     │ 127.0.0.1:5011 │ http://127.0.0.1:4001/extensions │
└────────────────┴────────────────┴──────────────────────────────────┘
```

**Emulator UI Dashboard**: http://127.0.0.1:4001/

---

## 📋 Cloud Functions Status

All 4 functions loaded successfully:

1. ✅ **httpExportProject** (callable)
   - http://127.0.0.1:5011/jrpm-dev/us-central1/httpExportProject

2. ✅ **httpImportProject** (callable)
   - http://127.0.0.1:5011/jrpm-dev/us-central1/httpImportProject

3. ✅ **onTaskWrite** (Firestore trigger)
   - Listens to: `orgs/{orgId}/projects/{projectId}/tasks/{taskId}`
   - Normalizes task data and logs activity

4. ✅ **scheduleDueSoon** (scheduled, every 60 minutes)
   - Now working with Pub/Sub emulator!
   - Flags tasks due within 24 hours

---

## 🎯 Realtime Database Use Cases

The Database emulator now supports these real-time features:

### User Presence Tracking
```typescript
// Track online/offline status
const presenceRef = ref(database, `orgs/${orgId}/presence/${uid}`);
set(presenceRef, {
  status: 'online',
  lastSeen: Date.now()
});

// Listen for presence changes
onValue(presenceRef, (snapshot) => {
  const status = snapshot.val();
  console.log('User status:', status);
});
```

### Realtime Notifications
```typescript
// Listen for notifications
const notificationsRef = ref(database, `orgs/${orgId}/realtime_notifications`);
onChildAdded(notificationsRef, (snapshot) => {
  const notification = snapshot.val();
  showNotification(notification);
});
```

---

## 🛠️ Management Commands

### Start Emulators
```bash
# Full suite (recommended)
pnpm dev:emulators

# Core services only (fallback)
pnpm dev:emulators:core

# Background mode
nohup pnpm dev:emulators > logs/emulators.log 2>&1 &
```

### Stop Emulators
```bash
# Graceful stop
./scripts/restart-emulators.sh

# Force kill
pkill -f "firebase.*emulator"
pkill -f "cloud-firestore-emulator"
pkill -f "pubsub-emulator"
```

### Check Status
```bash
# Check running processes
ps aux | grep -E "firebase.*emulator"

# Check port usage
netstat -tulpn | grep -E ":(9105|9181|5011|5013|9210|9000|8085|4001|4400|4500)"

# View logs
tail -f logs/emulators-full.log
```

---

## 📁 File Structure

```
infra/firebase/
├── firebase.json                      # Main configuration
├── firestore.rules                    # Firestore security rules
├── firestore.indexes.json             # Composite indexes
├── database.rules.json                # ✨ NEW: Realtime Database rules
├── storage.rules                      # Storage security rules
├── extensions/
│   └── extensions.yaml                # ✨ NEW: Extensions manifest
└── functions/
    ├── src/
    │   ├── index.ts
    │   ├── modules/                   # Function modules
    │   ├── lib/firebase.ts            # Admin SDK singleton
    │   └── validators/                # Zod schemas
    ├── package.json
    ├── tsconfig.json
    └── eslint.config.mjs              # ✨ NEW: ESLint config
```

---

## 🔌 Frontend Integration

### Environment Configuration

**`apps/web/.env.local`**:
```bash
# Firebase Config
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=jrpm-dev
VITE_FIREBASE_DATABASE_URL=https://jrpm-dev-default-rtdb.firebaseio.com
VITE_FIREBASE_STORAGE_BUCKET=<project-id>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
VITE_FIREBASE_APP_ID=<app-id>
VITE_FIREBASE_MEASUREMENT_ID=<measurement-id>

# Enable Emulators
VITE_USE_EMULATORS=true
```

### Client Code Example

```typescript
// apps/web/src/lib/firebase/client.ts
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Connect to emulators in development
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9105');
  connectFirestoreEmulator(db, '127.0.0.1', 9181);
  connectDatabaseEmulator(rtdb, '127.0.0.1', 9000);
  console.log('🔧 Connected to Firebase Emulators');
}
```

---

## 🎨 Installing Firebase Extensions

### Option 1: Install Specific Extension
```bash
# Example: Install Delete User Data extension
firebase ext:install firebase/delete-user-data \
  --project=jrpm-dev \
  --params=extensions/params/delete-user-data.env

# Configure in extensions.yaml
```

### Option 2: Export from Production
```bash
# Export all extensions from production
firebase ext:export --project=jrpm-prod

# Import to dev
firebase ext:install --project=jrpm-dev
```

### Option 3: Use Pre-configured Templates
Edit `infra/firebase/extensions/extensions.yaml` and uncomment desired extensions.

---

## 🚨 Firebase Alerts (TODO)

Firebase Alerts integration is planned for:
- Performance monitoring alerts
- Crashlytics alerts
- Budget alerts
- Usage quota alerts

**Setup Location**: Firebase Console > Project Settings > Integrations > Alerts

**Recommended Alerts**:
1. **Performance**: P95 latency > 1s for any page
2. **Crashlytics**: Crash-free rate < 99%
3. **Budget**: Daily cost > $10
4. **Functions**: Error rate > 5%
5. **Firestore**: Read/write quota > 80%

**Integration Steps**:
1. Go to Firebase Console: https://console.firebase.google.com/project/jrpm-dev/settings/integrations
2. Enable Cloud Monitoring
3. Configure alert policies
4. Set up notification channels (email, Slack, PagerDuty)

---

## 📊 Monitoring & Debugging

### Emulator UI Features
- **Authentication**: View users, test sign-in flows
- **Firestore**: Browse collections, query data, test security rules
- **Database**: View realtime data, test presence
- **Functions**: View logs, inspect requests/responses
- **Storage**: Browse buckets, upload files
- **Extensions**: View installed extensions, check logs

### Debug Logs
```bash
# Firestore logs
tail -f firestore-debug.log

# Database logs
tail -f database-debug.log

# Pub/Sub logs
tail -f pubsub-debug.log

# Full emulator output
tail -f logs/emulators-full.log
```

---

## ✅ Validation Checklist

- [x] ESLint working in Functions package
- [x] Realtime Database emulator running
- [x] Pub/Sub emulator running (scheduleDueSoon works)
- [x] Extensions emulator configured
- [x] All 8 emulators active and accessible
- [x] Emulator UI accessible at :4001
- [x] Database security rules configured
- [x] Extensions manifest created
- [x] Startup scripts updated
- [x] Restart utility script created
- [x] Documentation updated
- [ ] Frontend connected to all emulators (TODO)
- [ ] Firebase Alerts configured (TODO)
- [ ] Extensions installed and tested (TODO)

---

## 🔗 Quick Links

- **Emulator UI**: http://127.0.0.1:4001/
- **Auth Emulator**: http://127.0.0.1:4001/auth
- **Firestore Emulator**: http://127.0.0.1:4001/firestore
- **Database Emulator**: http://127.0.0.1:4001/database
- **Functions Emulator**: http://127.0.0.1:4001/functions
- **Storage Emulator**: http://127.0.0.1:4001/storage
- **Extensions**: http://127.0.0.1:4001/extensions
- **Hosted App**: http://127.0.0.1:5013

---

## 📚 Documentation References

- **Firebase Emulator Suite**: https://firebase.google.com/docs/emulator-suite
- **Realtime Database Rules**: https://firebase.google.com/docs/database/security
- **Firebase Extensions**: https://firebase.google.com/products/extensions
- **Cloud Scheduler**: https://firebase.google.com/docs/functions/schedule-functions
- **Project Documentation**: `docs/02-Architecture/firebase-full-stack-integration.md`

---

**Generated**: 2025-10-31  
**Process PID**: 2870748  
**Log File**: `logs/emulators-full.log`

**Status**: 🎉 All Firebase emulators are running successfully in background mode!
