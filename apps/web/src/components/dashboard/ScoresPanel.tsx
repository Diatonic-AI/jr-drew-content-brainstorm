import { CircularProgress } from '@/components/ui/Progress'
import type { ScoreMetric } from '@/types/scores'


export interface ScoresPanelProps {
  metrics: ScoreMetric[]
}

const trendIcons: Record<NonNullable<ScoreMetric['trend']>, string> = {
  up: '↑',
  down: '↓',
  steady: '→',
}

export const ScoresPanel = ({ metrics }: ScoresPanelProps) => {
  if (!metrics.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Scores not available yet.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => {
        const trend = metric.trend ? trendIcons[metric.trend] : null
        const progressValue = Math.max(0, Math.min(100, Math.round(metric.value)))

        return (
          <div
            key={metric.id}
            className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center shadow-sm"
          >
            <CircularProgress value={progressValue} size={120} variant="default" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">{metric.label}</h4>
              <p className="text-xs text-muted-foreground">
                {metric.description ?? 'Productivity metric'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Trend</span>
              <span className="font-semibold text-foreground">{trend ?? '•'}</span>
              {metric.previousValue !== undefined ? (
                <span>
                  {metric.previousValue.toFixed(1)} → {metric.value.toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

