import type { ProjectSummary } from '@/types/projects'

export interface ProjectsPanelProps {
  summaries: ProjectSummary[]
}

export const ProjectsPanel = ({ summaries }: ProjectsPanelProps) => {
  if (!summaries.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        No project data available yet.
      </div>
    )
  }

  const maxMinutes = Math.max(
    ...summaries.map((summary) => summary.allocation.totalTrackedMinutes),
    1
  )

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Projects</h3>
        <span className="text-xs text-muted-foreground">{summaries.length} active</span>
      </header>

      <ul className="space-y-3">
        {summaries.map((summary) => {
          const { project, allocation } = summary
          const percent = Math.round(allocation.percentage * 100) / 100
          const totalMinutes = allocation.totalTrackedMinutes
          const hours = Math.floor(totalMinutes / 60)
          const minutes = totalMinutes % 60
          const barWidth = Math.max(
            4,
            Math.round((totalMinutes / maxMinutes) * 100)
          )

          return (
            <li key={project.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm font-medium text-foreground">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: project.color ?? '#6366f1' }}
                  />
                  {project.name}
                </span>
                <span className="text-xs text-muted-foreground">{percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${barWidth}%`,
                    background: project.color ?? undefined,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {hours}h {minutes.toString().padStart(2, '0')}m tracked ·{' '}
                {summary.health?.find((metric) => metric.name === 'On Track')?.status ??
                  'Unknown'}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

