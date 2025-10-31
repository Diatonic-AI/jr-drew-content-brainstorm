import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { timeTrackingService, type TimeSession } from '@/services/timeTracking.service';

interface TimeTrackingState {
  // Active session state
  activeSession: TimeSession | null;
  isTracking: boolean;
  elapsedTime: number; // seconds
  
  // Today's summary
  todaysDuration: number; // seconds
  todaySessions: TimeSession[];
  
  // Actions
  startSession: (orgId: string, userId: string, projectId?: string, taskId?: string) => Promise<void>;
  stopSession: (orgId: string) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  loadActiveSession: (orgId: string, userId: string) => Promise<void>;
  loadTodaySessions: (orgId: string, userId: string) => Promise<void>;
  updateElapsedTime: () => void;
  
  // Subscription management
  subscribeToActiveSession: (orgId: string, userId: string) => () => void;
}

export const useTimeTrackingStore = create<TimeTrackingState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        activeSession: null,
        isTracking: false,
        elapsedTime: 0,
        todaysDuration: 0,
        todaySessions: [],

        /**
         * Start a new time tracking session
         */
        startSession: async (orgId, userId, projectId?, taskId?) => {
          try {
            // Stop any existing session first
            const current = get().activeSession;
            if (current) {
              await timeTrackingService.stopSession(orgId, current.id);
            }

            // Start new session
            const session = await timeTrackingService.startSession(orgId, userId, projectId, taskId);
            
            set({
              activeSession: session,
              isTracking: true,
              elapsedTime: 0
            });

            // Start elapsed time counter
            const interval = setInterval(() => {
              get().updateElapsedTime();
            }, 1000);

            // Store interval ID for cleanup
            (window as any)._timeTrackingInterval = interval;
          } catch (error) {
            console.error('Failed to start session:', error);
            throw error;
          }
        },

        /**
         * Stop the active session
         */
        stopSession: async (orgId) => {
          try {
            const session = get().activeSession;
            if (!session) return;

            await timeTrackingService.stopSession(orgId, session.id);

            // Clear interval
            if ((window as any)._timeTrackingInterval) {
              clearInterval((window as any)._timeTrackingInterval);
              (window as any)._timeTrackingInterval = null;
            }

            set({
              activeSession: null,
              isTracking: false,
              elapsedTime: 0
            });

            // Reload today's sessions
            await get().loadTodaySessions(orgId, session.userId);
          } catch (error) {
            console.error('Failed to stop session:', error);
            throw error;
          }
        },

        /**
         * Pause active session (client-side only)
         */
        pauseSession: () => {
          set({ isTracking: false });
          
          // Clear interval
          if ((window as any)._timeTrackingInterval) {
            clearInterval((window as any)._timeTrackingInterval);
            (window as any)._timeTrackingInterval = null;
          }
        },

        /**
         * Resume paused session
         */
        resumeSession: () => {
          const session = get().activeSession;
          if (!session) return;

          set({ isTracking: true });

          // Restart interval
          const interval = setInterval(() => {
            get().updateElapsedTime();
          }, 1000);

          (window as any)._timeTrackingInterval = interval;
        },

        /**
         * Load active session from database
         */
        loadActiveSession: async (orgId, userId) => {
          try {
            const session = await timeTrackingService.getActiveSession(orgId, userId);
            
            if (session) {
              // Calculate elapsed time
              const startTime = new Date(session.startTime).getTime();
              const now = Date.now();
              const elapsed = Math.floor((now - startTime) / 1000);

              set({
                activeSession: session,
                isTracking: true,
                elapsedTime: elapsed
              });

              // Start tracking elapsed time
              const interval = setInterval(() => {
                get().updateElapsedTime();
              }, 1000);

              (window as any)._timeTrackingInterval = interval;
            } else {
              set({
                activeSession: null,
                isTracking: false,
                elapsedTime: 0
              });
            }
          } catch (error) {
            console.error('Failed to load active session:', error);
          }
        },

        /**
         * Load today's sessions
         */
        loadTodaySessions: async (orgId, userId) => {
          try {
            const sessions = await timeTrackingService.getTodaySessions(orgId, userId);
            const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

            set({
              todaySessions: sessions,
              todaysDuration: totalDuration
            });
          } catch (error) {
            console.error('Failed to load today sessions:', error);
          }
        },

        /**
         * Update elapsed time counter
         */
        updateElapsedTime: () => {
          const { activeSession, isTracking } = get();
          
          if (!activeSession || !isTracking) return;

          const startTime = new Date(activeSession.startTime).getTime();
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);

          set({ elapsedTime: elapsed });
        },

        /**
         * Subscribe to real-time active session updates
         */
        subscribeToActiveSession: (orgId, userId) => {
          return timeTrackingService.subscribeToActiveSession(orgId, userId, (session) => {
            if (session) {
              const startTime = new Date(session.startTime).getTime();
              const now = Date.now();
              const elapsed = Math.floor((now - startTime) / 1000);

              set({
                activeSession: session,
                isTracking: true,
                elapsedTime: elapsed
              });
            } else {
              set({
                activeSession: null,
                isTracking: false,
                elapsedTime: 0
              });

              // Clear interval
              if ((window as any)._timeTrackingInterval) {
                clearInterval((window as any)._timeTrackingInterval);
                (window as any)._timeTrackingInterval = null;
              }
            }
          });
        }
      }),
      {
        name: 'time-tracking-storage',
        partialize: (state) => ({
          // Only persist non-sensitive data
          todaysDuration: state.todaysDuration
        })
      }
    ),
    { name: 'TimeTrackingStore' }
  )
);

/**
 * Format seconds to HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Hook to use time tracking with automatic cleanup
 */
export function useTimeTracking(orgId: string | undefined, userId: string | undefined) {
  const store = useTimeTrackingStore();

  // Load active session on mount
  React.useEffect(() => {
    if (!orgId || !userId) return;

    store.loadActiveSession(orgId, userId);
    store.loadTodaySessions(orgId, userId);

    // Subscribe to real-time updates
    const unsubscribe = store.subscribeToActiveSession(orgId, userId);

    return () => {
      unsubscribe();
      
      // Clear interval on unmount
      if ((window as any)._timeTrackingInterval) {
        clearInterval((window as any)._timeTrackingInterval);
        (window as any)._timeTrackingInterval = null;
      }
    };
  }, [orgId, userId]);

  return store;
}
