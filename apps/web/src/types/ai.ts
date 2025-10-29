import type { ActivityEvent } from '@/types/activity'
import type { FocusSession } from '@/types/focus'
import type { Project } from '@/types/projects'
import type { ScoreSnapshot } from '@/types/scores'
import type { Task } from '@/types/tasks'

export type AIModel =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4o-realtime'
  | 'gpt-4o-realtime-preview'
  | 'custom'

export type AssistantStatus = 'idle' | 'listening' | 'processing' | 'responding' | 'error'

export interface AssistantSession {
  id: string
  userId: string
  createdAt: string
  updatedAt?: string
  model: AIModel
  status: AssistantStatus
  lastInteractionAt?: string
  contextWindowTokens: number
}

export interface CommandEntity {
  name: string
  value: string | number | boolean
  confidence: number
}

export interface VoiceCommand {
  sessionId: string
  transcript: string
  intent: string
  confidence: number
  issuedAt: string
  entities: CommandEntity[]
}

export interface AIInsight {
  id: string
  sessionId: string
  type:
    | 'time-allocation'
    | 'focus-trend'
    | 'break-compliance'
    | 'project-risk'
    | 'task-priority'
    | 'motivation'
  title: string
  summary: string
  details?: string
  createdAt: string
  priority: 'info' | 'warning' | 'success'
  recommendedActions: string[]
  relatedActivityIds?: string[]
  relatedTaskIds?: string[]
  relatedProjectIds?: string[]
}

export interface CoachSuggestion {
  id: string
  sessionId: string
  message: string
  actionLabel?: string
  actionIntent?: string
  createdAt: string
  expiresAt?: string
  acknowledgedAt?: string
}

export interface AIContextSnapshot {
  activities: ActivityEvent[]
  focusSessions: FocusSession[]
  tasks: Task[]
  projects: Project[]
  scores?: ScoreSnapshot
  /**
   * Latest break analytics summary (minutes, compliance, etc.).
   */
  breaks?: {
    totalBreaks: number
    complianceRatio: number
    longestStreakMinutes: number
  }
}

export interface RealtimeStreamState {
  isMicrophoneActive: boolean
  isStreaming: boolean
  lastMessageAt?: string
  latencyMs?: number
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

