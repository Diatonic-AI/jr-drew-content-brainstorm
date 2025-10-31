import { onDocumentWritten } from 'firebase-functions/v2/firestore';

import { getDb } from '../lib/firebase.js';

/**
 * Task Write Trigger
 * 
 * Normalizes task data and logs activity when tasks are created or updated.
 * 
 * Normalization includes:
 * - Ensuring status is lowercase ('todo', 'in-progress', 'blocked', 'done')
 * - Setting/updating the updatedAt timestamp
 * 
 * Activity Logging:
 * The `/activity` collection is intentionally server-write-only for security.
 * Firestore rules deny client access to prevent tampering with audit logs.
 * 
 * @TODO Consider migrating activity logs to `/orgs/{orgId}/activity` for better
 * multi-tenancy consistency and to align with other org-scoped collections.
 */
export const onTaskWrite = onDocumentWritten(
  { document: 'orgs/{orgId}/projects/{projectId}/tasks/{taskId}', region: 'us-central1' },
  async (event) => {
    const after = event.data?.after?.data();
    const before = event.data?.before?.data();
    
    // Delete event - only log activity, no normalization needed
    if (!after) {
      const db = getDb();
      const { orgId, projectId, taskId } = event.params as Record<string, string>;
      await db.collection('activity').add({
        type: 'task.delete',
        orgId,
        projectId,
        taskId,
        at: new Date().toISOString(),
        before
      });
      return;
    }
    
    const db = getDb();
    const { orgId, projectId, taskId } = event.params as Record<string, string>;
    const now = new Date().toISOString();
    
    // Normalize task data
    const normalized = {
      ...after,
      status: (after.status || 'todo').toLowerCase(),
      updatedAt: now
    };
    
    // Recursion Prevention:
    // Only write back to Firestore if normalization actually changed the data.
    // This prevents infinite trigger loops where our write triggers another event.
    const needsUpdate = 
      (after.status && after.status !== normalized.status) ||
      after.updatedAt !== normalized.updatedAt;
    
    if (needsUpdate) {
      await db.doc(`orgs/${orgId}/projects/${projectId}/tasks/${taskId}`)
        .set(normalized, { merge: true });
    }
    
    // Log activity for all write operations (create/update)
    // This collection is server-only and not accessible to clients via security rules
    await db.collection('activity').add({
      type: before ? 'task.update' : 'task.create',
      orgId,
      projectId,
      taskId,
      at: now,
      diff: { before, after: normalized }
    });
  }
);
