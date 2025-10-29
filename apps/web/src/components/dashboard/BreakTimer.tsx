import type { BreakPreference } from '@/types/breaks'

export interface DashboardBreakTimerProps {
  elapsedSinceLastBreakSeconds: number
  breakToWorkRatio: {
    breaks: number
    workBlocks: number
  }
  preference: BreakPreference
  onStartBreak?: () => void
  onToggleNotifications?: (enabled: boolean) => void
}

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hrs ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`
}

export const BreakTimer = ({
  elapsedSinceLastBreakSeconds,
  breakToWorkRatio,
  preference,
  onStartBreak,
  onToggleNotifications,
}: DashboardBreakTimerProps) => {
  const { breaks, workBlocks } = breakToWorkRatio

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Break Timer</h3>
          <p className="text-xs text-muted-foreground">
            Remind every {preference.reminderIntervalMinutes} min · requires minimum{' '}
            {preference.minimumBreakMinutes} min
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Notifications
          <input
            type="checkbox"
            checked={preference.enableReminders}
            onChange={(event) => onToggleNotifications?.(event.target.checked)}
          />
        </label>
      </header>

      <div className="rounded-lg bg-muted/50 p-4 text-center">
        <p className="text-xs uppercase text-muted-foreground">Time since last break</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">
          {formatDuration(elapsedSinceLastBreakSeconds)}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Break to work ratio: <strong className="text-foreground">{breaks}</strong> /{' '}
          <strong className="text-foreground">{workBlocks}</strong>
        </span>
        <button
          type="button"
          onClick={onStartBreak}
          className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Start Break
        </button>
      </div>
    </div>
  )
}

