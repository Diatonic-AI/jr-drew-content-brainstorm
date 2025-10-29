import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'

import { showToast } from '@/components/ui/Toast'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationsService } from '@/services/notifications.service'

export const useNotifications = () => {
  const { notifications, push, markAsRead, dismiss, clear, setAll } = useNotificationStore()

  const { isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: NotificationsService.list,
    staleTime: 60 * 1000,
    onSuccess: (items) => setAll(items),
  })

  const triggerToast = useCallback(
    (message: string, description?: string) => {
      showToast({ title: message, description })
    },
    []
  )

  return {
    notifications,
    pushNotification: push,
    markAsRead,
    dismiss,
    clear,
    triggerToast,
    isLoading,
  }
}
