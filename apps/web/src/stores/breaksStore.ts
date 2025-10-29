import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  BreakAnalytics,
  BreakPreference,
  BreakReminder,
  BreakSession,
  BreakSessionStatus,
  BreakType,
} from '@/types/breaks'

interface BreaksStoreState {
  preference: BreakPreference
  sessions: BreakSession[]
  reminders: BreakReminder[]
  analytics: BreakAnalytics | null
  activeSession?: BreakSession
}

interface BreaksStoreActions {
  setSessions: (sessions: BreakSession[]) => void
  setReminders: (reminders: BreakReminder[]) => void
  setPreference: (preference: BreakPreference) => void
  updatePreference: (preference: Partial<BreakPreference>) => void
  startBreak: (type: BreakType, meta?: Partial<BreakSession>) => void
  completeBreak: (sessionId: string, actualDurationMinutes: number) => void
  skipBreak: (sessionId: string) => void
  addReminder: (reminder: BreakReminder) => void
  acknowledgeReminder: (reminderId: string) => void
  setAnalytics: (analytics: BreakAnalytics) => void
  reset: () => void
}

type BreaksStore = BreaksStoreState & BreaksStoreActions

const defaultPreference: BreakPreference = {
  enableReminders: true,
  reminderIntervalMinutes: 50,
  minimumBreakMinutes: 5,
  longBreakInterval: 4,
  longBreakDurationMinutes: 20,
  allowAutoStartBreaks: false,
}

export const useBreaksStore = create<BreaksStore>()(
  persist(
    (set, get) => ({
      preference: defaultPreference,
      sessions: [],
      reminders: [],
      analytics: null,
      activeSession: undefined,
      setSessions: (sessions) =>
        set(() => ({ sessions: [...sessions] })),
      setReminders: (reminders) =>
        set(() => ({ reminders: [...reminders] })),
      setPreference: (preference) => set(() => ({ preference })),
      updatePreference: (preference) =>
        set((state) => ({
          preference: {
            ...state.preference,
            ...preference,
          },
        })),
      startBreak: (type, meta) =>
        set((state) => {
          const session: BreakSession = {
            id: meta?.id ?? crypto.randomUUID(),
            userId: meta?.userId ?? 'local',
            startedAt: meta?.startedAt ?? new Date().toISOString(),
            scheduledDurationMinutes:
              meta?.scheduledDurationMinutes ??
              (type === 'long'
                ? state.preference.longBreakDurationMinutes
                : state.preference.minimumBreakMinutes),
            type,
            status: 'active',
            triggeredBy: meta?.triggeredBy ?? 'manual',
            notes: meta?.notes,
          }
          return {
            sessions: [session, ...state.sessions],
            activeSession: session,
          }
        }),
      completeBreak: (sessionId, actualDurationMinutes) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  endedAt: new Date().toISOString(),
                  actualDurationMinutes,
                  status: 'completed' as BreakSessionStatus,
                }
              : session
          ),
          activeSession:
            state.activeSession?.id === sessionId ? undefined : state.activeSession,
        })),
      skipBreak: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, status: 'skipped' as BreakSessionStatus }
              : session
          ),
          activeSession:
            state.activeSession?.id === sessionId ? undefined : state.activeSession,
        })),
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [...state.reminders, reminder],
        })),
      acknowledgeReminder: (reminderId) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === reminderId
              ? { ...reminder, acknowledgedAt: new Date().toISOString() }
              : reminder
          ),
        })),
      setAnalytics: (analytics) => set(() => ({ analytics })),
      reset: () =>
        set(() => ({
          preference: defaultPreference,
          sessions: [],
          reminders: [],
          analytics: null,
          activeSession: undefined,
        })),
    }),
    {
      name: 'breaks-store',
      partialize: (state) => ({
        preference: state.preference,
      }),
    }
  )
)
