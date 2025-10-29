import type { ActivityCategory, ActivityId } from '@/types/activity'

export type FocusSessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
export type FocusPhase = 'warmup' | 'focus' | 'short-break' | 'long-break' | 'cooldown'

export interface FocusPhaseSegment {
  id: string
  phase: FocusPhase
  startTime: string
  endTime?: string
  durationSeconds?: number
  relatedActivityIds: ActivityId[]
  notes?: string
}

export interface AmbientSound {
  id: string
  name: string
  description?: string
  /**
   * Public URL or local asset path for the audio loop.
   */
  src: string
  /**
   * Decibel attenuation applied when mixing with notification sounds.
   */
  volume: number
  category: 'nature' | 'brown-noise' | 'white-noise' | 'instrumental' | 'binaural' | 'custom'
  tags: string[]
  durationSeconds?: number
}

export interface FocusModeSettings {
  defaultDurationMinutes: number
  breakDurationMinutes: number
  longBreakDurationMinutes: number
  longBreakInterval: number
  autoStartNextSession: boolean
  autoStartBreaks: boolean
  enableAmbientSounds: boolean
  defaultSoundId?: string
  /**
   * Activity categories counted as distractions during focus sessions.
   */
  distractionCategories: ActivityCategory[]
}

export interface FocusSession {
  id: string
  userId: string
  projectId?: string
  taskId?: string
  goalId?: string
  status: FocusSessionStatus
  startedAt: string
  endedAt?: string
  plannedDurationMinutes: number
  actualDurationMinutes?: number
  score?: number
  /**
   * Amount of time lost to distractions during the session.
   */
  distractionSeconds?: number
  segments: FocusPhaseSegment[]
  notes?: string
}

export interface FocusTimerSnapshot {
  sessionId: string
  phase: FocusPhase
  remainingSeconds: number
  elapsedSeconds: number
  /**
   * Percentage (0-1) used for progress indicators.
   */
  completionRatio: number
  soundId?: string
  isMuted: boolean
  isPaused: boolean
}

export interface FocusGoal {
  id: string
  userId: string
  title: string
  description?: string
  /**
   * Target minutes per day or per week depending on the cadence.
   */
  targetMinutes: number
  cadence: 'daily' | 'weekly'
  activityCategories: ActivityCategory[]
  createdAt: string
  updatedAt?: string
  /**
   * Rolling progress measured in minutes for the active cadence window.
   */
  progressMinutes: number
  /**
   * Percentage completion (0-1) derived from progress vs. target.
   */
  progressRatio: number
}

export interface FocusDistractionEvent {
  id: string
  sessionId: string
  activityId: ActivityId
  occurredAt: string
  category: ActivityCategory
  description?: string
  /**
   * Number of seconds lost because of the distraction.
   */
  durationSeconds: number
}

