# Firebase Functions Monitoring Checklist
**Date:** October 31, 2025, 16:40 UTC  
**Next scheduleDueSoon Run:** 17:02 UTC (22 minutes)

---

## ✅ Step 1: Monitor scheduleDueSoon Function

### Current Status
- ✅ Index deployed and active
- ✅ Function redeployed successfully
- ⏳ Waiting for next hourly execution at **17:02 UTC**

### Index Verification
```json
{
  "collectionGroup": "tasks",
  "queryScope": "COLLECTION_GROUP",
  "fields": [
    {"fieldPath": "status", "order": "ASCENDING"},
    {"fieldPath": "dueDate", "order": "ASCENDING"},
    {"fieldPath": "__name__", "order": "ASCENDING"}
  ],
  "density": "SPARSE_ALL"
}
```
**Status:** ✅ DEPLOYED AND ACTIVE

### Monitoring Commands

```bash
# Check logs at 17:03 UTC (after execution)
firebase functions:log --only scheduleDueSoon --project jrpm-dev -n 10

# Real-time monitoring (run this at 17:01 UTC)
watch -n 5 'firebase functions:log --only scheduleDueSoon --project jrpm-dev -n 3'
```

### Expected Success Indicators
- ✅ No "FAILED_PRECONDITION" error
- ✅ No "The query requires an index" message
- ✅ Function completes without errors
- ✅ Log shows task updates if any tasks are due soon

### If Error Occurs
1. Check if index is still active: `firebase firestore:indexes --project jrpm-dev`
2. Verify function code hasn't changed
3. Check Firestore console for index status
4. Review function logs for new error patterns

---

## 📋 Step 2: Test Time Tracking Functions

### Functions to Test

#### 2.1 startTimeEntry
**Endpoint:** `https://us-central1-jrpm-dev.cloudfunctions.net/startTimeEntry`

**Test from Frontend:**
```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const startTimeEntry = httpsCallable(functions, 'startTimeEntry');

// Test 1: Start basic timer
try {
  const result = await startTimeEntry({
    // No parameters = start now
  });
  console.log('✅ Timer started:', result.data);
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 2: Start with project/task
try {
  const result = await startTimeEntry({
    projectId: 'test-project-id',
    taskId: 'test-task-id',
    notes: 'Working on feature X',
    tags: ['development', 'frontend'],
    billable: true
  });
  console.log('✅ Timer started with context:', result.data);
} catch (error) {
  console.error('❌ Error:', error);
}
```

**Expected Response:**
```json
{
  "id": "generated-id",
  "userId": "user-id",
  "projectId": "test-project-id",
  "taskId": "test-task-id",
  "start": "2025-10-31T16:40:00.000Z",
  "end": null,
  "duration": null,
  "notes": "Working on feature X",
  "tags": ["development", "frontend"],
  "billable": true,
  "createdAt": "2025-10-31T16:40:00.000Z",
  "updatedAt": "2025-10-31T16:40:00.000Z"
}
```

**Validation Checks:**
- ✅ Returns valid time entry object
- ✅ `start` timestamp is set
- ✅ `end` is null (active timer)
- ✅ `duration` is null (not stopped yet)
- ✅ Activity log created in Firestore
- ✅ Error if another timer is already running

---

#### 2.2 stopTimeEntry
**Endpoint:** `https://us-central1-jrpm-dev.cloudfunctions.net/stopTimeEntry`

**Test from Frontend:**
```typescript
const stopTimeEntry = httpsCallable(functions, 'stopTimeEntry');

// Test 1: Stop with automatic end time
try {
  const result = await stopTimeEntry({
    entryId: 'entry-id-from-start',
  });
  console.log('✅ Timer stopped:', result.data);
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 2: Stop with custom end time and notes
try {
  const result = await stopTimeEntry({
    entryId: 'entry-id-from-start',
    end: new Date().toISOString(),
    notes: 'Completed feature implementation',
    tags: ['completed', 'tested'],
    billable: true
  });
  console.log('✅ Timer stopped with updates:', result.data);
} catch (error) {
  console.error('❌ Error:', error);
}
```

