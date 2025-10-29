import type { ActivityCategory, ActivityId } from '@/types/activity'
import type { ProjectId } from '@/types/projects'
import type { TaskId } from '@/types/tasks'

export type WorkblockId = string
export type WorkblockSource = 'automatic' | 'manual' | 'integration'

export interface Workblock {
  id: WorkblockId
  userId: string
  projectId?: ProjectId
  taskId?: TaskId
  /**
   * Time the block starts and ends (ISO strings).
   */
  startTime: string
  endTime: string
  durationSeconds: number
  category: ActivityCategory
  source: WorkblockSource
  activityIds: ActivityId[]
  dominantTag?: string
  score?: number
  notes?: string
}

export interface WorkblockEditPayload {
  id: WorkblockId
  projectId?: ProjectId
  taskId?: TaskId
  startTime: string
  endTime: string
  category: ActivityCategory
  notes?: string
}

export interface WorkblockSeries {
  date: string
  blocks: Workblock[]
  totalDurationSeconds: number
  focusDurationSeconds: number
  meetingDurationSeconds: number
  breakDurationSeconds: number
}

export interface WorkblockTimelineBucket {
  /**
   * Hour index 0-23.
   */
  hour: number
  totalMinutes: number
  blocks: Workblock[]
}

