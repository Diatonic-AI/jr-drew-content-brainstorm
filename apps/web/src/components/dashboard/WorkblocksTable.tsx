import { format } from 'date-fns'
import * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import type { Workblock } from '@/types/workblocks'

import { Badge } from '@/components/ui/Badge'
import { DataTable } from '@/components/ui/Table'

export interface WorkblocksTableProps {
  workblocks: Workblock[]
  onSelectWorkblock?: (block: Workblock) => void
}

export const WorkblocksTable: React.FC<WorkblocksTableProps> = ({
  workblocks,
  onSelectWorkblock,
}) => {
  const columns = React.useMemo<ColumnDef<Workblock>[]>(() => {
    return [
      {
        header: 'Time',
        accessorKey: 'startTime',
        cell: ({ row }) => {
          const block = row.original
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {format(new Date(block.startTime), 'h:mm a')} –{' '}
                {format(new Date(block.endTime), 'h:mm a')}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(block.durationSeconds / 60)} min
              </span>
            </div>
          )
        },
      },
      {
        header: 'Activity',
        accessorKey: 'category',
        cell: ({ row }) => {
          const block = row.original
          return (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium capitalize text-foreground">
                {block.category}
              </span>
              {block.dominantTag ? (
                <Badge variant="outline">{block.dominantTag}</Badge>
              ) : null}
            </div>
          )
        },
      },
      {
        header: 'Project',
        accessorKey: 'projectId',
        cell: ({ row }) => {
          const block = row.original
          return block.projectId ? (
            <Badge variant="default">{block.projectId}</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          )
        },
      },
      {
        header: 'Score',
        accessorKey: 'score',
        cell: ({ row }) => {
          const block = row.original
          return block.score !== undefined ? (
            <span className="text-sm font-semibold text-foreground">
              {Math.round(block.score)}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">n/a</span>
          )
        },
      },
    ]
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Workblocks</h3>
        <span className="text-xs text-muted-foreground">
          {workblocks.length} entries
        </span>
      </header>
      <DataTable
        columns={columns}
        data={workblocks}
        enableSearch
        searchPlaceholder="Filter workblocks..."
        onRowClick={onSelectWorkblock}
      />
    </div>
  )
}

