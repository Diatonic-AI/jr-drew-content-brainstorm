import { create } from 'zustand'

import type { ToastVariant } from '@/components/ui/Toast'

export interface AppNotification {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  createdAt: string
  readAt?: string
  actionLabel?: string
  actionHref?: string
}

interface NotificationStoreState {
  notifications: AppNotification[]
}

interface NotificationStoreActions {
  setAll: (notifications: AppNotification[]) => void
  push: (notification: AppNotification) => void
  markAsRead: (id: string) => void
  dismiss: (id: string) => void
  clear: () => void
}

type NotificationStore = NotificationStoreState & NotificationStoreActions

export const useNotificationStore = create<NotificationStore>()((set) => ({
  notifications: [],
  setAll: (notifications) =>
    set(() => ({ notifications: [...notifications] })),
  push: (notification) =>
    set((state) => ({
      notifications: [
        notification,
        ...state.notifications.filter((item) => item.id !== notification.id),
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, readAt: notification.readAt ?? new Date().toISOString() }
          : notification
      ),
    })),
  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
  clear: () => set(() => ({ notifications: [] })),
}))
