export interface TimeBreakdownItem {
  label: string
  minutes: number
  color?: string
}

export interface TimeBreakdownProps {
  items: TimeBreakdownItem[]
  totalMinutes?: number
}

export const TimeBreakdown = ({ items, totalMinutes }: TimeBreakdownProps) => {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        No time breakdown available.
      </div>
    )
  }

  const total =
    (totalMinutes ?? items.reduce((sum, item) => sum + item.minutes, 0)) || 1

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <header>
        <h3 className="text-sm font-semibold text-foreground">Time Breakdown</h3>
      </header>

      <ul className="space-y-3">
        {items.map((item) => {
          const percent = Math.round((item.minutes / total) * 100)
          return (
            <li key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: item.color ?? '#6366f1' }}
                  />
                  {item.label}
                </div>
                <span className="text-xs text-muted-foreground">
                  {percent}% · {Math.round(item.minutes)} min
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.max(percent, 2)}%`,
                    background: item.color ?? undefined,
                  }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
