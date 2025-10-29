import { DataTable } from '@/components/ui/Table'
import { useTasks } from '@/hooks/useTasks'
import type { ColumnDef } from '@tanstack/react-table'

const TasksListPage = () => {
  const { tasks, isLoading } = useTasks()

  const columns: ColumnDef<typeof tasks[number]>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
    },
  ]

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-foreground">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          List of tracked tasks with status and priority indicators.
        </p>
      </header>
      <DataTable columns={columns} data={tasks} enableSearch isLoading={isLoading} />
    </div>
  )
}

export default TasksListPage
