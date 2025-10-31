import { mockApi } from '@/lib/api/mock-server'
import type { BreakAnalytics, BreakPreference, BreakReminder, BreakSession } from '@/types/breaks'


export const BreaksService = {
  fetchAnalytics(date: string): Promise<BreakAnalytics> {
    return mockApi.breaks.analytics(date)
  },
  listSessions(): Promise<BreakSession[]> {
    return mockApi.breaks.sessions()
  },
  listReminders(): Promise<BreakReminder[]> {
    return mockApi.breaks.reminders()
  },
  updatePreference(preference: BreakPreference): Promise<BreakPreference> {
    return mockApi.breaks.updatePreference(preference)
  },
  logBreak(session: BreakSession): Promise<BreakSession> {
    return mockApi.breaks.logBreak(session)
  },
}

export default BreaksService
