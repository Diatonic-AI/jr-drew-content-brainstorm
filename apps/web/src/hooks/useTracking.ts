import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { ActivityTimelineBlock } from '@/types/activity'
import type { TrackingConfiguration, TrackingSession, TrackingState } from '@/types/tracking'

import { useTrackingStore } from '@/stores/trackingStore'
import { useActivityStore } from '@/stores/activityStore'
import { TrackingService } from '@/services/tracking.service'

export const useTracking = () => {
  const {
    state,
    configuration,
    alerts,
    diagnostics,
    setConfiguration,
    setTodaysTotals,
    startSession,
    endSession,
    setTrackingState,
    updateConfiguration,
    upsertTimelineBlocks,
    recordEvent,
    addAlert,
    dismissAlert,
  } = useTrackingStore()
  const selectedDate = useActivityStore((store) => store.selectedDate)
  const queryClient = useQueryClient()

  const totalsQuery = useQuery({
    queryKey: ['tracking', 'totals', selectedDate],
    queryFn: () => TrackingService.fetchDayTotals(selectedDate),
    staleTime: 60 * 1000,
    onSuccess: (totals) => {
      setTodaysTotals(totals)
      upsertTimelineBlocks(totals.timelineBlocks)
    },
  })

  const updateConfigurationMutation = useMutation({
    mutationFn: TrackingService.updateConfiguration,
    onSuccess: (nextConfiguration) => {
      setConfiguration(nextConfiguration)
      queryClient.invalidateQueries({ queryKey: ['tracking', 'totals'] })
    },
  })

  const handleStartSession = useCallback(
    (session: TrackingSession) => startSession(session),
    [startSession]
  )

  const handleEndSession = useCallback(
    (endedAt: string) => endSession(endedAt),
    [endSession]
  )

  const handleSetTimelineBlocks = useCallback(
    (blocks: ActivityTimelineBlock[]) => upsertTimelineBlocks(blocks),
    [upsertTimelineBlocks]
  )

  const handleUpdateState = useCallback(
    (next: TrackingState) => setTrackingState(next),
    [setTrackingState]
  )

  const handleUpdateConfiguration = useCallback(
    (partial: Partial<TrackingConfiguration>) => {
      updateConfiguration(partial)
      updateConfigurationMutation.mutate(partial)
    },
    [updateConfiguration, updateConfigurationMutation]
  )

  return {
    status: state.status,
    trackingState: state,
    configuration,
    alerts,
    diagnostics,
    isLoading: totalsQuery.isLoading || updateConfigurationMutation.isPending,
    startSession: handleStartSession,
    endSession: handleEndSession,
    updateState: handleUpdateState,
    updateConfiguration: handleUpdateConfiguration,
    upsertTimelineBlocks: handleSetTimelineBlocks,
    recordEvent,
    addAlert,
    dismissAlert,
  }
}
