import { mockApi } from '@/lib/api/mock-server'
import type { AppNotification } from '@/stores/notificationStore'


export const NotificationsService = {
  list(): Promise<AppNotification[]> {
    return mockApi.notifications.list()
  },
}

export default NotificationsService
