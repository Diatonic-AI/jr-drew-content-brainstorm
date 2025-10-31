import { format } from 'date-fns'

import { Badge } from '@/components/ui/Badge'
import type { TrackingDayTotals, TrackingStatus, WorkdayHours } from '@/types/tracking'


export interface WorkHoursPanelProps {
  status: TrackingStatus
  totals?: TrackingDayTotals
  workday: WorkdayHours
  onToggleTracking?: () => void
}

const statusCopy: Record<TrackingStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
  inactive: { label: 'Tracking off', variant: 'warning' },
  idle: { label: 'Idle', variant: 'default' },
  active: { label: 'Tracking', variant: 'success' },
  paused: { label: 'Paused', variant: 'warning' },
  offline: { label: 'Offline', variant: 'danger' },
}

const minutesToHours = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins.toString().padStart(2, '0')}m`
}

export const WorkHoursPanel = ({
  status,
  totals,
  workday,
  onToggleTracking,
}: WorkHoursPanelProps) => {
  const trackedMinutes = Math.round((totals?.trackedSeconds ?? 0) / 60)
  const breakMinutes = Math.round((totals?.breakSeconds ?? 0) / 60)
  const activeMinutes = Math.round((totals?.activeSeconds ?? 0) / 60)
  const percentOfDay =
    workday.targetMinutes > 0
      ? Math.min(100, Math.round((trackedMinutes / workday.targetMinutes) * 100))
      : 0

  const statusMeta = statusCopy[status]

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Workday Summary</h3>
          <p className="text-xs text-muted-foreground">
            {format(new Date(`1970-01-01T${workday.startTime}:00`), 'h:mm a')} –{' '}
            {format(new Date(`1970-01-01T${workday.endTime}:00`), 'h:mm a')} ·{' '}
            {workday.targetMinutes / 60}h target
          </p>
        </div>
        <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
      </header>

      <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">Tracked time</dt>
          <dd className="text-lg font-semibold text-foreground">
            {minutesToHours(trackedMinutes)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Focused</dt>
          <dd className="text-lg font-semibold text-foreground">
            {minutesToHours(activeMinutes)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Breaks</dt>
          <dd className="text-lg font-semibold text-foreground">
            {minutesToHours(breakMinutes)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">% of Target</dt>
          <dd className="text-lg font-semibold text-foreground">{percentOfDay}%</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onToggleTracking}
        className="inline-flex h-9 w-fit items-center rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {status === 'active' ? 'Disable Tracking' : 'Enable Tracking'}
      </button>
    </section>
  )
}

