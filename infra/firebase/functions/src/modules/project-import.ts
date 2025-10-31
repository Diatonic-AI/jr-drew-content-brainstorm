import { onCall, HttpsError } from 'firebase-functions/v2/https';

import { getDb } from '../lib/firebase.js';
import { ProjectImportRequest } from '../validators/project.js';

/**
 * Callable Function: Import Project Data
 * 
 * Imports project data including tasks, sprints, and columns.
 * This is a callable function that automatically handles authentication via Firebase Auth.
 * Uses batched writes for atomicity (all-or-nothing operation).
 * 
 * Client Usage:
 * ```typescript
 * const importProject = httpsCallable(functions, 'httpImportProject');
 * const result = await importProject({
 *   orgId: 'org123',
 *   projectId: 'proj456',
 *   payload: { project: {...}, tasks: [...], sprints: [...], columns: [...] }
 * });
 * ```
 * 
 * Note: Firestore batch operations are limited to 500 writes per batch.
 * Large imports should be chunked on the client side.
 * 
 * @param request.data - Contains orgId, projectId, and payload with project data
 * @param request.auth - Automatically provided by Firebase Auth (user must be signed in)
 * @returns Success status
 */
export const httpImportProject = onCall(
  { region: 'us-central1' },
  async (request) => {
    // Authentication is automatically handled by onCall
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required');
    }

    // Validate input parameters
    const parsed = ProjectImportRequest.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid parameters',
        parsed.error.flatten()
      );
    }

    const { orgId, projectId, payload } = parsed.data;
    const db = getDb();
    const projectRef = db.doc(`orgs/${orgId}/projects/${projectId}`);
    
    // Calculate total operations to check batch limit
    const totalOps = 
      (payload.project ? 1 : 0) +
      payload.tasks.length +
      payload.sprints.length +
      payload.columns.length;
    
    if (totalOps > 500) {
      throw new HttpsError(
        'invalid-argument',
        `Import too large: ${totalOps} operations exceeds Firestore batch limit of 500. Please chunk your import on the client side.`
      );
    }
    
    const batch = db.batch();
    
    // Import project document
    if (payload.project) {
      const entity = payload.project as Record<string, unknown> & { id?: string; projectId?: string };
      batch.set(
        projectRef,
        { ...entity, projectId: entity.projectId ?? projectId },
        { merge: true }
      );
    }
    
    // Helper to generate new document IDs
    const newDocId = () => db.collection('_').doc().id;
    
    // Import tasks
    payload.tasks.forEach((task) => {
      const entity = task as Record<string, unknown> & { id?: string; taskId?: string };
      const id = entity.id ?? entity.taskId ?? newDocId();
      batch.set(projectRef.collection('tasks').doc(id), entity, { merge: true });
    });
    
    // Import sprints
    payload.sprints.forEach((sprint) => {
      const entity = sprint as Record<string, unknown> & { id?: string };
      const id = entity.id ?? newDocId();
      batch.set(projectRef.collection('sprints').doc(id), entity, { merge: true });
    });
    
    // Import columns
    payload.columns.forEach((column) => {
      const entity = column as Record<string, unknown> & { id?: string };
      const id = entity.id ?? newDocId();
      batch.set(projectRef.collection('columns').doc(id), entity, { merge: true });
    });
    
    // Commit all writes atomically
    await batch.commit();
    
    return { ok: true, imported: totalOps };
  }
);
