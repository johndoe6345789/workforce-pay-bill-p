import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ActivityLogEntry {
  id: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  action: string
  description: string
  icon?: React.ReactNode
  metadata?: Record<string, any>
}

export interface ActivityLogProps extends React.HTMLAttributes<HTMLDivElement> {
  entries: ActivityLogEntry[]
  emptyMessage?: string
}

const ActivityLog = React.forwardRef<HTMLDivElement, ActivityLogProps>(
  ({ entries, emptyMessage = 'No activity yet', className, ...props }, ref) => {
    if (entries.length === 0) {
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
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={cn('relative flex gap-4', index !== entries.length - 1 && 'pb-4')}
          >
            {index !== entries.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
            )}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted border-2 border-background">
              {entry.icon || (
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {entry.user && (
                  <span className="text-sm font-medium">{entry.user.name}</span>
                )}
                <span className="text-sm text-muted-foreground">{entry.action}</span>
                <time className="text-xs text-muted-foreground ml-auto">
                  {entry.timestamp}
                </time>
              </div>

              <p className="text-sm text-muted-foreground">{entry.description}</p>

              {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                <div className="mt-2 rounded-md bg-muted p-2 text-xs space-y-1">
                  {Object.entries(entry.metadata).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <span className="text-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }
)
ActivityLog.displayName = 'ActivityLog'

export { ActivityLog }
