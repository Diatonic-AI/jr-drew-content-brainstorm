import type { ActivityEvent, ActivityTimelineBlock } from '@/types/activity'

export type TrackingStatus = 'inactive' | 'idle' | 'active' | 'paused' | 'offline'

export interface WorkdayHours {
  /**
   * IANA timezone identifier used to anchor the workday window.
   */
  timeZone: string
  /**
   * ISO 8601 local time string (e.g. "08:00") representing workday start.
   */
  startTime: string
  /**
   * ISO 8601 local time string for the expected end of the workday.
   */
  endTime: string
  /**
   * Target number of minutes to work during the day (for percentage calculations).
   */
  targetMinutes: number
  workingDays: number[] // 0-6 (Sunday-Saturday)
}

export interface BreakReminderConfig {
  /**
   * Minimum minutes of continuous work before triggering a break reminder.
   */
  minWorkStreakMinutes: number
  /**
   * Maximum minutes a break can last before marking as extended.
   */
  maxBreakMinutes: number
  /**
   * Optional enforced micro break frequency.
   */
  microBreakIntervalMinutes?: number
  notificationsEnabled: boolean
  desktopNotifications?: boolean
  emailNotifications?: boolean
}

export interface TrackingPrivacyControls {
  redactWindowTitles: boolean
  redactUrls: boolean
  requireManualApprovalForNewApplications: boolean
  allowAudioRecording: boolean
  allowScreenshotting: boolean
  gdprAcknowledgedAt?: string
}

export interface TrackingConfiguration {
  autoStartAtLogin: boolean
  autoPauseOnIdle: boolean
  idleThresholdSeconds: number
  collectKeyboardMouseCounts: boolean
  manualOverrideEnabled: boolean
  workday: WorkdayHours
  breakReminders: BreakReminderConfig
  privacy: TrackingPrivacyControls
}

export interface TrackingSession {
  id: string
  userId: string
  startedAt: string
  pausedAt?: string
  resumedAt?: string
  endedAt?: string
  status: TrackingStatus
  configurationSnapshot: TrackingConfiguration
  timelineBlocks: ActivityTimelineBlock[]
  totalTrackedSeconds: number
  /**
   * If tracking was performed offline, events are synced later and flagged.
   */
  syncedOfflineEvents?: ActivityEvent[]
}

export interface TrackingState {
  status: TrackingStatus
  session?: TrackingSession
  /**
   * Latest captured activity event.
   */
  currentEvent?: ActivityEvent
  /**
   * Summary for the current day, used by the work hours panel.
   */
  todaysTotals?: TrackingDayTotals
  lastSyncedAt?: string
  isSyncInProgress: boolean
  lastError?: string
}

export interface TrackingDayTotals {
  date: string
  trackedSeconds: number
  activeSeconds: number
  idleSeconds: number
  breakSeconds: number
  autoTaggedSeconds: number
  manualTaggedSeconds: number
  timelineBlocks: ActivityTimelineBlock[]
}

export interface TrackingEventPayload {
  sessionId: string
  events: ActivityEvent[]
  capturedAt: string
  offline?: boolean
}

export interface TrackingAlert {
  id: string
  type: 'idle-too-long' | 'missing-break' | 'tracking-paused' | 'offline-mode'
  createdAt: string
  resolvedAt?: string
  metadata?: Record<string, unknown>
  severity: 'info' | 'warning' | 'critical'
}

export interface TrackingDiagnostics {
  lastHeartbeatAt?: string
  lastIdleEventAt?: string
  lastBreakStartedAt?: string
  version: string
  os: string
  platform: 'mac' | 'windows' | 'linux'
}

