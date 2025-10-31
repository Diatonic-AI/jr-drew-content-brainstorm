# Firebase Migration Log

## 2025-10-31: Time Tracking Infrastructure

### Collections Added
- `timeEntries/{entryId}` – Time tracking entries with user isolation
- `savedViews/{viewId}` – Persisted filters/layout preferences
- `activity/{activityId}` – Immutable activity/audit log records

### Indexes Added
- Validated composite indexes for tasks, projects, timeEntries, savedViews, and activity (11 total) via `firebase deploy --only firestore:indexes`

### Security Rules Updated
- Added explicit guards for `timeEntries`, `savedViews`, and `activity`
- Introduced helper auth utilities for admin/owner checks
- Exercised rules through `infra/firebase/tests/firestoreRules.emulator.test.mjs`

### Functions Deployed
- `startTimeEntry` – Launches a new timer after validation
- `stopTimeEntry` – Stops active timers and records duration
- `getTimeEntries` – Retrieves paginated entries with filters

### Testing
- TypeScript build: `npm run build` (infra/firebase/functions)
- Emulator callable flow: `infra/firebase/tests/timeEntries.emulator.test.mjs`
- Security rule regression: `infra/firebase/tests/firestoreRules.emulator.test.mjs`

### Deployment
- Firestore indexes, rules, and functions deployed to `jrpm-dev` on 2025-10-31

### Breaking Changes
- None – additive backend capabilities only

### Rollback Plan
1. Remove new Cloud Functions: `firebase functions:delete startTimeEntry stopTimeEntry getTimeEntries --project jrpm-dev`
2. Revert Firestore rules: restore previous commit and run `firebase deploy --only firestore:rules`
3. Revert index file to prior revision and deploy indexes if required
