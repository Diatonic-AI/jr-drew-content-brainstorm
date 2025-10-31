import { Badge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/Progress'
import type { FocusSession, FocusTimerSnapshot } from '@/types/focus'


export interface FocusTimerProps {
  snapshot?: FocusTimerSnapshot
  session?: FocusSession
  onPause?: () => void
  onResume?: () => void
  onEnd?: () => void
}

const phaseCopy: Record<
  NonNullable<FocusTimerSnapshot['phase']>,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }
> = {
  warmup: { label: 'Warmup', variant: 'default' },
  focus: { label: 'Focus', variant: 'success' },
  'short-break': { label: 'Short Break', variant: 'warning' },
  'long-break': { label: 'Long Break', variant: 'warning' },
  cooldown: { label: 'Cooldown', variant: 'default' },
}

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

export const FocusTimer = ({
  snapshot,
  session,
  onPause,
  onResume,
  onEnd,
}: FocusTimerProps) => {
  if (!snapshot || !session) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        <p>No active focus session.</p>
        <p>Start a session to engage focus mode.</p>
      </div>
    )
  }

  const phaseMeta = phaseCopy[snapshot.phase]
  const buttonLabel = snapshot.isPaused ? 'Resume' : 'Pause'

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-6 text-center shadow-sm">
      <Badge variant={phaseMeta.variant}>{phaseMeta.label}</Badge>
      <CircularProgress
        value={snapshot.completionRatio * 100}
        size={220}
        variant={phaseMeta.variant === 'success' ? 'success' : 'default'}
      />
      <div className="space-y-1">
        <h2 className="text-4xl font-semibold tabular-nums text-foreground">
          {formatTime(snapshot.remainingSeconds)}
        </h2>
        <p className="text-sm text-muted-foreground">
          Session #{session.segments.length} ·{' '}
          {session.projectId ? `Project ${session.projectId}` : 'Unassigned'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={snapshot.isPaused ? onResume : onPause}
        >
          {buttonLabel}
        </button>
        <button
          type="button"
          className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-md border border-destructive bg-destructive/10 px-4 text-sm font-medium text-destructive transition hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
          onClick={onEnd}
        >
          End Session
        </button>
      </div>
    </div>
  )
}
