import { useQueryClient } from '@tanstack/react-query';
import { onSnapshot, type Query, type FirestoreError, type DocumentData } from 'firebase/firestore';
import { useEffect } from 'react';

interface UseRealtimeQueryOptions<T> {
  queryKey: unknown[];
  query: Query<DocumentData>;
  map?: (docs: DocumentData[]) => T;
  enabled?: boolean;
}

// Bridges Firestore onSnapshot into React Query cache for live updates.
export function useRealtimeQuery<T = DocumentData[]>(options: UseRealtimeQueryOptions<T>) {
  const { queryKey, query, map, enabled = true } = options;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        queryClient.setQueryData(queryKey, () => (map ? map(data) : (data as unknown as T)));
      },
      (error: FirestoreError) => {
        console.error('Firestore realtime query error', error);
        // Optionally surface error state in cache
        queryClient.setQueryData([...queryKey, 'error'], error);
      }
    );
    return () => unsubscribe();
  }, [queryKey, query, map, enabled, queryClient]);
}
