import { format } from 'date-fns'

import type { ActivityLogEntry } from '@/types/activity'

import { Badge } from '@/components/ui/Badge'

export interface ActivityLogProps {
  entries: ActivityLogEntry[]
  maxItems?: number
}

export const ActivityLog = ({ entries, maxItems = 20 }: ActivityLogProps) => {
  const sliced = entries.slice(0, maxItems)

  if (!sliced.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        No recent activity recorded.
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Activity Log</h3>
        <span className="text-xs text-muted-foreground">
          Showing {sliced.length} of {entries.length}
        </span>
      </header>

      <ul className="space-y-3 text-sm">
        {sliced.map((entry) => (
          <li
            key={entry.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/60 p-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <time className="text-xs uppercase text-muted-foreground">
                  {format(new Date(entry.startTime), 'HH:mm:ss')}
                </time>
                <Badge variant="outline">{entry.application.name}</Badge>
              </div>
              <p className="text-sm font-medium text-foreground">
                {entry.windowTitle ?? 'Untitled window'}
              </p>
              {entry.url ? (
                <a
                  href={entry.url}
                  className="text-xs text-primary underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {entry.url}
                </a>
              ) : null}
            </div>
            <div className="flex flex-col items-end gap-2 text-right text-xs text-muted-foreground">
              <span>{Math.round(entry.durationSeconds / 60)} min</span>
              {entry.isIdle ? <Badge variant="warning">Idle</Badge> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

