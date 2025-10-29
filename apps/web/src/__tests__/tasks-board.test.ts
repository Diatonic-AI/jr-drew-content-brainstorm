import { describe, expect, it } from 'vitest'

import { createDefaultBoard } from '@/hooks/useTasks'
import { tasks } from '@/lib/api/mock-data'

describe('createDefaultBoard', () => {
  it('creates columns grouped by status with task ids', () => {
    const board = createDefaultBoard(tasks)
    expect(board.length).toBeGreaterThan(0)

    const inProgress = board.find((column) => column.status === 'in-progress')
    expect(inProgress).toBeDefined()
    expect(inProgress?.taskIds.length).toBeGreaterThan(0)
    expect(inProgress?.taskIds).toContain('task-analytics-stream')
  })
})
