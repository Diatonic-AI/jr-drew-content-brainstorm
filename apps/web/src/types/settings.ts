import type { AIModel } from '@/types/ai'
import type { BreakPreference } from '@/types/breaks'
import type { FocusModeSettings } from '@/types/focus'
import type { IntegrationId } from '@/types/integrations'
import type { TrackingConfiguration } from '@/types/tracking'

export type ThemePreference = 'system' | 'light' | 'dark'
export type NotificationChannel = 'email' | 'push' | 'desktop' | 'sms' | 'slack'

export interface KeyboardShortcut {
  id: string
  description: string
  /**
   * Array of key combinations (e.g. ["Ctrl+Shift+K"]).
   */
  bindings: string[]
  isEditable: boolean
  enabled: boolean
}

export interface NotificationPreference {
  id: string
  channel: NotificationChannel
  enabled: boolean
  quietHours?: {
    start: string
    end: string
  }
  /**
   * Topics or events that will trigger the notification.
   */
  topics: string[]
}

export interface WorkHoursPreference {
  timeZone: string
  startTime: string
  endTime: string
  workingDays: number[]
  /**
   * Daily target minutes allows the dashboard to calculate percentage completion.
   */
  targetMinutesPerDay: number
}

export interface PrivacySettings {
  allowDataExport: boolean
  allowTeamVisibility: boolean
  shareFocusScoresWithTeam: boolean
  redactSensitiveTitles: boolean
  includeUrlsInActivityLog: boolean
}

export interface IntegrationSettings {
  enabledIntegrationIds: IntegrationId[]
  autoConnectCalendar: boolean
  autoConnectCommunicationTools: boolean
  /**
   * Per-integration configuration overrides.
   */
  configuration: Record<IntegrationId, Record<string, unknown>>
}

export interface ExperimentalFeatureToggle {
  key: string
  name: string
  description?: string
  enabled: boolean
}

export interface AISettings {
  /**
   * Identifier of the preferred voice/assistant model.
   */
  model: AIModel
  enableRealtimeVoice: boolean
  enableCoachingTips: boolean
  autoSummarizeDay: boolean
  /**
   * Minutes after which the AI should proactively suggest breaks.
   */
  proactiveBreakThresholdMinutes: number
  voice?: {
    voiceId: string
    speakingRate: number
    pitch: number
  }
}

export interface SettingsState {
  theme: ThemePreference
  workHours: WorkHoursPreference
  notifications: NotificationPreference[]
  focus: FocusModeSettings
  breaks: BreakPreference
  tracking: TrackingConfiguration
  keyboardShortcuts: KeyboardShortcut[]
  privacy: PrivacySettings
  integrations: IntegrationSettings
  ai: AISettings
  features: ExperimentalFeatureToggle[]
}
