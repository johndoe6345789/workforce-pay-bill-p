import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { 
  addNotification as addNotificationAction, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '@/store/slices/notificationsSlice'
import type { Notification } from '@/store/slices/notificationsSlice'

export function useReduxNotifications() {
  const dispatch = useAppDispatch()
  const { notifications, unreadCount } = useAppSelector(state => state.notifications)

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    }
    dispatch(addNotificationAction(newNotification))
  }

  const markNotificationAsRead = (id: string) => {
    dispatch(markAsRead(id))
  }

  const markAllNotificationsAsRead = () => {
    dispatch(markAllAsRead())
  }

  const deleteNotificationById = (id: string) => {
    dispatch(deleteNotification(id))
  }

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification: deleteNotificationById,
  }
}
