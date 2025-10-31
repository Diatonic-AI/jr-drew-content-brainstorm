import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { BreaksService } from '@/services/breaks.service'
import { useActivityStore } from '@/stores/activityStore'
import { useBreaksStore } from '@/stores/breaksStore'
import type { BreakPreference } from '@/types/breaks'


export const useBreaks = () => {
  const {
    preference,
    sessions,
    reminders,
    analytics,
    activeSession,
    setSessions,
    setReminders,
    setPreference,
    updatePreference,
    startBreak,
    completeBreak,
    skipBreak,
    addReminder,
    acknowledgeReminder,
    setAnalytics,
  } = useBreaksStore()
  const selectedDate = useActivityStore((store) => store.selectedDate)

  const analyticsQuery = useQuery({
    queryKey: ['breaks', 'analytics', selectedDate],
    queryFn: () => BreaksService.fetchAnalytics(selectedDate),
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => setAnalytics(data),
  })

  const sessionsQuery = useQuery({
    queryKey: ['breaks', 'sessions'],
    queryFn: () => BreaksService.listSessions(),
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => setSessions(data),
  })

  const remindersQuery = useQuery({
    queryKey: ['breaks', 'reminders'],
    queryFn: () => BreaksService.listReminders(),
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => setReminders(data),
  })

  const updatePreferenceMutation = useMutation({
    mutationFn: BreaksService.updatePreference,
  })

  const setBreakPreference = useCallback(
    (value: BreakPreference) => {
      setPreference(value)
      updatePreferenceMutation.mutate(value)
    },
    [setPreference, updatePreferenceMutation]
  )

  return {
    preference,
    sessions,
    reminders,
    analytics,
    activeSession,
    setPreference: setBreakPreference,
    updatePreference,
    startBreak,
    completeBreak,
    skipBreak,
    addReminder,
    acknowledgeReminder,
    setAnalytics,
    isLoading:
      analyticsQuery.isLoading || sessionsQuery.isLoading || remindersQuery.isLoading,
  }
}
