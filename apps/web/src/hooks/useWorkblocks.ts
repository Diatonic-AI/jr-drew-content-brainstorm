import { useMemo } from 'react'

import { useActivityStore } from '@/stores/activityStore'
import type { Workblock } from '@/types/workblocks'


export const useWorkblocks = () => {
  const { timelineBlocks } = useActivityStore()

  const workblocks = useMemo<Workblock[]>(() => {
    return timelineBlocks.map((block) => ({
      id: block.id,
      userId: 'current',
      projectId: block.projectId,
      taskId: block.taskId,
      startTime: block.startTime,
      endTime: block.endTime,
      durationSeconds: block.durationSeconds,
      category: block.category,
      source: 'automatic',
      activityIds: block.eventIds,
      dominantTag: block.dominantTag?.label,
      score: block.score,
    }))
  }, [timelineBlocks])

  const totalMinutes = useMemo(
    () => workblocks.reduce((sum, block) => sum + block.durationSeconds, 0) / 60,
    [workblocks]
  )

  return {
    workblocks,
    totalMinutes,
  }
}