**Expected Response:**
```json
{
  "id": "entry-id",
  "userId": "user-id",
  "start": "2025-10-31T16:40:00.000Z",
  "end": "2025-10-31T17:00:00.000Z",
  "duration": 1200,
  "notes": "Completed feature implementation",
  "tags": ["completed", "tested"],
  "billable": true,
  "updatedAt": "2025-10-31T17:00:00.000Z"
}
```

**Validation Checks:**
- ✅ `end` timestamp is set
- ✅ `duration` is calculated in seconds
- ✅ Duration matches time difference (end - start)
- ✅ Notes and tags are updated
- ✅ Activity log created
- ✅ Error if entry doesn't exist
- ✅ Error if trying to stop another user's entry
- ✅ Error if entry already stopped

---

#### 2.3 getTimeEntries
**Endpoint:** `https://us-central1-jrpm-dev.cloudfunctions.net/getTimeEntries`

**Test from Frontend:**
```typescript
const getTimeEntries = httpsCallable(functions, 'getTimeEntries');

// Test 1: Get all entries (default)
try {
  const result = await getTimeEntries({});
  console.log('✅ Entries retrieved:', result.data.entries.length);
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 2: Get entries with filters
try {
  const result = await getTimeEntries({
    startDate: '2025-10-01T00:00:00.000Z',
    endDate: '2025-10-31T23:59:59.999Z',
    projectId: 'test-project-id',
    limit: 50
  });
  console.log('✅ Filtered entries:', result.data.entries);
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 3: Get entries for specific task
try {
  const result = await getTimeEntries({
    taskId: 'test-task-id',
    limit: 10
  });
  console.log('✅ Task entries:', result.data.entries);
} catch (error) {
  console.error('❌ Error:', error);
}
```

**Expected Response:**
```json
{
  "entries": [
    {
      "id": "entry-1",
      "userId": "user-id",
      "start": "2025-10-31T16:00:00.000Z",
      "end": "2025-10-31T17:00:00.000Z",
      "duration": 3600,
      "notes": "...",
      "tags": ["..."],
      "billable": true
    }
  ]
}
```

**Validation Checks:**
- ✅ Returns array of time entries
- ✅ Entries sorted by start time (descending)
- ✅ Filters work correctly (date range, projectId, taskId)
- ✅ Limit parameter respected (default 100, max 500)
- ✅ Only returns current user's entries
- ✅ All timestamps in ISO 8601 format

---

## 📧 Step 3: Verify Email Verification Flow

### Functions Involved
1. **sendVerificationEmail** - Sends code via Resend
2. **verifyEmailCode** - Validates the code

### 3.1 Test sendVerificationEmail

**Prerequisites:**
- ✅ RESEND_API_KEY configured in Secret Manager
- ✅ Resend account active
- ✅ Valid sending domain configured

**Test from Frontend:**
```typescript
const sendVerificationEmail = httpsCallable(functions, 'sendVerificationEmail');

try {
  const result = await sendVerificationEmail({
    email: 'test@example.com',
    name: 'Test User'
  });
  console.log('✅ Email sent:', result.data);
} catch (error) {
  console.error('❌ Error:', error);
}
```

**Validation Checks:**
- ✅ Function executes without errors
- ✅ Email received in inbox (check spam folder)
- ✅ Email contains 6-digit verification code
- ✅ Email template renders correctly
- ✅ Code stored in Firestore (verification codes collection)
- ✅ Code has expiration timestamp (e.g., 15 minutes)

**Manual Verification:**
```bash
# Check function logs
firebase functions:log --only sendVerificationEmail --project jrpm-dev -n 10

# Expected log entries:
# - Function invocation
# - Resend API call success
# - Code generation and storage
```

---

