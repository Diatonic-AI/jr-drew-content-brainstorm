import type { SettingsState } from '@/types/settings'

export type UserRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer' | 'developer'

export interface TeamMembership {
  teamId: string
  teamName: string
  role: UserRole
  joinedAt: string
  lastActiveAt?: string
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName?: string
  avatarUrl?: string
  role: UserRole
  jobTitle?: string
  locale: string
  timeZone: string
  createdAt: string
  updatedAt?: string
  memberships: TeamMembership[]
}

export interface UserPreferences {
  /**
   * Snapshot of last saved settings for quick access in the UI.
   */
  settings: Partial<SettingsState>
  /**
   * Stored ordered navigation favorites for quick links.
   */
  favorites: string[]
  /**
   * Feature tour/completion flags.
   */
  featureFlags: Record<string, boolean>
  /**
   * Timestamp of the last coaching insight the user acknowledged.
   */
  lastCoachDismissedAt?: string
}

export interface UserSessionMetadata {
  userId: string
  sessionId: string
  loggedInAt: string
  lastSeenAt: string
  userAgent?: string
  ipAddress?: string
  hasTrackingInstalled: boolean
  platform?: 'mac' | 'windows' | 'linux' | 'web'
}

