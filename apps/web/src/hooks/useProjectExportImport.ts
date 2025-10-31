/**
 * React Hooks for Project Export/Import
 * 
 * Provides React hooks integrated with TanStack Query for managing
 * project export and import operations with proper loading and error states.
 */

import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  exportProject,
  exportProjectAsJSON,
  importProject,
  importProjectFromJSON,
  chunkImportPayload,
  ExportProjectResult,
  ImportProjectResult,
  ImportPayload,
  ProjectServiceError
} from '@/services/projectExportImport';

// ============================================================================
// Export Hooks
// ============================================================================

/**
 * Hook for exporting project data
 * 
 * @param orgId - Organization ID
 * @param projectId - Project ID
 * @param options - TanStack Query options
 * @returns Query result with project data
 * 
 * @example
 * ```tsx
 * function ProjectExportButton({ orgId, projectId }: Props) {
 *   const { data, isLoading, error } = useExportProject(orgId, projectId);
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <div>
 *       <p>Project: {data?.project?.name}</p>
 *       <p>Tasks: {data?.tasks.length}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useExportProject(
  orgId: string,
  projectId: string,
  options?: Omit<
    UseQueryOptions<ExportProjectResult, ProjectServiceError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ExportProjectResult, ProjectServiceError>({
    queryKey: ['project-export', orgId, projectId],
    queryFn: () => exportProject(orgId, projectId),
    enabled: !!orgId && !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options
  });
}

/**
 * Hook for exporting project data as downloadable JSON
 * 
 * @returns Mutation for triggering JSON export
 * 
 * @example
 * ```tsx
 * function ExportButton({ orgId, projectId }: Props) {
 *   const exportMutation = useExportProjectAsJSON();
 *   
 *   return (
 *     <button
 *       onClick={() => exportMutation.mutate({ orgId, projectId })}
 *       disabled={exportMutation.isPending}
 *     >
 *       {exportMutation.isPending ? 'Exporting...' : 'Export as JSON'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useExportProjectAsJSON() {
  return useMutation<
    void,
    ProjectServiceError,
    { orgId: string; projectId: string; filename?: string }
  >({
    mutationFn: ({ orgId, projectId, filename }) =>
      exportProjectAsJSON(orgId, projectId, filename),
    onSuccess: () => {
      console.log('Project exported successfully');
    },
    onError: (error) => {
      console.error('Export failed:', error.message);
    }
  });
}

// ============================================================================
// Import Hooks
// ============================================================================

/**
 * Hook for importing project data
 * 
 * @returns Mutation for importing project data
 * 
 * @example
 * ```tsx
 * function ImportButton({ orgId, projectId }: Props) {
 *   const importMutation = useImportProject();
 *   
 *   const handleImport = () => {
 *     const payload = {
 *       project: { name: 'New Project' },
 *       tasks: [{ title: 'Task 1', status: 'todo' }],
 *       sprints: [],
 *       columns: []
 *     };
 *     
 *     importMutation.mutate({ orgId, projectId, payload });
 *   };
 *   
 *   return (
 *     <div>
 *       <button onClick={handleImport} disabled={importMutation.isPending}>
 *         {importMutation.isPending ? 'Importing...' : 'Import Project'}
 *       </button>
 *       {importMutation.isSuccess && (
 *         <p>Imported {importMutation.data.imported} items</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useImportProject() {
  return useMutation<
    ImportProjectResult,
    ProjectServiceError,
    { orgId: string; projectId: string; payload: ImportPayload }
  >({
    mutationFn: ({ orgId, projectId, payload }) =>
      importProject(orgId, projectId, payload),
    onSuccess: (data) => {
      console.log(`Successfully imported ${data.imported} items`);
    },
    onError: (error) => {
      console.error('Import failed:', error.message);
    }
  });
}

/**
 * Hook for importing project data from JSON file
 * 
 * @returns Mutation for importing from JSON file
 * 
 * @example
 * ```tsx
 * function ImportFileButton({ orgId, projectId }: Props) {
 *   const importMutation = useImportProjectFromJSON();
 *   const fileInputRef = useRef<HTMLInputElement>(null);
 *   
 *   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0];
 *     if (file) {
 *       importMutation.mutate({ orgId, projectId, file });
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       <input
 *         ref={fileInputRef}
 *         type="file"
 *         accept=".json"
 *         onChange={handleFileSelect}
 *         style={{ display: 'none' }}
 *       />
 *       <button
 *         onClick={() => fileInputRef.current?.click()}
 *         disabled={importMutation.isPending}
 *       >
 *         {importMutation.isPending ? 'Importing...' : 'Import from JSON'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useImportProjectFromJSON() {
  return useMutation<
    ImportProjectResult,
    ProjectServiceError,
    { orgId: string; projectId: string; file: File }
  >({
    mutationFn: ({ orgId, projectId, file }) =>
      importProjectFromJSON(orgId, projectId, file),
    onSuccess: (data) => {
      console.log(`Successfully imported ${data.imported} items from file`);
    },
    onError: (error) => {
      console.error('File import failed:', error.message);
    }
  });
}

/**
 * Hook for importing large datasets with chunking
 * 
 * Automatically chunks the payload and imports in batches to avoid
 * exceeding Firestore batch limits (500 operations).
 * 
 * @returns Mutation for chunked import with progress tracking
 * 
 * @example
 * ```tsx
 * function LargeImportButton({ orgId, projectId, largePayload }: Props) {
 *   const importMutation = useChunkedImport();
 *   
 *   return (
 *     <div>
 *       <button
 *         onClick={() => importMutation.mutate({ orgId, projectId, payload: largePayload })}
 *         disabled={importMutation.isPending}
 *       >
 *         {importMutation.isPending ? 'Importing...' : 'Import Large Dataset'}
 *       </button>
 *       {importMutation.isPending && importMutation.data && (
 *         <p>
 *           Progress: {importMutation.data.completed} / {importMutation.data.total} chunks
 *         </p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useChunkedImport() {
  return useMutation<
    { total: number; completed: number; imported: number },
    ProjectServiceError,
    { orgId: string; projectId: string; payload: ImportPayload; chunkSize?: number }
  >({
    mutationFn: async ({ orgId, projectId, payload, chunkSize = 450 }) => {
      const chunks = chunkImportPayload(payload, chunkSize);
      let totalImported = 0;
      
      for (let i = 0; i < chunks.length; i++) {
        const result = await importProject(orgId, projectId, chunks[i]);
        totalImported += result.imported;
        
        // Log progress
        console.log(`Chunk ${i + 1}/${chunks.length} imported: ${result.imported} items`);
      }
      
      return {
        total: chunks.length,
        completed: chunks.length,
        imported: totalImported
      };
    },
    onSuccess: (data) => {
      console.log(
        `Successfully imported ${data.imported} items in ${data.total} chunks`
      );
    },
    onError: (error) => {
      console.error('Chunked import failed:', error.message);
    }
  });
}
