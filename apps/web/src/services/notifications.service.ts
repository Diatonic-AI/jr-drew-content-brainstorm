import type { AppNotification } from '@/stores/notificationStore'

import { mockApi } from '@/lib/api/mock-server'

export const NotificationsService = {
  list(): Promise<AppNotification[]> {
    return mockApi.notifications.list()
  },
}

export default NotificationsService
