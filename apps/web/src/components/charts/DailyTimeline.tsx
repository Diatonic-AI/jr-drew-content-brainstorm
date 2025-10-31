import { Card, CardContent } from '@diatonic/ui'

interface TimeBlock {
  start?: string
  end?: string
  label?: string
}

interface DailyTimelineProps {
  blocks: TimeBlock[]
}

export function DailyTimeline({ blocks }: DailyTimelineProps) {
  return (
    <Card>
      <CardContent className="flex h-24 items-center justify-center">
        {blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Awaiting telemetry data...</p>
        ) : (
          <div className="grid w-full gap-2">
            {blocks.map((block, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {block.start} - {block.end}
                </span>
                <span className="font-medium">{block.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
