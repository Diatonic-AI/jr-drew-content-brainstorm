import type { BreakAnalytics, BreakPreference } from '@/types/breaks'

export interface BreakTimePanelProps {
  analytics?: BreakAnalytics
  preference: BreakPreference
}

export const BreakTimePanel = ({ analytics, preference }: BreakTimePanelProps) => (
  <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
    <header>
      <h3 className="text-sm font-semibold text-foreground">Break Analytics</h3>
      <p className="text-xs text-muted-foreground">
        Targets: break every {preference.reminderIntervalMinutes} min · minimum{' '}
        {preference.minimumBreakMinutes} min
      </p>
    </header>
    {analytics ? (
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Breaks taken</dt>
          <dd className="text-lg font-semibold text-foreground">{analytics.breaksTaken}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Compliance</dt>
          <dd className="text-lg font-semibold text-foreground">
            {(analytics.complianceRatio * 100).toFixed(0)}%
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Avg duration</dt>
          <dd className="text-lg font-semibold text-foreground">
            {analytics.averageDurationMinutes} min
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Longest uninterrupted work</dt>
          <dd className="text-lg font-semibold text-foreground">
            {analytics.longestWorkStreakMinutes} min
          </dd>
        </div>
      </dl>
    ) : (
      <p className="text-sm text-muted-foreground">
        No break data yet. Complete at least one break to view analytics.
      </p>
    )}
  </div>
)

