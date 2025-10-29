import { ScoresPanel } from '@/components/dashboard/ScoresPanel'
import { TimeBreakdown } from '@/components/dashboard/TimeBreakdown'
import { useActivity } from '@/hooks/useActivity'
import { useProductivityScore } from '@/hooks/useProductivityScore'

const DashboardAnalyticsPage = () => {
  const { metrics } = useProductivityScore()
  const { daySummary } = useActivity()

  const items = daySummary
    ? Object.entries(daySummary.categoryBreakdown).map(([label, seconds]) => ({
        label,
        minutes: seconds / 60,
      }))
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ScoresPanel metrics={metrics} />
      <TimeBreakdown items={items} />
    </div>
  )
}

export default DashboardAnalyticsPage
