import { onSchedule } from 'firebase-functions/v2/scheduler';

import { getDb } from '../lib/firebase.js';

/**
 * Scheduled Function: Flag Tasks Due Soon
 * 
 * Runs every 60 minutes to identify tasks that are due within the next 24 hours
 * and marks them with a `dueSoon: true` flag for frontend notifications.
 * 
 * Note: This function requires the Cloud Scheduler API and billing to be enabled.
 * It uses collection group queries which require composite indexes.
 */
export const scheduleDueSoon = onSchedule(
  { schedule: 'every 60 minutes', timeZone: 'Etc/UTC', region: 'us-central1' },
  async () => {
    const db = getDb();
    const now = new Date();
    const threshold = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    
    // Query all tasks across all orgs/projects that are due soon
    const snap = await db.collectionGroup('tasks')
      .where('dueDate', '<=', threshold)
      .where('status', 'in', ['todo', 'in-progress'])
      .get();
    
    // Batch update to set dueSoon flag
    // Note: Firestore batch limit is 500 operations
    const batch = db.batch();
    snap.forEach(doc => batch.set(doc.ref, { dueSoon: true }, { merge: true }));
    await batch.commit();
  }
);
