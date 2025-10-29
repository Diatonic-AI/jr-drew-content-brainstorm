import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  AmbientSound,
  FocusDistractionEvent,
  FocusGoal,
  FocusModeSettings,
  FocusSession,
  FocusTimerSnapshot,
} from '@/types/focus'

interface FocusStoreState {
  settings: FocusModeSettings
  ambientSounds: AmbientSound[]
  sessions: FocusSession[]
  goals: FocusGoal[]
  activeSession?: FocusSession
  timer?: FocusTimerSnapshot
  distractions: Record<string, FocusDistractionEvent[]>
}

interface FocusStoreActions {
  setSettings: (settings: FocusModeSettings) => void
  updateSettings: (settings: Partial<FocusModeSettings>) => void
  setAmbientSounds: (sounds: AmbientSound[]) => void
  addAmbientSound: (sound: AmbientSound) => void
  removeAmbientSound: (soundId: string) => void
  setSessions: (sessions: FocusSession[]) => void
  setGoals: (goals: FocusGoal[]) => void
  upsertSession: (session: FocusSession) => void
  completeSession: (sessionId: string, update?: Partial<FocusSession>) => void
  setActiveSession: (sessionId?: string) => void
  setTimerSnapshot: (snapshot?: FocusTimerSnapshot) => void
  recordDistraction: (sessionId: string, distraction: FocusDistractionEvent) => void
  upsertGoal: (goal: FocusGoal) => void
  removeGoal: (goalId: string) => void
  reset: () => void
}

type FocusStore = FocusStoreState & FocusStoreActions

const defaultSettings: FocusModeSettings = {
  defaultDurationMinutes: 50,
  breakDurationMinutes: 10,
  longBreakDurationMinutes: 20,
  longBreakInterval: 4,
  autoStartNextSession: false,
  autoStartBreaks: false,
  enableAmbientSounds: true,
  defaultSoundId: undefined,
  distractionCategories: ['communication', 'break', 'misc'],
}

export const useFocusStore = create<FocusStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      ambientSounds: [],
      sessions: [],
      goals: [],
      activeSession: undefined,
      timer: undefined,
      distractions: {},
      setSettings: (settings) => set(() => ({ settings })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
            distractionCategories:
              settings.distractionCategories ?? state.settings.distractionCategories,
          },
        })),
      setAmbientSounds: (sounds) =>
        set(() => ({ ambientSounds: [...sounds] })),
      addAmbientSound: (sound) =>
        set((state) => ({
          ambientSounds: [
            ...state.ambientSounds.filter((existing) => existing.id !== sound.id),
            sound,
          ],
        })),
      removeAmbientSound: (soundId) =>
        set((state) => ({
          ambientSounds: state.ambientSounds.filter((sound) => sound.id !== soundId),
          settings:
            state.settings.defaultSoundId === soundId
              ? { ...state.settings, defaultSoundId: undefined }
              : state.settings,
        })),
      setSessions: (sessions) =>
        set(() => ({ sessions: [...sessions] })),
      setGoals: (goals) =>
        set(() => ({ goals: [...goals] })),
      upsertSession: (session) =>
        set((state) => {
          const sessions = state.sessions.filter((existing) => existing.id !== session.id)
          sessions.unshift(session)
          return {
            sessions,
            activeSession:
              session.status === 'in-progress' ? session : state.activeSession,
          }
        }),
      completeSession: (sessionId, update) =>
        set((state) => {
          const sessions = state.sessions.map((session) =>
            session.id === sessionId ? { ...session, ...update, status: 'completed' as const } : session
          )
          return {
            sessions,
            activeSession:
              state.activeSession?.id === sessionId ? undefined : state.activeSession,
          }
        }),
      setActiveSession: (sessionId) =>
        set((state) => ({
          activeSession: sessionId
            ? state.sessions.find((session) => session.id === sessionId)
            : undefined,
        })),
      setTimerSnapshot: (snapshot) => set(() => ({ timer: snapshot })),
      recordDistraction: (sessionId, distraction) =>
        set((state) => ({
          distractions: {
            ...state.distractions,
            [sessionId]: [...(state.distractions[sessionId] ?? []), distraction],
          },
        })),
      upsertGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals.filter((existing) => existing.id !== goal.id),
            goal,
          ],
        })),
      removeGoal: (goalId) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== goalId),
        })),
      reset: () =>
        set(() => ({
          settings: defaultSettings,
          ambientSounds: [],
          sessions: [],
          goals: [],
          activeSession: undefined,
          timer: undefined,
          distractions: {},
        })),
    }),
    {
      name: 'focus-store',
      partialize: (state) => ({
        settings: state.settings,
        ambientSounds: state.ambientSounds,
        goals: state.goals,
      }),
    }
  )
)
