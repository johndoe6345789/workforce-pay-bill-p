import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Check } from '@phosphor-icons/react'

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  items: Array<{
    id: string
    title: string
    description?: string
    timestamp?: string
    isComplete?: boolean
    isActive?: boolean
  }>
}

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <ol ref={ref} className={cn('relative border-l border-border', className)} {...props}>
        {items.map((item, index) => (
          <li key={item.id} className="mb-8 ml-6">
            <div
              className={cn(
                'absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2',
                item.isComplete
                  ? 'border-success bg-success text-white'
                  : item.isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background'
              )}
            >
              {item.isComplete ? (
                <Check className="h-3.5 w-3.5" weight="bold" />
              ) : (
                <span className="text-xs font-semibold">{index + 1}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h4
                  className={cn(
                    'text-sm font-semibold',
                    item.isActive && 'text-primary'
                  )}
                >
                  {item.title}
                </h4>
                {item.timestamp && (
                  <time className="text-xs text-muted-foreground">
                    {item.timestamp}
                  </time>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    )
  }
)

Timeline.displayName = 'Timeline'