### 3.2 Test verifyEmailCode

**Test from Frontend:**
```typescript
const verifyEmailCode = httpsCallable(functions, 'verifyEmailCode');

// Test 1: Valid code
try {
  const result = await verifyEmailCode({
    email: 'test@example.com',
    code: '123456' // Use code from email
  });
  console.log('✅ Code verified:', result.data);
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 2: Invalid code
try {
  const result = await verifyEmailCode({
    email: 'test@example.com',
    code: '000000' // Wrong code
  });
} catch (error) {
  console.log('✅ Correctly rejected invalid code');
}

// Test 3: Expired code
// (Wait until code expires, then test)
```

**Validation Checks:**
- ✅ Valid code returns success
- ✅ Invalid code throws error
- ✅ Expired code throws error
- ✅ Used code cannot be reused
- ✅ Code is deleted after successful verification
- ✅ Rate limiting prevents brute force

---

## 📊 Success Criteria Summary

### Overall Health Check
- [ ] scheduleDueSoon executes without index errors
- [ ] startTimeEntry creates time entries successfully
- [ ] stopTimeEntry calculates duration correctly
- [ ] getTimeEntries returns filtered results
- [ ] sendVerificationEmail delivers emails
- [ ] verifyEmailCode validates codes correctly

### Firestore Validation
```bash
# Check if time entries are being created
firebase firestore:get timeEntries --project jrpm-dev --limit 5

# Check if activity logs are being created
firebase firestore:get activity --project jrpm-dev --limit 5

# Check if verification codes are being stored
firebase firestore:get verificationCodes --project jrpm-dev --limit 5
```

### Function Logs Check
```bash
# All functions logs (last 50 entries)
firebase functions:log --project jrpm-dev -n 50

# Filter for errors only
firebase functions:log --project jrpm-dev -n 100 | grep -i error
```

---

## 🔧 Troubleshooting

### If scheduleDueSoon Still Fails
1. **Verify index is actually built:**
   - Go to: https://console.firebase.google.com/project/jrpm-dev/firestore/indexes
   - Status should be "Enabled", not "Building" or "Error"

2. **Check query in function code:**
   ```bash
   cat infra/firebase/functions/src/modules/scheduler.ts | grep -A 5 "collectionGroup"
   ```

3. **Try triggering manually:**
   ```bash
   # This isn't directly possible for scheduled functions,
   # but you can test the query in Firestore console
   ```

### If Time Tracking Functions Fail
1. **Check authentication:**
   - Ensure Firebase Auth token is being passed
   - Verify user is logged in

2. **Check Firestore security rules:**
   - Rules allow timeEntries reads/writes for authenticated users
   - Check: `infra/firebase/firestore.rules`

3. **Verify indexes for time entries queries:**
   ```bash
   firebase firestore:indexes --project jrpm-dev | grep timeEntries
   ```

### If Email Verification Fails
1. **Check Secret Manager:**
   ```bash
   # Verify secret exists
   gcloud secrets describe RESEND_API_KEY --project=jrpm-dev
   ```

2. **Check Resend dashboard:**
   - Login to Resend
   - Check API key is active
   - Verify sending domain is verified

3. **Test Resend API directly:**
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "noreply@yourdomain.com",
       "to": "test@example.com",
       "subject": "Test",
       "text": "Test email"
     }'
   ```

---

## 📅 Monitoring Schedule

### Immediate (Next 30 minutes)
- ⏰ **17:02 UTC**: Check scheduleDueSoon execution
- ⏰ **17:05 UTC**: Verify no errors in logs

### Short-term (Next 24 hours)
- Test time tracking functions from frontend
- Verify email verification flow end-to-end
- Monitor for any unexpected errors

### Ongoing
- Daily log review for errors
- Weekly function performance check
- Monthly security audit

---

**Status:** 🟢 All systems ready for monitoring  
**Next Action:** Wait for 17:02 UTC and check scheduleDueSoon logs
