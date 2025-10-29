import type { Task } from '@/types/tasks'

import { mockApi } from '@/lib/api/mock-server'

export const TasksService = {
  list(): Promise<Task[]> {
    return mockApi.tasks.list()
  },
  save(task: Task): Promise<Task> {
    return mockApi.tasks.save(task)
  },
}

export default TasksService
