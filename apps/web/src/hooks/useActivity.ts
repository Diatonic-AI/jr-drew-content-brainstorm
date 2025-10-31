import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'


import { TrackingService } from '@/services/tracking.service'
import { useActivityStore } from '@/stores/activityStore'
import { useTrackingStore } from '@/stores/trackingStore'
import type {
  ActivityAnomaly,
  ActivityDaySummary,
  ActivityEvent,
  ActivityFilterOptions,
  ActivityTimelineBlock,
} from '@/types/activity'

export const buildSummary = (
  events: ActivityEvent[],
  totals: Pick<ActivityDaySummary, 'date' | 'totalTrackedSeconds' | 'activeSeconds' | 'idleSeconds' | 'breakSeconds'>
): ActivityDaySummary => {
  const categoryBreakdown = events.reduce<ActivityDaySummary['categoryBreakdown']>((acc, event) => {
    acc[event.category] = (acc[event.category] ?? 0) + event.durationSeconds
    return acc
  }, {})
  const projectBreakdown = events.reduce<ActivityDaySummary['projectBreakdown']>((acc, event) => {
    if (event.projectId) {
      acc[event.projectId] = (acc[event.projectId] ?? 0) + event.durationSeconds
    }
    return acc
  }, {})
  const topApplications = Array.from(
    events.reduce<Map<string, ActivityEvent['application'] & { totalSeconds: number }>>((map, event) => {
      const existing = map.get(event.application.identifier)
      if (existing) {
        existing.totalSeconds += event.durationSeconds
      } else {
        map.set(event.application.identifier, { ...event.application, totalSeconds: event.durationSeconds })
      }
      return map
    }, new Map())
  )
    .sort((a, b) => b.totalSeconds - a.totalSeconds)
    .slice(0, 5)
    .map(({ totalSeconds: _totalSeconds, ...app }) => app)

  return {
    date: totals.date,
    totalTrackedSeconds: totals.totalTrackedSeconds,
    activeSeconds: totals.activeSeconds,
    idleSeconds: totals.idleSeconds,
    breakSeconds: totals.breakSeconds,
    categoryBreakdown,
    projectBreakdown,
    topApplications,
  }
}

export const useActivity = () => {
  const {
    events,
    timelineBlocks,
    daySummary,
    filters,
    selectedDate,
    anomalies,
    isLoading,
    setEvents,
    addEvent,
    setTimelineBlocks,
    setDaySummary,
    setFilters,
    setSelectedDate,
    setLoading,
    upsertAnomaly,
    resolveAnomaly,
    reset,
  } = useActivityStore()
  const setTodaysTotals = useTrackingStore((store) => store.setTodaysTotals)

  const totalsQuery = useQuery({
    queryKey: ['tracking', 'totals', selectedDate],
    queryFn: () => TrackingService.fetchDayTotals(selectedDate),
    staleTime: 60 * 1000,
  })

  const eventsQuery = useQuery({
    queryKey: ['activity', 'events', selectedDate],
    queryFn: () => TrackingService.fetchEvents(selectedDate),
    staleTime: 60 * 1000,
  })

  const isFetching = totalsQuery.isLoading || eventsQuery.isLoading

  useEffect(() => {
    setLoading(isFetching)
  }, [isFetching, setLoading])

  useEffect(() => {
    if (eventsQuery.data) {
      setEvents(eventsQuery.data)
    }
  }, [eventsQuery.data, setEvents])

  useEffect(() => {
    if (totalsQuery.data) {
      setTimelineBlocks(totalsQuery.data.timelineBlocks)
      setTodaysTotals(totalsQuery.data)
    }
  }, [setTimelineBlocks, setTodaysTotals, totalsQuery.data])

  useEffect(() => {
    if (eventsQuery.data && totalsQuery.data) {
      const { date, trackedSeconds, activeSeconds, idleSeconds, breakSeconds } = totalsQuery.data
      const summary = buildSummary(eventsQuery.data, {
        date,
        totalTrackedSeconds: trackedSeconds,
        activeSeconds,
        idleSeconds,
        breakSeconds,
      })
      setDaySummary(summary)
    }
  }, [eventsQuery.data, setDaySummary, totalsQuery.data])

  const handleSetEvents = useCallback(
    (nextEvents: ActivityEvent[]) => setEvents(nextEvents),
    [setEvents]
  )

  const handleSetTimeline = useCallback(
    (blocks: ActivityTimelineBlock[]) => setTimelineBlocks(blocks),
    [setTimelineBlocks]
  )

  const handleSetSummary = useCallback(
    (summary: ActivityDaySummary) => setDaySummary(summary),
    [setDaySummary]
  )

  const handleSetFilters = useCallback(
    (nextFilters: Partial<ActivityFilterOptions>) =>
      setFilters({
        ...filters,
        ...nextFilters,
      }),
    [filters, setFilters]
  )

  const handleAddAnomaly = useCallback(
    (anomaly: ActivityAnomaly) => upsertAnomaly(anomaly),
    [upsertAnomaly]
  )

  return {
    events,
    timelineBlocks,
    daySummary,
    filters,
    selectedDate,
    anomalies,
    isLoading: isFetching,
    setEvents: handleSetEvents,
    addEvent,
    setTimelineBlocks: handleSetTimeline,
    setDaySummary: handleSetSummary,
    setFilters: handleSetFilters,
    setSelectedDate,
    setLoading,
    upsertAnomaly: handleAddAnomaly,
    resolveAnomaly,
    reset,
  }
}
