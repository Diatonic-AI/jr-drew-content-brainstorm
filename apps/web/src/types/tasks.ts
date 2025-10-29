import type { ProjectId } from '@/types/projects'

export type TaskId = string
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'blocked' | 'done' | 'archived'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskAssignee {
  userId: string
  assignedAt: string
  effortAllocationPercent?: number
}

export interface TaskChecklistItem {
  id: string
  title: string
  completed: boolean
  completedAt?: string
  assigneeId?: string
}

export interface TaskDependency {
  taskId: TaskId
  type: 'blocks' | 'blocked-by' | 'relates-to'
}

export interface TaskComment {
  id: string
  authorId: string
  body: string
  createdAt: string
  updatedAt?: string
  mentions: string[]
}

export interface Task {
  id: TaskId
  projectId?: ProjectId
  parentTaskId?: TaskId
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  assignees: TaskAssignee[]
  checklist: TaskChecklistItem[]
  dependencies: TaskDependency[]
  estimatedMinutes?: number
  actualMinutes?: number
  dueDate?: string
  startDate?: string
  createdAt: string
  updatedAt?: string
  completedAt?: string
  activityScore?: number
  lastActivityAt?: string
}

export interface TaskBoardColumn {
  id: string
  name: string
  status: TaskStatus
  order: number
  wipLimit?: number
  taskIds: TaskId[]
}

export interface TaskFilterOptions {
  searchText?: string
  projectIds?: ProjectId[]
  assigneeIds?: string[]
  statuses?: TaskStatus[]
  priorities?: TaskPriority[]
  dueBefore?: string
  dueAfter?: string
  tags?: string[]
  includeCompleted?: boolean
}

