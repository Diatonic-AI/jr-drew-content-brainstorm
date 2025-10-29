import { useTasks } from '@/hooks/useTasks'

const TaskBoardPage = () => {
  const { board } = useTasks()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {board.map((column) => (
        <div key={column.id} className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">{column.name}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {column.taskIds.map((taskId) => (
              <li key={taskId}>{taskId}</li>
            ))}
          </ul>
        </div>
      ))}
      {!board.length ? (
        <div className="col-span-full rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Setup your first board column to visualize tasks.
        </div>
      ) : null}
    </div>
  )
}

export default TaskBoardPage
