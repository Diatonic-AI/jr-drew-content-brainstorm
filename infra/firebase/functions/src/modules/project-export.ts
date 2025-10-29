import { onRequest, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { ProjectExportParams } from '../validators/project.js';

initializeApp();

export const httpExportProject = onRequest({ region: 'us-central1', cors: true }, async (req, res) => {
  const auth = (req as { auth?: { uid: string } }).auth;
  if (!auth) throw new HttpsError('unauthenticated', 'Sign in required');
  const parsed = ProjectExportParams.safeParse(req.query);
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
