import type { ScoreSnapshot } from '@/types/scores'

import { mockApi } from '@/lib/api/mock-server'

export const AnalyticsService = {
  fetchScoreSnapshot(date: string): Promise<ScoreSnapshot> {
    return mockApi.analytics.scoreSnapshot(date)
  },
}

export default AnalyticsService
