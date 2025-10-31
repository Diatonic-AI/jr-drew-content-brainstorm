import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { FocusService } from '@/services/focus.service'
import { useFocusStore } from '@/stores/focusStore'
import type {
  AmbientSound,
  FocusGoal,
  FocusModeSettings,
  FocusSession,
  FocusTimerSnapshot,
} from '@/types/focus'


export const useFocus = () => {
  const {
    settings,
    ambientSounds,
    sessions,
    goals,
    activeSession,
    timer,
    distractions,
    setSettings,
    updateSettings,
    setAmbientSounds,
    setSessions,
    setGoals,
    addAmbientSound,
    removeAmbientSound,
    upsertSession,
    completeSession,
    setActiveSession,
    setTimerSnapshot,
    recordDistraction,
    upsertGoal,
    removeGoal,
  } = useFocusStore()

  const sessionsQuery = useQuery({
    queryKey: ['focus', 'sessions'],
    queryFn: () => FocusService.fetchSessions(),
    staleTime: 5 * 60 * 1000,
    onSuccess: (items) => setSessions(items),
  })

  useQuery({
    queryKey: ['focus', 'ambient-sounds'],
    queryFn: () => FocusService.fetchAmbientSounds(),
    staleTime: Infinity,
    onSuccess: (items) => setAmbientSounds(items),
  })

  useQuery({
    queryKey: ['focus', 'goals'],
    queryFn: () => FocusService.fetchGoals(),
    staleTime: 5 * 60 * 1000,
    onSuccess: (items) => setGoals(items),
  })

  useQuery({
    queryKey: ['focus', 'timer'],
    queryFn: () => FocusService.fetchTimerSnapshot(),
    staleTime: 15 * 1000,
    onSuccess: (snapshot) => setTimerSnapshot(snapshot),
  })

  const saveSessionMutation = useMutation({
    mutationFn: FocusService.saveSession,
    onSuccess: (saved) => upsertSession(saved),
  })

  const setSnapshot = useCallback(
    (snapshot: FocusTimerSnapshot | undefined) => setTimerSnapshot(snapshot),
    [setTimerSnapshot]
  )

  const setSession = useCallback(
    (session: FocusSession | undefined) =>
      setActiveSession(session ? session.id : undefined),
    [setActiveSession]
  )

  const addSound = useCallback(
    (sound: AmbientSound) => addAmbientSound(sound),
    [addAmbientSound]
  )

  const updateFocusSettings = useCallback(
    (partial: Partial<FocusModeSettings>) => updateSettings(partial),
    [updateSettings]
  )

  const saveGoal = useCallback(
    (goal: FocusGoal) => upsertGoal(goal),
    [upsertGoal]
  )

  const saveFocusSession = useCallback(
    (session: FocusSession) => saveSessionMutation.mutateAsync(session),
    [saveSessionMutation]
  )

  return {
    settings,
    ambientSounds,
    sessions,
    goals,
    activeSession,
    timer,
    distractions,
    setSettings,
    updateSettings: updateFocusSettings,
    addAmbientSound: addSound,
    removeAmbientSound,
    upsertSession: saveFocusSession,
    completeSession,
    setActiveSession: setSession,
    setTimerSnapshot: setSnapshot,
    recordDistraction,
    upsertGoal: saveGoal,
    removeGoal,
    isLoading: sessionsQuery.isLoading || saveSessionMutation.isPending,
  }
}
