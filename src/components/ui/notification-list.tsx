import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from '@phosphor-icons/react'

export interface NotificationItem {
  id: string
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  timestamp?: string
  read?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface NotificationListProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications: NotificationItem[]
  onDismiss?: (id: string) => void
  onNotificationClick?: (notification: NotificationItem) => void
  emptyMessage?: string
}

const notificationTypeStyles = {
  info: 'border-l-info bg-info/5',
  success: 'border-l-success bg-success/5',
  warning: 'border-l-warning bg-warning/5',
  error: 'border-l-destructive bg-destructive/5',
}

const NotificationList = React.forwardRef<HTMLDivElement, NotificationListProps>(
  (
    {
      notifications,
      onDismiss,
      onNotificationClick,
      emptyMessage = 'No notifications',
      className,
      ...props
    },
    ref
  ) => {
    if (notifications.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center justify-center p-8 text-muted-foreground',
            className
          )}
          {...props}
        >
          {emptyMessage}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'relative flex items-start gap-3 p-4 border-l-4 rounded-r-md cursor-pointer transition-colors hover:bg-muted/50',
              notificationTypeStyles[notification.type || 'info'],
              !notification.read && 'font-medium'
            )}
            onClick={() => onNotificationClick?.(notification)}
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold">{notification.title}</h4>
                {notification.timestamp && (
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {notification.timestamp}
                  </time>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              {notification.action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    notification.action?.onClick()
                  }}
                  className="text-xs font-medium text-accent hover:underline"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            {onDismiss && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDismiss(notification.id)
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            )}
            {!notification.read && (
              <div className="absolute top-4 left-0 h-2 w-2 rounded-full bg-accent -translate-x-1/2" />
            )}
          </div>
        ))}
      </div>
    )
  }
)
NotificationList.displayName = 'NotificationList'

export { NotificationList }
