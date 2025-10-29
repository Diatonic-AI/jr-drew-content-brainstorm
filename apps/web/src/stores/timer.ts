import { create } from 'zustand'

interface TimerState {
  activeSessionId: string | null
  startedAt: number | null
  elapsedSeconds: number
  start: (sessionId: string) => void
  stop: () => void
  reset: () => void
  tick: () => void
}

export const useTimerStore = create<TimerState>((set) => ({
  activeSessionId: null,
  startedAt: null,
  elapsedSeconds: 0,
  start: (sessionId) =>
    set({
      activeSessionId: sessionId,
      startedAt: Date.now(),
      elapsedSeconds: 0
    }),
  stop: () => set({ activeSessionId: null }),
  reset: () => set({ elapsedSeconds: 0, startedAt: Date.now() }),
  tick: () =>
    set((state) => ({
      elapsedSeconds: state.activeSessionId ? state.elapsedSeconds + 1 : state.elapsedSeconds
    }))
}))
