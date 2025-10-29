import { useMemo } from 'react'

import { ActivityLog } from '@/components/dashboard/ActivityLog'
import { BreakTimer as DashboardBreakTimer } from '@/components/dashboard/BreakTimer'
import { ProjectsPanel } from '@/components/dashboard/ProjectsPanel'
import { ScoresPanel } from '@/components/dashboard/ScoresPanel'
import { TimeBreakdown } from '@/components/dashboard/TimeBreakdown'
import { Timeline } from '@/components/dashboard/Timeline'
import { WorkHoursPanel } from '@/components/dashboard/WorkHoursPanel'
import { WorkblocksTable } from '@/components/dashboard/WorkblocksTable'
import { useActivity } from '@/hooks/useActivity'
import { useBreaks } from '@/hooks/useBreaks'
import { useProductivityScore } from '@/hooks/useProductivityScore'
import { useProjects } from '@/hooks/useProjects'
import { useTracking } from '@/hooks/useTracking'
import { useWorkblocks } from '@/hooks/useWorkblocks'

const DashboardOverview = () => {
  const { trackingState, configuration, isLoading: isTrackingLoading } = useTracking()
  const { workblocks } = useWorkblocks()
  const { metrics } = useProductivityScore()
  const { events, timelineBlocks, daySummary, isLoading: isActivityLoading } = useActivity()
  const { analytics, preference, isLoading: isBreaksLoading } = useBreaks()
  const { projectSummaries } = useProjects()
  const isLoading = isTrackingLoading || isActivityLoading || isBreaksLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/40" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/40" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/40" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/40" />
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-64 animate-pulse rounded-xl border border-border bg-muted/40" />
          <div className="h-64 animate-pulse rounded-xl border border-border bg-muted/40" />
          <div className="h-64 animate-pulse rounded-xl border border-border bg-muted/40" />
        </div>
      </div>
    )
  }

  const timeBreakdownItems = useMemo(() => {
    if (!daySummary) return []
    return Object.entries(daySummary.categoryBreakdown).map(([label, seconds]) => ({
      label,
      minutes: seconds / 60,
    }))
  }, [daySummary])

  const activityEntries = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        isIdle: false,
      })),
    [events]
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Timeline
          blocks={timelineBlocks}
          now={trackingState.currentEvent?.endTime}
          onBlockClick={() => undefined}
        />
        <WorkHoursPanel
          status={trackingState.status}
          totals={trackingState.todaysTotals}
          workday={configuration.workday}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardBreakTimer
          elapsedSinceLastBreakSeconds={0}
          breakToWorkRatio={{ breaks: analytics?.breaksTaken ?? 0, workBlocks: workblocks.length || 1 }}
          preference={preference}
        />
        <ScoresPanel metrics={metrics} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ProjectsPanel summaries={projectSummaries} />
        <TimeBreakdown items={timeBreakdownItems} />
        <ActivityLog entries={activityEntries} />
      </div>

      <WorkblocksTable workblocks={workblocks} />
    </div>
  )
}

export default DashboardOverview
