import { onCall, HttpsError } from 'firebase-functions/v2/https';

import { getDb } from '../lib/firebase.js';
import { ProjectExportParams } from '../validators/project.js';

/**
 * Callable Function: Export Project Data
 * 
 * Exports complete project data including tasks, sprints, and columns.
 * This is a callable function that automatically handles authentication via Firebase Auth.
 * 
 * Client Usage:
 * ```typescript
 * const exportProject = httpsCallable(functions, 'httpExportProject');
 * const result = await exportProject({ orgId: 'org123', projectId: 'proj456' });
 * ```
 * 
 * @param request.data - Contains orgId and projectId
 * @param request.auth - Automatically provided by Firebase Auth (user must be signed in)
 * @returns Project data with all subcollections
 */
export const httpExportProject = onCall(
  { region: 'us-central1' },
  async (request) => {
    // Authentication is automatically handled by onCall
    // request.auth is populated if user is signed in, null otherwise
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required');
    }

    // Validate input parameters
    const parsed = ProjectExportParams.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid parameters',
        parsed.error.flatten()
      );
    }

    const { orgId, projectId } = parsed.data;
    const db = getDb();
    const projectRef = db.doc(`orgs/${orgId}/projects/${projectId}`);

    // Fetch all project data in parallel
    const [projectSnap, tasksSnap, sprintsSnap, columnsSnap] = await Promise.all([
      projectRef.get(),
      projectRef.collection('tasks').get(),
      projectRef.collection('sprints').get(),
      projectRef.collection('columns').get(),
    ]);

    // Return data directly (onCall handles JSON serialization)
    return {
      project: projectSnap.data() || null,
      tasks: tasksSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      sprints: sprintsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      columns: columnsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    };
  }
);
