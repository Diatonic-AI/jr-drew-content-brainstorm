import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();

export const onTaskWrite = onDocumentWritten(
  { document: 'orgs/{orgId}/projects/{projectId}/tasks/{taskId}', region: 'us-central1' },
  async (event) => {
    const after = event.data?.after?.data();
    const before = event.data?.before?.data();
    if (!after) return;
    const db = getFirestore();
    const { orgId, projectId, taskId } = event.params as Record<string, string>;
    const normalized = {
      ...after,
      status: (after.status || 'todo').toLowerCase(),
      updatedAt: new Date().toISOString()
    };
    await db.doc(`orgs/${orgId}/projects/${projectId}/tasks/${taskId}`).set(normalized, { merge: true });
    await db.collection('activity').add({
      type: 'task.write', orgId, projectId, taskId,
      at: new Date().toISOString(), diff: { before, after }
    });
  }
);
