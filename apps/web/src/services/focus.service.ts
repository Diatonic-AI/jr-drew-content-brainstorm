import type { AmbientSound, FocusGoal, FocusSession, FocusTimerSnapshot } from '@/types/focus'

import { mockApi } from '@/lib/api/mock-server'

export const FocusService = {
  fetchSessions(): Promise<FocusSession[]> {
    return mockApi.focus.sessions()
  },
  fetchAmbientSounds(): Promise<AmbientSound[]> {
    return mockApi.focus.ambientSounds()
  },
  fetchGoals(): Promise<FocusGoal[]> {
    return mockApi.focus.goals()
  },
  fetchTimerSnapshot(): Promise<FocusTimerSnapshot> {
    return mockApi.focus.timerSnapshot()
  },
  saveSession(session: FocusSession): Promise<FocusSession> {
    return mockApi.focus.saveSession(session)
  },
}

export default FocusService
