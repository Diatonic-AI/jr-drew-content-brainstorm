import { mockApi } from '@/lib/api/mock-server'
import type { ScoreSnapshot } from '@/types/scores'


export const AnalyticsService = {
  fetchScoreSnapshot(date: string): Promise<ScoreSnapshot> {
    return mockApi.analytics.scoreSnapshot(date)
  },
}

export default AnalyticsService
