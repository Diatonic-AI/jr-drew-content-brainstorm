export type ProjectId = string
export type ClientId = string

export type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived'
export type ProjectType = 'internal' | 'client' | 'personal' | 'experimental'

export interface ProjectMember {
  userId: string
  role: 'owner' | 'contributor' | 'viewer'
  allocationPercentage?: number
  joinedAt: string
}

export interface ProjectMilestone {
  id: string
  title: string
  description?: string
  dueDate?: string
  completedAt?: string
  status: 'pending' | 'in-progress' | 'completed'
  progressPercent: number
}

export interface Project {
  id: ProjectId
  name: string
  description?: string
  status: ProjectStatus
  type: ProjectType
  color?: string
  icon?: string
  clientId?: ClientId
  clientName?: string
  tags: string[]
  isBillable: boolean
  hourlyRate?: number
  estimatedMinutes?: number
  createdAt: string
  updatedAt?: string
  startDate?: string
  dueDate?: string
  ownerId: string
  members: ProjectMember[]
  milestones: ProjectMilestone[]
}

export interface ProjectAllocation {
  projectId: ProjectId
  totalTrackedMinutes: number
  focusMinutes: number
  meetingMinutes: number
  documentationMinutes: number
  /**
   * Percentage (0-1) of the tracked time during the selected range.
   */
  percentage: number
}

export interface ProjectHealthMetric {
  name: string
  value: number
  target?: number
  status: 'on-track' | 'at-risk' | 'off-track'
  trend?: 'up' | 'steady' | 'down'
  description?: string
}

export interface ProjectSummary {
  project: Project
  allocation: ProjectAllocation
  health: ProjectHealthMetric[]
  activeTasks: number
  overdueTasks: number
  upcomingMilestones: ProjectMilestone[]
}

