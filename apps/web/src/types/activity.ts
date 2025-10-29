/**
 * Activity tracking domain types.
 * These models describe the granular events captured by the desktop tracker,
 * the normalized metadata exposed to the UI, and aggregate views consumed by
 * dashboard components such as the timeline, activity log, and analytics panels.
 */

export type ActivityId = string
export type ActivityCategory =
  | 'focus'
  | 'meeting'
  | 'communication'
  | 'documentation'
  | 'design'
  | 'development'
  | 'research'
  | 'break'
  | 'administrative'
  | 'misc'

export type ActivitySource = 'desktop' | 'browser' | 'mobile' | 'manual' | 'integration'

export interface ActivityTag {
  id: string
  label: string
  color?: string
  category?: ActivityCategory
}

export interface ApplicationMetadata {
  /**
   * Human-friendly application name (e.g. "Google Chrome").
   */
  name: string
  /**
   * System identifier used for persistence or integration mapping.
   */
  identifier: string
  /**
   * Optional semantic grouping (e.g. "design", "communication").
   */
  category?: ActivityCategory
  /**
   * Hex color or Tailwind token used for UI accents.
   */
  accentColor?: string
  /**
   * Icon source used in activity log and timeline blocks.
   */
  icon?: string
}

export interface ActivityClassifierConfidence {
  labels: Record<ActivityCategory, number>
  /**
   * Automatically detected project or client assignment probabilities.
   */
  projects?: Record<string, number>
}

export interface ActivityEvent {
  id: ActivityId
  userId: string
  organizationId?: string
  capturedAt: string
  /**
   * Timestamp of when the activity started.
   */
  startTime: string
  /**
   * Timestamp of when the activity ended (undefined while in progress).
   */
  endTime?: string
  /**
   * Activity duration in seconds for consistent timeline calculations.
   */
  durationSeconds: number
  source: ActivitySource
  application: ApplicationMetadata
  windowTitle?: string
  url?: string
  projectId?: string
  taskId?: string
  tags: ActivityTag[]
  category: ActivityCategory
  /**
   * Focus/productivity score on a 0-100 scale when available.
   */
  score?: number
  /**
   * Keystroke and mouse counts enable estimating focus vs. idle time.
   */
  interactionCounts?: {
    keyboard: number
    mouse: number
  }
  classifier?: ActivityClassifierConfidence
  isManualEntry?: boolean
  /**
   * Indicates the event started while tracking was offline and was later synced.
   */
  syncedFromOffline?: boolean
}

export interface ActivityLogEntry extends ActivityEvent {
  /**
   * Indicates the event was detected as idle and should be visually subdued.
   */
  isIdle: boolean
  /**
   * Additional context from integrations (e.g. meeting attendees, ticket links).
   */
  context?: Record<string, unknown>
}

export interface ActivityTimelineBlock {
  id: string
  startTime: string
  endTime: string
  durationSeconds: number
  category: ActivityCategory
  dominantTag?: ActivityTag
  projectId?: string
  taskId?: string
  /**
   * Aggregated score for the block (average of underlying events).
   */
  score?: number
  /**
   * IDs of underlying events contributing to the block.
   */
  eventIds: ActivityId[]
}

export interface ActivityDaySummary {
  date: string
  totalTrackedSeconds: number
  activeSeconds: number
  idleSeconds: number
  breakSeconds: number
  categoryBreakdown: Record<ActivityCategory, number>
  projectBreakdown: Record<string, number>
  topApplications: ApplicationMetadata[]
}

export interface ActivityFilterOptions {
  from?: string
  to?: string
  categories?: ActivityCategory[]
  projectIds?: string[]
  tagIds?: string[]
  sources?: ActivitySource[]
  includeIdle?: boolean
}

export interface ActivityAnomaly {
  id: string
  eventId: ActivityId
  detectedAt: string
  reason:
    | 'overlap'
    | 'missing-end'
    | 'long-idle'
    | 'suspicious-url'
    | 'classification-low-confidence'
  severity: 'low' | 'medium' | 'high'
  notes?: string
  resolved?: boolean
}

export interface ActivityExportPayload {
  generatedAt: string
  userId: string
  filters: ActivityFilterOptions
  events: ActivityEvent[]
  totals: ActivityDaySummary
}

