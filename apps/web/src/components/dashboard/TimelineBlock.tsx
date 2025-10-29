import type { ActivityTimelineBlock, ActivityCategory } from '@/types/activity'

const categoryColors: Record<ActivityCategory, string> = {
  focus: 'bg-indigo-500/80',
  meeting: 'bg-blue-500/80',
  communication: 'bg-teal-400/80',
  documentation: 'bg-purple-400/80',
  design: 'bg-pink-400/80',
  development: 'bg-violet-500/80',
  research: 'bg-amber-400/80',
  break: 'bg-emerald-400/50',
  administrative: 'bg-slate-400/70',
  misc: 'bg-zinc-400/70',
}

export interface TimelineBlockProps {
  block: ActivityTimelineBlock
  /**
   * Horizontal position expressed as a percentage across the timeline track.
   */
  offsetPercent: number
  /**
   * Width as a percentage of the total timeline.
   */
  widthPercent: number
  isCurrent?: boolean
  onClick?: (block: ActivityTimelineBlock) => void
}

export const TimelineBlock = ({
  block,
  offsetPercent,
  widthPercent,
  isCurrent = false,
  onClick,
}: TimelineBlockProps) => {
  const colorClass = categoryColors[block.category] ?? categoryColors.misc

  return (
    <button
      type="button"
      onClick={() => onClick?.(block)}
      className={`group absolute top-1 h-10 rounded-md border border-border/30 shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${colorClass} ${
        isCurrent ? 'ring-2 ring-primary ring-offset-1' : ''
      }`}
      style={{
        left: `${offsetPercent}%`,
        width: `${Math.max(widthPercent, 0.5)}%`,
      }}
    >
      <span className="absolute inset-1 flex flex-col items-start justify-center rounded-[5px] bg-background/60 px-2 text-start text-xs font-medium text-foreground transition-opacity group-hover:opacity-100">
        <span className="truncate">{block.dominantTag?.label ?? block.category}</span>
        {block.score !== undefined ? (
          <span className="text-[10px] text-muted-foreground">Score {Math.round(block.score)}</span>
        ) : null}
      </span>
    </button>
  )
}

