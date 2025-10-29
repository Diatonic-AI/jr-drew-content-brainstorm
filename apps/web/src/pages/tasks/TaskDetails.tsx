import { useTasks } from '@/hooks/useTasks'

const TaskDetailsPage = () => {
  const { tasks, selectedTaskId } = useTasks()
  const task = tasks.find((item) => item.id === selectedTaskId)

  if (!task) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Select a task to view details.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-foreground">{task.title}</h1>
        <p className="text-sm text-muted-foreground">{task.description ?? 'No description.'}</p>
      </header>
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        <p>Status: {task.status}</p>
        <p>Priority: {task.priority}</p>
      </div>
    </div>
  )
}

export default TaskDetailsPage
