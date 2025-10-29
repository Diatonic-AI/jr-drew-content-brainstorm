export type IntegrationId = string
export type IntegrationCategory =
  | 'communication'
  | 'project-management'
  | 'calendar'
  | 'code'
  | 'analytics'
  | 'automation'
  | 'other'

export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'disconnected' | 'draft'

export interface IntegrationCapability {
  id: string
  name: string
  description: string
  /**
   * Indicates whether the capability is currently enabled in the workspace.
   */
  enabled: boolean
}

export interface Integration {
  id: IntegrationId
  name: string
  slug: string
  category: IntegrationCategory
  description: string
  icon?: string
  docsUrl?: string
  oauthScopes?: string[]
  capabilities: IntegrationCapability[]
}

export interface IntegrationConnection {
  id: string
  integrationId: IntegrationId
  workspaceId: string
  userId?: string
  status: IntegrationStatus
  createdAt: string
  updatedAt?: string
  lastSyncedAt?: string
  errorMessage?: string
  settings: Record<string, unknown>
}

export interface IntegrationSyncLog {
  id: string
  connectionId: string
  startedAt: string
  finishedAt?: string
  status: 'success' | 'partial' | 'failed'
  recordsProcessed: number
  errorMessage?: string
}

