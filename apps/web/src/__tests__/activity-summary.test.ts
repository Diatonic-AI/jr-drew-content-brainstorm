import { describe, expect, it } from 'vitest'

import { buildSummary } from '@/hooks/useActivity'
import { activityDaySummary, activityEvents } from '@/lib/api/mock-data'

describe('buildSummary', () => {
  it('aggregates category and project breakdowns from events', () => {
    const summary = buildSummary(activityEvents, {
      date: activityDaySummary.date,
      totalTrackedSeconds: activityDaySummary.totalTrackedSeconds,
      activeSeconds: activityDaySummary.activeSeconds,
      idleSeconds: activityDaySummary.idleSeconds,
      breakSeconds: activityDaySummary.breakSeconds,
    })

    expect(summary.categoryBreakdown.development).toBe(
      activityDaySummary.categoryBreakdown.development
    )
    expect(summary.projectBreakdown['proj-analytics-hub']).toBe(
      activityDaySummary.projectBreakdown['proj-analytics-hub']
    )
    expect(summary.topApplications.length).toBeGreaterThan(0)
  })
})
