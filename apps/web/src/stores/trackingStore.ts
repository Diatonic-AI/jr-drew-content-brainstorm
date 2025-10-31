import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  ActivityEvent,
  ActivityTimelineBlock,
} from '@/types/activity'
import type {
  TrackingAlert,
  TrackingConfiguration,
  TrackingDiagnostics,
  TrackingSession,
  TrackingState,
  TrackingDayTotals,
} from '@/types/tracking'

interface TrackingStore {
  state: TrackingState
  configuration: TrackingConfiguration
  alerts: TrackingAlert[]
  diagnostics?: TrackingDiagnostics
  setConfiguration: (configuration: TrackingConfiguration) => void
  updateConfiguration: (configuration: Partial<TrackingConfiguration>) => void
  setTrackingState: (state: TrackingState) => void
  setTodaysTotals: (totals?: TrackingDayTotals) => void
  startSession: (session: TrackingSession) => void
  endSession: (endedAt: string) => void
  upsertTimelineBlocks: (blocks: ActivityTimelineBlock[]) => void
  recordEvent: (event: ActivityEvent) => void
  addAlert: (alert: TrackingAlert) => void
  dismissAlert: (alertId: string) => void
  setDiagnostics: (diagnostics: TrackingDiagnostics) => void
  reset: () => void
}

const defaultConfiguration: TrackingConfiguration = {
  autoStartAtLogin: true,
  autoPauseOnIdle: true,
  idleThresholdSeconds: 300,
  collectKeyboardMouseCounts: true,
  manualOverrideEnabled: true,
  workday: {
    timeZone: 'UTC',
    startTime: '08:00',
    endTime: '18:00',
    targetMinutes: 480,
    workingDays: [1, 2, 3, 4, 5],
  },
  breakReminders: {
    minWorkStreakMinutes: 50,
    maxBreakMinutes: 30,
    microBreakIntervalMinutes: 10,
    notificationsEnabled: true,
    desktopNotifications: true,
    emailNotifications: false,
  },
  privacy: {
    redactWindowTitles: false,
    redactUrls: false,
    requireManualApprovalForNewApplications: false,
    allowAudioRecording: false,
    allowScreenshotting: false,
  },
}

const defaultState: TrackingState = {
  status: 'inactive',
  isSyncInProgress: false,
}

export const useTrackingStore = create<TrackingStore>()(
  persist(
    (set, get) => ({
      state: defaultState,
      configuration: defaultConfiguration,
      alerts: [],
      diagnostics: undefined,
      setConfiguration: (configuration) =>
        set(() => ({ configuration })),
      updateConfiguration: (configuration) =>
        set((store) => ({
          configuration: {
            ...store.configuration,
            ...configuration,
            workday: {
              ...store.configuration.workday,
              ...configuration.workday,
            },
            breakReminders: {
              ...store.configuration.breakReminders,
              ...configuration.breakReminders,
            },
            privacy: {
              ...store.configuration.privacy,
              ...configuration.privacy,
            },
          },
        })),
      setTodaysTotals: (totals) =>
        set((store) => ({
          state: {
            ...store.state,
            todaysTotals: totals,
          },
        })),
      setTrackingState: (state) => set(() => ({ state })),
      startSession: (session) =>
        set((store) => ({
          state: {
            ...store.state,
            status: 'active',
            session,
            currentEvent: undefined,
          },
        })),
      endSession: (endedAt) =>
        set((store) => {
          const session = store.state.session
          if (!session) return store
          return {
            state: {
              ...store.state,
              status: 'inactive',
              session: {
                ...session,
                endedAt,
              },
              currentEvent: undefined,
            },
          }
        }),
      upsertTimelineBlocks: (blocks) =>
        set((store) => {
          const session = store.state.session
          if (!session) return store
          return {
            state: {
              ...store.state,
              session: {
                ...session,
                timelineBlocks: blocks,
              },
            },
          }
        }),
      recordEvent: (event) =>
        set((store) => ({
          state: {
            ...store.state,
            currentEvent: event,
            session: store.state.session
              ? {
                  ...store.state.session,
                  timelineBlocks: store.state.session.timelineBlocks,
                  syncedOfflineEvents: [
                    ...(store.state.session.syncedOfflineEvents ?? []),
                    event,
                  ],
                }
              : store.state.session,
          },
        })),
      addAlert: (alert) =>
        set((store) => ({
          alerts: [...store.alerts, alert],
        })),
      dismissAlert: (alertId) =>
        set((store) => ({
          alerts: store.alerts.filter((alert) => alert.id !== alertId),
        })),
      setDiagnostics: (diagnostics) => set(() => ({ diagnostics })),
      reset: () =>
        set(() => ({
          state: defaultState,
          configuration: defaultConfiguration,
          alerts: [],
          diagnostics: undefined,
        })),
    }),
    {
      name: 'tracking-store',
      partialize: (state) => ({
        configuration: state.configuration,
      }),
    }
  )
)
