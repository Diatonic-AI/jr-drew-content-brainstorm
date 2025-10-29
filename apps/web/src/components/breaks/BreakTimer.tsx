import * as React from 'react'

import type { BreakSession } from '@/types/breaks'

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${sec
    .toString()
    .padStart(2, '0')}`
}

export interface BreakTimerProps {
  session?: BreakSession
  remainingSeconds: number
  onEndBreak?: () => void
}

export const BreakTimer = ({
  session,
  remainingSeconds,
  onEndBreak,
}: BreakTimerProps) => (
  <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm">
    <h3 className="text-sm font-semibold text-foreground">Active Break</h3>
    <p className="text-4xl font-semibold tabular-nums text-foreground">
      {formatTime(remainingSeconds)}
    </p>
    <p className="text-xs text-muted-foreground">
      {session
        ? `${session.type.toUpperCase()} break · ${session.scheduledDurationMinutes} min`
        : 'No break running'}
    </p>
    <button
      type="button"
      onClick={onEndBreak}
      className="inline-flex h-10 items-center rounded-md border border-destructive bg-destructive/10 px-4 text-sm font-medium text-destructive transition hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
    >
      End Break
    </button>
  </div>
)

