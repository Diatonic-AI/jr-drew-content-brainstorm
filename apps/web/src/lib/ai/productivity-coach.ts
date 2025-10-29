import type { AIInsight, AIContextSnapshot } from '@/types/ai'

export const generateCoachInsights = (context: AIContextSnapshot): AIInsight[] => {
  const focusMinutes = context.focusSessions.reduce((sum, session) => sum + (session.actualDurationMinutes ?? 0), 0)
  const totalMinutes = context.activities.reduce((sum, activity) => sum + activity.durationSeconds, 0) / 60

  if (totalMinutes === 0) {
    return []
  }

  const focusRatio = focusMinutes / totalMinutes
  if (focusRatio < 0.4) {
    return [
      {
        id: crypto.randomUUID(),
        sessionId: 'coach',
        type: 'focus-trend',
        title: 'Low focus time detected',
        summary: 'Focus time is below 40% of today\'s work. Schedule a focus block now.',
        createdAt: new Date().toISOString(),
        priority: 'warning',
        recommendedActions: ['Start a 50 minute focus block', 'Mute notifications temporarily'],
      },
    ]
  }

  return []
}

export default generateCoachInsights
