import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();

export const scheduleDueSoon = onSchedule(
  { schedule: 'every 60 minutes', timeZone: 'Etc/UTC', region: 'us-central1' },
  async () => {
    const db = getFirestore();
    const now = new Date();
    const threshold = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const snap = await db.collectionGroup('tasks')
      .where('dueDate', '<=', threshold)
      .where('status', 'in', ['todo', 'in-progress'])
      .get();
    const batch = db.batch();
    snap.forEach(doc => batch.set(doc.ref, { dueSoon: true }, { merge: true }));
    await batch.commit();
  }
);
