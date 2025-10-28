import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest, HttpsError } from 'firebase-functions/v2/https';
import { z } from 'zod';

initializeApp();

export const onTaskWrite = onDocumentWritten(
  { document: 'orgs/{orgId}/projects/{projectId}/tasks/{taskId}', region: 'us-central1' },
  async (event) => {
    const after = event.data?.after?.data();
    const before = event.data?.before?.data();
    const db = getFirestore();
    const orgId = event.params.orgId as string;
    const projectId = event.params.projectId as string;
    const taskId = event.params.taskId as string;
    if (!after) return;

    const normalized = {
      ...after,
      status: (after.status || 'todo').toLowerCase(),
      updatedAt: new Date().toISOString()
    };
    await db.doc(`orgs/${orgId}/projects/${projectId}/tasks/${taskId}`).set(normalized, { merge: true });

    await db.collection('activity').add({
      type: 'task.write',
      orgId, projectId, taskId,
      at: new Date().toISOString(),
      diff: { before, after }
    });
  }
);

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
    snap.forEach(doc => {
      batch.set(doc.ref, { dueSoon: true }, { merge: true });
    });
    await batch.commit();
  }
);

const exportSchema = z.object({ orgId: z.string(), projectId: z.string() });

export const httpExportProject = onRequest({ region: 'us-central1', cors: true }, async (req, res) => {
  const auth = req.auth;
  if (!auth) throw new HttpsError('unauthenticated', 'Sign in required');
  const parsed = exportSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId, projectId } = parsed.data;
  const db = getFirestore();
  const projectRef = db.doc(`orgs/${orgId}/projects/${projectId}`);
  const [projectSnap, tasksSnap, sprintsSnap, columnsSnap] = await Promise.all([
    projectRef.get(),
    projectRef.collection('tasks').get(),
    projectRef.collection('sprints').get(),
    projectRef.collection('columns').get(),
  ]);
  res.json({
    project: projectSnap.data() || null,
    tasks: tasksSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    sprints: sprintsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    columns: columnsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
  });
});

const importSchema = z.object({
  orgId: z.string(),
  projectId: z.string(),
  payload: z.object({
    project: z.record(z.any()).optional(),
    tasks: z.array(z.record(z.any())).default([]),
    sprints: z.array(z.record(z.any())).default([]),
    columns: z.array(z.record(z.any())).default([]),
  })
});

export const httpImportProject = onRequest({ region: 'us-central1', cors: true }, async (req, res) => {
  const auth = req.auth;
  if (!auth) throw new HttpsError('unauthenticated', 'Sign in required');
  const parsed = importSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId, projectId, payload } = parsed.data;
  const db = getFirestore();
  const projectRef = db.doc(`orgs/${orgId}/projects/${projectId}`);
  const batch = db.batch();
  if (payload.project) batch.set(projectRef, payload.project, { merge: true });
  payload.tasks.forEach(t => batch.set(projectRef.collection('tasks').doc((t as any).id || db.collection('_').doc().id), t as any, { merge: true }));
  payload.sprints.forEach(s => batch.set(projectRef.collection('sprints').doc((s as any).id || db.collection('_').doc().id), s as any, { merge: true }));
  payload.columns.forEach(c => batch.set(projectRef.collection('columns').doc((c as any).id || db.collection('_').doc().id), c as any, { merge: true }));
  await batch.commit();
  res.json({ ok: true });
});