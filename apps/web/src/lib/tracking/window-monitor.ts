import type { ActivityEvent } from '@/types/activity'

export interface WindowMonitorOptions {
  onActivity: (event: ActivityEvent) => void
  pollingInterval?: number
}

export class WindowMonitor {
  private intervalId: number | null = null
  private readonly options: WindowMonitorOptions

  constructor(options: WindowMonitorOptions) {
    this.options = { pollingInterval: 5000, ...options }
  }

  start() {
    if (this.intervalId !== null) return
    this.intervalId = window.setInterval(() => {
      const event: ActivityEvent = {
        id: crypto.randomUUID(),
        userId: 'local',
        capturedAt: new Date().toISOString(),
        startTime: new Date().toISOString(),
        durationSeconds: 0,
        source: 'desktop',
        application: {
          name: document.title,
          identifier: 'browser',
        },
        windowTitle: document.title,
        url: window.location.href,
        tags: [],
        category: 'focus',
      }
      this.options.onActivity(event)
    }, this.options.pollingInterval)
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}

export default WindowMonitor
