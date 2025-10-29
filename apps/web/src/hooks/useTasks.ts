import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Task, TaskBoardColumn, TaskId, TaskStatus } from '@/types/tasks'

import { useTasksStore } from '@/stores/tasksStore'
import { TasksService } from '@/services/tasks.service'

export const createDefaultBoard = (items: Task[]): TaskBoardColumn[] =>
  Array.from(
    items.reduce<Map<TaskStatus, TaskBoardColumn>>((map, task) => {
      const column = map.get(task.status)
      if (column) {
        column.taskIds.push(task.id)
      } else {
        map.set(task.status, {
          id: `col-${task.status}`,
          name: task.status.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase()),
          status: task.status,
          order: map.size,
          taskIds: [task.id],
        })
      }
      return map
    }, new Map())
  ).map(([, column]) => column)

export const useTasks = () => {
  const {
    tasks,
    board,
    filters,
    selectedTaskId,
    setTasks,
    setBoard,
    upsertTask,
    removeTask,
    moveTask,
    setFilters,
    upsertColumn,
    removeColumn,
    setSelectedTask,
  } = useTasksStore()

  const queryClient = useQueryClient()

  const { isInitialLoading: isTasksLoading, isFetching: isTasksFetching } = useQuery({
    queryKey: ['tasks'],
    queryFn: TasksService.list,
    staleTime: 60 * 1000,
    onSuccess: (items) => {
      setTasks(items)
      setBoard(createDefaultBoard(items))
    },
  })

  const saveTaskMutation = useMutation({
    mutationFn: TasksService.save,
    onSuccess: (savedTask) => {
      upsertTask(savedTask)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const saveTask = useCallback(
    (task: Task) => saveTaskMutation.mutateAsync(task),
    [saveTaskMutation]
  )

  const deleteTask = useCallback(
    (taskId: TaskId) => removeTask(taskId),
    [removeTask]
  )

  const moveTaskTo = useCallback(
    (taskId: TaskId, status: TaskStatus, columnId?: string) =>
      moveTask(taskId, status, columnId),
    [moveTask]
  )

  const saveColumn = useCallback(
    (column: TaskBoardColumn) => upsertColumn(column),
    [upsertColumn]
  )

  return {
    tasks,
    board,
    filters,
    selectedTaskId,
    isLoading: isTasksLoading || isTasksFetching,
    isSaving: saveTaskMutation.isPending,
    upsertTask: saveTask,
    removeTask: deleteTask,
    moveTask: moveTaskTo,
    setFilters,
    upsertColumn: saveColumn,
    removeColumn,
    setSelectedTask,
  }
}
