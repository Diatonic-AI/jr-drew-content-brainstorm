import { beforeEach, describe, expect, it } from 'vitest'

import { mockApi } from '@/lib/api/mock-server'

describe('mockApi data flows', () => {
  beforeEach(() => {
    mockApi.reset()
  })

  it('provides seeded tasks and persists new saves', async () => {
    const initial = await mockApi.tasks.list()
    expect(initial.length).toBeGreaterThan(0)

    const next = await mockApi.tasks.save({
      ...initial[0],
      id: 'task-new-demo',
      title: 'Demo task from test',
    })

    expect(next.id).toBe('task-new-demo')

    const all = await mockApi.tasks.list()
    expect(all.find((task) => task.id === 'task-new-demo')?.title).toBe('Demo task from test')
  })

  it('filters activity events by date', async () => {
    const events = await mockApi.tracking.events('2025-10-29')
    expect(events.length).toBeGreaterThan(0)
    expect(events.every((event) => event.startTime.startsWith('2025-10-29'))).toBe(true)
  })
})
