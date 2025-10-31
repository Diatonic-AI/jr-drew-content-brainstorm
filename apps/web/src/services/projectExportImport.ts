/**
 * Project Export/Import Service
 * 
 * Provides functions for exporting and importing project data via Firebase callable functions.
 * These functions automatically handle authentication via the Firebase SDK.
 */

import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { functions } from '@/lib/firebase/client';

// ============================================================================
// Types
// ============================================================================

export interface Project {
  id?: string;
  projectId?: string;
  orgId: string;
  name: string;
  description?: string;
  status?: 'draft' | 'active' | 'on-hold' | 'complete';
  leadId?: string | null;
  sprintCadence?: 'weekly' | 'biweekly' | 'monthly';
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id?: string;
  taskId?: string;
  orgId: string;
  projectId: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'blocked' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string | null;
  dueDate?: string | null;
  dueSoon?: boolean;
  labels?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Sprint {
  id?: string;
  projectId: string;
  orgId: string;
  name: string;
  cadence?: 'weekly' | 'biweekly' | 'monthly';
  startAt: string;
  endAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Column {
  id?: string;
  projectId: string;
  orgId: string;
  title: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface ExportProjectParams {
  orgId: string;
  projectId: string;
}

export interface ExportProjectResult {
  project: Project | null;
  tasks: Task[];
  sprints: Sprint[];
  columns: Column[];
}

export interface ImportPayload {
  project?: Partial<Project>;
  tasks?: Partial<Task>[];
  sprints?: Partial<Sprint>[];
  columns?: Partial<Column>[];
}

export interface ImportProjectParams {
  orgId: string;
  projectId: string;
  payload: ImportPayload;
}

export interface ImportProjectResult {
  ok: boolean;
  imported: number;
}

// ============================================================================
// Error Handling
// ============================================================================

export class ProjectServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ProjectServiceError';
  }
}

function handleFunctionError(error: any): never {
  // Firebase callable functions throw structured errors
  const code = error.code || 'unknown';
  const message = error.message || 'An unexpected error occurred';
  const details = error.details;

  switch (code) {
    case 'unauthenticated':
      throw new ProjectServiceError(
        'You must be signed in to perform this action',
        code,
        details
      );
    
    case 'permission-denied':
      throw new ProjectServiceError(
        'You don\'t have permission to perform this action',
        code,
        details
      );
    
    case 'invalid-argument':
      throw new ProjectServiceError(
        'Invalid data provided',
        code,
        details
      );
    
    case 'deadline-exceeded':
      throw new ProjectServiceError(
        'Request timed out, please try again',
        code,
        details
      );
    
    case 'not-found':
      throw new ProjectServiceError(
        'Project not found',
        code,
        details
      );
    
    case 'resource-exhausted':
      throw new ProjectServiceError(
        'Too many requests, please try again later',
        code,
        details
      );
    
    default:
      throw new ProjectServiceError(message, code, details);
  }
}

// ============================================================================
// Export Functions
// ============================================================================

/**
 * Export complete project data including tasks, sprints, and columns
 * 
 * @param orgId - Organization ID
 * @param projectId - Project ID
 * @returns Project data with all subcollections
 * @throws {ProjectServiceError} If export fails or user is not authenticated
 * 
 * @example
 * ```typescript
 * const data = await exportProject('org123', 'proj456');
 * console.log(`Exported ${data.tasks.length} tasks`);
 * ```
 */
export async function exportProject(
  orgId: string,
  projectId: string
): Promise<ExportProjectResult> {
  try {
    const exportProjectFn = httpsCallable<ExportProjectParams, ExportProjectResult>(
      functions,
      'httpExportProject'
    );
    
    const result: HttpsCallableResult<ExportProjectResult> = await exportProjectFn({
      orgId,
      projectId
    });
    
    return result.data;
  } catch (error: any) {
    handleFunctionError(error);
  }
}

/**
 * Export project data as downloadable JSON file
 * 
 * @param orgId - Organization ID
 * @param projectId - Project ID
 * @param filename - Optional filename for download (defaults to project-{projectId}.json)
 * @throws {ProjectServiceError} If export fails
 * 
 * @example
 * ```typescript
 * await exportProjectAsJSON('org123', 'proj456', 'my-project-backup.json');
 * ```
 */
export async function exportProjectAsJSON(
  orgId: string,
  projectId: string,
  filename?: string
): Promise<void> {
  const data = await exportProject(orgId, projectId);
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `project-${projectId}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// Import Functions
// ============================================================================

/**
 * Validate import payload before sending to server
 * 
 * @param payload - Import payload to validate
 * @throws {ProjectServiceError} If payload is invalid
 */
function validateImportPayload(payload: ImportPayload): void {
  const totalOps = 
    (payload.project ? 1 : 0) +
    (payload.tasks?.length || 0) +
    (payload.sprints?.length || 0) +
    (payload.columns?.length || 0);
  
  if (totalOps === 0) {
    throw new ProjectServiceError(
      'Import payload is empty - please provide at least one item to import',
      'invalid-argument'
    );
  }
  
  if (totalOps > 500) {
    throw new ProjectServiceError(
      `Import too large: ${totalOps} operations exceeds the 500 operation limit. ` +
      'Please split your import into smaller chunks.',
      'invalid-argument'
    );
  }
}

/**
 * Import project data with validation
 * 
 * Note: Firestore batch operations are limited to 500 writes per batch.
 * Large imports should be chunked on the client side.
 * 
 * @param orgId - Organization ID
 * @param projectId - Project ID
 * @param payload - Data to import
 * @returns Import result with operation count
 * @throws {ProjectServiceError} If import fails or payload is invalid
 * 
 * @example
 * ```typescript
 * const result = await importProject('org123', 'proj456', {
 *   project: { name: 'My Project' },
 *   tasks: [{ title: 'Task 1', status: 'todo' }],
 *   sprints: [],
 *   columns: []
 * });
 * console.log(`Imported ${result.imported} items`);
 * ```
 */
export async function importProject(
  orgId: string,
  projectId: string,
  payload: ImportPayload
): Promise<ImportProjectResult> {
  // Client-side validation
  validateImportPayload(payload);
  
  try {
    const importProjectFn = httpsCallable<ImportProjectParams, ImportProjectResult>(
      functions,
      'httpImportProject'
    );
    
    const result: HttpsCallableResult<ImportProjectResult> = await importProjectFn({
      orgId,
      projectId,
      payload
    });
    
    return result.data;
  } catch (error: any) {
    handleFunctionError(error);
  }
}

/**
 * Import project data from JSON file
 * 
 * @param orgId - Organization ID
 * @param projectId - Project ID
 * @param file - JSON file to import
 * @returns Import result
 * @throws {ProjectServiceError} If import fails or file is invalid
 * 
 * @example
 * ```typescript
 * const fileInput = document.querySelector('input[type="file"]');
 * const file = fileInput.files[0];
 * const result = await importProjectFromJSON('org123', 'proj456', file);
 * ```
 */
export async function importProjectFromJSON(
  orgId: string,
  projectId: string,
  file: File
): Promise<ImportProjectResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const json = e.target?.result as string;
        const payload = JSON.parse(json) as ImportPayload;
        
        const result = await importProject(orgId, projectId, payload);
        resolve(result);
      } catch (error: any) {
        if (error instanceof SyntaxError) {
          reject(new ProjectServiceError(
            'Invalid JSON file format',
            'invalid-argument'
          ));
        } else {
          reject(error);
        }
      }
    };
    
    reader.onerror = () => {
      reject(new ProjectServiceError(
        'Failed to read file',
        'invalid-argument'
      ));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Chunk large import payloads to stay within Firestore batch limits
 * 
 * @param payload - Large import payload
 * @param chunkSize - Maximum operations per chunk (default: 450 to leave buffer)
 * @returns Array of chunked payloads
 * 
 * @example
 * ```typescript
 * const chunks = chunkImportPayload(largePayload, 450);
 * for (const chunk of chunks) {
 *   await importProject(orgId, projectId, chunk);
 * }
 * ```
 */
export function chunkImportPayload(
  payload: ImportPayload,
  chunkSize: number = 450
): ImportPayload[] {
  const chunks: ImportPayload[] = [];
  
  // First chunk always includes the project document
  let currentChunk: ImportPayload = {
    project: payload.project,
    tasks: [],
    sprints: [],
    columns: []
  };
  let currentCount = payload.project ? 1 : 0;
  
  // Helper to finalize current chunk and start new one
  const finalizeChunk = () => {
    if (currentCount > 0) {
      chunks.push(currentChunk);
      currentChunk = {
        tasks: [],
        sprints: [],
        columns: []
      };
      currentCount = 0;
    }
  };
  
  // Add tasks
  for (const task of payload.tasks || []) {
    if (currentCount >= chunkSize) {
      finalizeChunk();
    }
    currentChunk.tasks!.push(task);
    currentCount++;
  }
  
  // Add sprints
  for (const sprint of payload.sprints || []) {
    if (currentCount >= chunkSize) {
      finalizeChunk();
    }
    currentChunk.sprints!.push(sprint);
    currentCount++;
  }
  
  // Add columns
  for (const column of payload.columns || []) {
    if (currentCount >= chunkSize) {
      finalizeChunk();
    }
    currentChunk.columns!.push(column);
    currentCount++;
  }
  
  // Finalize last chunk
  finalizeChunk();
  
  return chunks;
}
