import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  Task,
  TaskBoardColumn,
  TaskFilterOptions,
  TaskId,
  TaskStatus,
} from '@/types/tasks'

interface TasksStoreState {
  tasks: Task[]
  board: TaskBoardColumn[]
  filters: TaskFilterOptions
  selectedTaskId?: TaskId
}

interface TasksStoreActions {
  setTasks: (tasks: Task[]) => void
  setBoard: (columns: TaskBoardColumn[]) => void
  upsertTask: (task: Task) => void
  removeTask: (taskId: TaskId) => void
  moveTask: (taskId: TaskId, status: TaskStatus, columnId?: string) => void
  setFilters: (filters: Partial<TaskFilterOptions>) => void
  upsertColumn: (column: TaskBoardColumn) => void
  removeColumn: (columnId: string) => void
  setSelectedTask: (taskId?: TaskId) => void
  reset: () => void
}

type TasksStore = TasksStoreState & TasksStoreActions

export const useTasksStore = create<TasksStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      board: [],
      filters: {},
      selectedTaskId: undefined,
      setTasks: (tasks) =>
        set(() => ({
          tasks: [...tasks],
        })),
      setBoard: (columns) =>
        set(() => ({
          board: [...columns].sort((a, b) => a.order - b.order),
        })),
      upsertTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks.filter((existing) => existing.id !== task.id), task],
        })),
      removeTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          board: state.board.map((column) => ({
            ...column,
            taskIds: column.taskIds.filter((id) => id !== taskId),
          })),
          selectedTaskId: state.selectedTaskId === taskId ? undefined : state.selectedTaskId,
        })),
      moveTask: (taskId, status, columnId) =>
        set((state) => {
          const task = state.tasks.find((item) => item.id === taskId)
          if (!task) return state
          const updatedTask: Task = { ...task, status }
          const board = state.board.map((column) => {
            const withoutTask = column.taskIds.filter((id) => id !== taskId)
            if (column.id === columnId || column.status === status) {
              return { ...column, taskIds: [...withoutTask, taskId] }
            }
            return { ...column, taskIds: withoutTask }
          })
          return {
            tasks: [
              ...state.tasks.filter((item) => item.id !== taskId),
              updatedTask,
            ],
            board,
          }
        }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      upsertColumn: (column) =>
        set((state) => ({
          board: [
            ...state.board.filter((existing) => existing.id !== column.id),
            column,
          ].sort((a, b) => a.order - b.order),
        })),
      removeColumn: (columnId) =>
        set((state) => ({
          board: state.board.filter((column) => column.id !== columnId),
        })),
      setSelectedTask: (taskId) => set(() => ({ selectedTaskId: taskId })),
      reset: () =>
        set(() => ({
          tasks: [],
          board: [],
          filters: {},
          selectedTaskId: undefined,
        })),
    }),
    {
      name: 'tasks-store',
      partialize: (state) => ({
        filters: state.filters,
        board: state.board,
      }),
    }
  )
)
