import { Badge } from '@/components/ui/Badge'
import type { AIInsight } from '@/types/ai'


const priorityToVariant: Record<
  AIInsight['priority'],
  'default' | 'success' | 'warning' | 'danger'
> = {
  info: 'default',
  warning: 'warning',
  success: 'success',
}

export interface InsightCardProps {
  insight: AIInsight
  onAccept?: (insight: AIInsight) => void
  onDismiss?: (insight: AIInsight) => void
}

export const InsightCard = ({ insight, onAccept, onDismiss }: InsightCardProps) => (
  <article className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
    <header className="flex items-start justify-between">
      <div className="space-y-1">
        <Badge variant={priorityToVariant[insight.priority] ?? 'default'}>
          {insight.type.replace('-', ' ')}
        </Badge>
        <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
      </div>
      <time className="text-xs text-muted-foreground">
        {new Date(insight.createdAt).toLocaleTimeString()}
      </time>
    </header>
    <p className="text-sm text-muted-foreground">{insight.summary}</p>
    {insight.recommendedActions.length ? (
      <ul className="space-y-1 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
        {insight.recommendedActions.map((action) => (
          <li key={action}>• {action}</li>
        ))}
      </ul>
    ) : null}
    <footer className="flex items-center gap-2 text-xs">
      <button
        type="button"
        className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => onAccept?.(insight)}
      >
        Apply Suggestion
      </button>
      <button
        type="button"
        className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => onDismiss?.(insight)}
      >
        Dismiss
      </button>
    </footer>
  </article>
)
