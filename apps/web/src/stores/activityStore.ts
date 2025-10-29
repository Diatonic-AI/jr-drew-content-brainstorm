import { create } from 'zustand'

import type {
  ActivityAnomaly,
  ActivityDaySummary,
  ActivityEvent,
  ActivityFilterOptions,
  ActivityTimelineBlock,
} from '@/types/activity'

interface ActivityStoreState {
  events: ActivityEvent[]
  timelineBlocks: ActivityTimelineBlock[]
  daySummary?: ActivityDaySummary
  filters: ActivityFilterOptions
  anomalies: ActivityAnomaly[]
  isLoading: boolean
  selectedDate: string
}

interface ActivityStoreActions {
  setEvents: (events: ActivityEvent[]) => void
  addEvent: (event: ActivityEvent) => void
  setTimelineBlocks: (blocks: ActivityTimelineBlock[]) => void
  setDaySummary: (summary: ActivityDaySummary) => void
  setFilters: (filters: ActivityFilterOptions) => void
  setSelectedDate: (date: string) => void
  setLoading: (loading: boolean) => void
  upsertAnomaly: (anomaly: ActivityAnomaly) => void
  resolveAnomaly: (anomalyId: string) => void
  reset: () => void
}

type ActivityStore = ActivityStoreState & ActivityStoreActions

const defaultFilters: ActivityFilterOptions = {
  includeIdle: true,
}

export const useActivityStore = create<ActivityStore>()((set, get) => ({
  events: [],
  timelineBlocks: [],
  daySummary: undefined,
  filters: defaultFilters,
  anomalies: [],
  isLoading: false,
  selectedDate: new Date().toISOString().slice(0, 10),
  setEvents: (events) => set(() => ({ events })),
  addEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events.filter((existing) => existing.id !== event.id),
        event,
      ].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      ),
      daySummary: state.daySummary
        ? {
            ...state.daySummary,
            totalTrackedSeconds: state.daySummary.totalTrackedSeconds + event.durationSeconds,
          }
        : state.daySummary,
    })),
  setTimelineBlocks: (blocks) => set(() => ({ timelineBlocks: blocks })),
  setDaySummary: (summary) => set(() => ({ daySummary: summary })),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  setSelectedDate: (date) => set(() => ({ selectedDate: date })),
  setLoading: (loading) => set(() => ({ isLoading: loading })),
  upsertAnomaly: (anomaly) =>
    set((state) => ({
      anomalies: [
        ...state.anomalies.filter((existing) => existing.id !== anomaly.id),
        anomaly,
      ],
    })),
  resolveAnomaly: (anomalyId) =>
    set((state) => ({
      anomalies: state.anomalies.map((anomaly) =>
        anomaly.id === anomalyId ? { ...anomaly, resolved: true } : anomaly
      ),
    })),
  reset: () =>
    set(() => ({
      events: [],
      timelineBlocks: [],
      daySummary: undefined,
      filters: defaultFilters,
      anomalies: [],
      isLoading: false,
      selectedDate: new Date().toISOString().slice(0, 10),
    })),
}))

