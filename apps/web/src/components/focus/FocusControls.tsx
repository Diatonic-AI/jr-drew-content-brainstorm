export interface FocusControlsProps {
  isMuted: boolean
  onToggleMute?: () => void
  onExtend?: () => void
  onSkipBreak?: () => void
}

export const FocusControls = ({
  isMuted,
  onToggleMute,
  onExtend,
  onSkipBreak,
}: FocusControlsProps) => (
  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-sm">
    <button
      type="button"
      onClick={onToggleMute}
      className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {isMuted ? 'Unmute' : 'Mute'}
    </button>
    <button
      type="button"
      onClick={onExtend}
      className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      Extend 5 min
    </button>
    <button
      type="button"
      onClick={onSkipBreak}
      className="inline-flex h-9 items-center rounded-md border border-destructive bg-destructive/10 px-4 text-sm font-medium text-destructive transition hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
    >
      Skip Break
    </button>
  </div>
)

