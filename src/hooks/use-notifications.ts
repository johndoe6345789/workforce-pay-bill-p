import { useKV } from '@github/spark/hooks'
import type { Notification } from '@/lib/types'

export function useNotifications() {
  const [notifications = [], setNotifications] = useKV<Notification[]>('notifications', [])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications((current) => [newNotification, ...(current || [])])
  }

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      (current || []).map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((current) =>
      (current || []).map((n) => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((current) => (current || []).filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    unreadCount
  }
}
