import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TimelineItemProps {
  date: string
  title: string
  description?: string
  icon?: React.ReactNode
  status?: 'completed' | 'current' | 'upcoming'
  children?: React.ReactNode
}

export interface TimelineProps {
  items: TimelineItemProps[]
  className?: string
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ items, className }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-8', className)}>
        {items.map((item, index) => (
          <TimelineItem key={index} {...item} isLast={index === items.length - 1} />
        ))}
      </div>
    )
  }
)
Timeline.displayName = 'Timeline'

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  TimelineItemProps & { isLast?: boolean }
>(({ date, title, description, icon, status = 'upcoming', children, isLast }, ref) => {
  const statusStyles = {
    completed: 'bg-success border-success',
    current: 'bg-accent border-accent',
    upcoming: 'bg-muted border-border',
  }

  const lineStyles = {
    completed: 'bg-success',
    current: 'bg-accent',
    upcoming: 'bg-border',
  }

  return (
    <div ref={ref} className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border-2',
            statusStyles[status]
          )}
        >
          {icon || (
            <div
              className={cn(
                'h-3 w-3 rounded-full',
                status === 'completed' ? 'bg-success-foreground' : '',
                status === 'current' ? 'bg-accent-foreground' : '',
                status === 'upcoming' ? 'bg-muted-foreground/30' : ''
              )}
            />
          )}
        </div>
        {!isLast && (
          <div
            className={cn('mt-2 h-full w-0.5', lineStyles[status])}
            style={{ minHeight: '3rem' }}
          />
        )}
      </div>

      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-1">
          <time className="text-sm text-muted-foreground font-mono">{date}</time>
        </div>
        <h4 className="font-semibold mb-1">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
        )}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  )
})
TimelineItem.displayName = 'TimelineItem'

export { Timeline, TimelineItem }
