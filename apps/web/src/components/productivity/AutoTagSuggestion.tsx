import type { ActivityEvent } from '@/types/activity'

export interface AutoTagSuggestionData {
  projectId: string
  projectName: string
  description: string
  confidence: number
  relatedActivities: ActivityEvent[]
}

export interface AutoTagSuggestionProps {
  suggestion: AutoTagSuggestionData
  onUseSuggestion?: (suggestion: AutoTagSuggestionData) => void
  onDismiss?: (suggestion: AutoTagSuggestionData) => void
}

export const AutoTagSuggestion = ({
  suggestion,
  onUseSuggestion,
  onDismiss,
}: AutoTagSuggestionProps) => (
  <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-lg">
    <header className="space-y-1">
      <p className="text-xs font-medium uppercase text-primary">Rize ⚡ Project Auto-tag</p>
      <h3 className="text-base font-semibold text-foreground">{suggestion.projectName}</h3>
      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
    </header>
    <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
      <p className="font-medium text-foreground">Related activity</p>
      <ul className="mt-2 space-y-1">
        {suggestion.relatedActivities.slice(0, 3).map((activity) => (
          <li key={activity.id}>
            {activity.application.name} · {activity.windowTitle ?? 'Untitled'} (
            {Math.round(activity.durationSeconds / 60)} min)
          </li>
        ))}
        {suggestion.relatedActivities.length > 3 ? (
          <li>+{suggestion.relatedActivities.length - 3} more</li>
        ) : null}
      </ul>
    </div>
    <footer className="flex items-center justify-between text-xs text-muted-foreground">
      <span>Confidence: {(suggestion.confidence * 100).toFixed(0)}%</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted"
          onClick={() => onDismiss?.(suggestion)}
        >
          Dismiss
        </button>
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => onUseSuggestion?.(suggestion)}
        >
          Use Suggestion
        </button>
      </div>
    </footer>
  </div>
)

