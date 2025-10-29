import { onRequest, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { ProjectImportRequest } from '../validators/project.js';

initializeApp();

export const httpImportProject = onRequest({ region: 'us-central1', cors: true }, async (req, res) => {
  const auth = (req as { auth?: { uid: string } }).auth;
  if (!auth) throw new HttpsError('unauthenticated', 'Sign in required');
  const parsed = ProjectImportRequest.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId, projectId, payload } = parsed.data;
  const db = getFirestore();
  const projectRef = db.doc(`orgs/${orgId}/projects/${projectId}`);
  const batch = db.batch();
  if (payload.project) {
    const entity = payload.project as Record<string, unknown> & { id?: string; projectId?: string };
    batch.set(projectRef, { ...entity, projectId: entity.projectId ?? projectId }, { merge: true });
  }
  const newDocId = () => db.collection('_').doc().id;
  payload.tasks.forEach((task) => {
    const entity = task as Record<string, unknown> & { id?: string; taskId?: string };
    const id = entity.id ?? entity.taskId ?? newDocId();
    batch.set(projectRef.collection('tasks').doc(id), entity, { merge: true });
  });
  payload.sprints.forEach((sprint) => {
    const entity = sprint as Record<string, unknown> & { id?: string };
    const id = entity.id ?? newDocId();
    batch.set(projectRef.collection('sprints').doc(id), entity, { merge: true });
  });
  payload.columns.forEach((column) => {
    const entity = column as Record<string, unknown> & { id?: string };
    const id = entity.id ?? newDocId();
    batch.set(projectRef.collection('columns').doc(id), entity, { merge: true });
  });
  await batch.commit();
  res.json({ ok: true });
});
