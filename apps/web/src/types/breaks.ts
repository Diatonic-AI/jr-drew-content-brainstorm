import type { ActivityId } from '@/types/activity'

export type BreakType = 'micro' | 'short' | 'long'
export type BreakSessionStatus = 'scheduled' | 'active' | 'completed' | 'skipped'

export interface BreakPreference {
  enableReminders: boolean
  /**
   * Minutes of continuous work before a reminder fires.
   */
  reminderIntervalMinutes: number
  /**
   * Required minimum break duration to be considered compliant.
   */
  minimumBreakMinutes: number
  longBreakInterval: number
  longBreakDurationMinutes: number
  allowAutoStartBreaks: boolean
  /**
   * Quiet hours window expressed as ISO local times (HH:mm).
   */
  quietHours?: {
    start: string
    end: string
  }
}

export interface BreakSession {
  id: string
  userId: string
  startedAt: string
  endedAt?: string
  scheduledDurationMinutes: number
  actualDurationMinutes?: number
  type: BreakType
  status: BreakSessionStatus
  triggeredBy: 'manual' | 'reminder' | 'schedule' | 'system'
  /**
   * Activity resumed immediately after the break.
   */
  resumedActivityId?: ActivityId
  notes?: string
}

export interface BreakReminder {
  id: string
  userId: string
  issuedAt: string
  acknowledgedAt?: string
  type: BreakType
  /**
   * Actual work streak duration that triggered the reminder.
   */
  workStreakMinutes: number
  deliveryChannels: Array<'desktop' | 'mobile' | 'email' | 'slack'>
}

export interface BreakAnalytics {
  date: string
  breaksTaken: number
  compliantBreaks: number
  averageDurationMinutes: number
  longestWorkStreakMinutes: number
  idleMinutes: number
  /**
   * Ratio of breaks taken vs. breaks suggested.
   */
  complianceRatio: number
}

