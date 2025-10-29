import { useMemo } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { Activity, Play, StopCircle } from 'lucide-react'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@diatonic/ui'

import { useEntitiesStore, type SessionSummary } from '../stores/entities'
import { useTimerStore } from '../stores/timer'

const statusVariant: Record<SessionSummary['status'], 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  idle: 'secondary',
  running: 'default',
  completed: 'success',
  failed: 'destructive'
}

export default function Sessions() {
  const sessions = useEntitiesStore((state) => state.sessions)
  const { activeSessionId, start, stop } = useTimerStore((state) => ({
    activeSessionId: state.activeSessionId,
    start: state.start,
    stop: state.stop
  }))

  const columns = useMemo<ColumnDef<SessionSummary>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Session',
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.title}
            <p className="text-xs text-muted-foreground">Owner: {row.original.owner}</p>
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<SessionSummary['status']>()
          return <Badge variant={statusVariant[status]} className="capitalize">{status}</Badge>
        }
      },
      {
        accessorKey: 'progress',
        header: 'Progress',
        cell: ({ getValue }) => {
          const progress = getValue<number>()
          return (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          )
        }
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last activity',
        cell: ({ getValue }) => {
          const timestamp = getValue<string>()
          return <span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</span>
        }
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const isActive = row.original.id === activeSessionId
          return (
            <div className="flex justify-end">
              <Button
                variant={isActive ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => (isActive ? stop() : start(row.original.id))}
              >
                {isActive ? (
                  <>
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
            </div>
          )
        }
      }
    ],
    [activeSessionId, start, stop]
  )

  const table = useReactTable({ data: sessions, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Monitor live capture performance, playback quality, and downstream automations.
          </p>
        </div>
        <Button>
          <Activity className="mr-2 h-4 w-4" />
          New capture
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b border-border/60">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                    No sessions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
