import { useMemo } from 'react'


import { useActivityStore } from '@/stores/activityStore'
import { useBreaksStore } from '@/stores/breaksStore'
import type { ScoreMetric } from '@/types/scores'

export const useProductivityScore = () => {
  const { daySummary } = useActivityStore()
  const { analytics } = useBreaksStore()

  const metrics = useMemo<ScoreMetric[]>(() => {
    const totalSeconds = daySummary?.totalTrackedSeconds ?? 0

    const focusValue =
      daySummary && totalSeconds > 0
        ? (daySummary.activeSeconds / totalSeconds) * 100
        : 0

    const meetingsValue =
      daySummary && totalSeconds > 0
        ? ((daySummary.categoryBreakdown.meeting ?? 0) / totalSeconds) * 100
        : 0

    const breakValue =
      analytics && analytics.breaksTaken > 0
        ? Math.min(100, analytics.complianceRatio * 100)
        : 0

    return [
      {
        id: 'focus',
        type: 'focus',
        label: 'Focus',
        value: Math.round(focusValue),
        description: 'Share of focused time vs. total tracked time',
        trend: 'steady',
      },
      {
        id: 'meetings',
        type: 'meetings',
        label: 'Meetings',
        value: Math.round(100 - meetingsValue),
        description: 'Lower percentage indicates fewer meeting hours',
        trend: 'steady',
      },
      {
        id: 'breaks',
        type: 'breaks',
        label: 'Break Compliance',
        value: Math.round(breakValue),
        description: 'Break adherence based on scheduled reminders',
        trend: 'steady',
      },
    ]
  }, [daySummary, analytics])

  return { metrics }
}
