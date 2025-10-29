import type { ActivityEvent, ActivityTimelineBlock } from '@/types/activity'
import type { TrackingConfiguration, TrackingDayTotals } from '@/types/tracking'

import { mockApi } from '@/lib/api/mock-server'

export const TrackingService = {
  fetchDayTotals(date: string): Promise<TrackingDayTotals> {
    return mockApi.tracking.dayTotals(date)
  },
  fetchEvents(date: string): Promise<ActivityEvent[]> {
    return mockApi.tracking.events(date)
  },
  updateConfiguration(configuration: Partial<TrackingConfiguration>): Promise<TrackingConfiguration> {
    return mockApi.tracking.updateConfiguration(configuration)
  },
  logEvents(events: ActivityEvent[]): Promise<void> {
    return mockApi.tracking.logEvents(events)
  },
  fetchTimeline(date: string): Promise<ActivityTimelineBlock[]> {
    return mockApi.tracking.timeline(date)
  },
}

export default TrackingService
