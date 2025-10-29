import React from 'react'
type Block = { start?: string; end?: string; label?: string }
export function DailyTimeline({ blocks }: { blocks: Block[] }) {
  return (
    <div className="h-24 grid place-items-center text-muted-foreground">
      {blocks.length === 0 ? 'Awaiting telemetry...' : JSON.stringify(blocks)}
    </div>
  )
}
