import { useMemo } from 'react'

import { ActivityLog } from '@/components/dashboard/ActivityLog'
import { Timeline as TimelineVisualization } from '@/components/dashboard/Timeline'
import { useActivity } from '@/hooks/useActivity'
import { useTracking } from '@/hooks/useTracking'

const DashboardTimelinePage = () => {
  const { timelineBlocks, events } = useActivity()
  const { trackingState } = useTracking()

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
      <TimelineVisualization
        blocks={timelineBlocks}
        now={trackingState.currentEvent?.endTime}
        onBlockClick={() => undefined}
      />
      <ActivityLog entries={activityEntries} />
    </div>
  )
}

export default DashboardTimelinePage
