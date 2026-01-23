import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: string | Date
  status?: 'completed' | 'current' | 'upcoming' | 'error'
  icon?: React.ReactNode
  metadata?: Record<string, any>
}

export interface TimelineProps {
  items: TimelineItem[]
  orientation?: 'vertical' | 'horizontal'
  className?: string
  onItemClick?: (item: TimelineItem) => void
}

export function Timeline({
  items,
  orientation = 'vertical',
  className,
  onItemClick
}: TimelineProps) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      className={cn(
        'relative',
        isVertical ? 'space-y-8' : 'flex gap-8 overflow-x-auto pb-4',
        className
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const timestamp = typeof item.timestamp === 'string' 
          ? item.timestamp 
          : item.timestamp.toLocaleString()

        return (
          <div
            key={item.id}
            className={cn(
              'relative flex gap-4',
              isVertical ? 'flex-row' : 'flex-col min-w-[200px]',
              onItemClick && 'cursor-pointer hover:opacity-80 transition-opacity'
            )}
            onClick={() => onItemClick?.(item)}
          >
            <div className={cn(
              'relative flex',
              isVertical ? 'flex-col items-center' : 'flex-row items-center justify-center'
            )}>
              <div
                className={cn(
                  'z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background',
                  item.status === 'completed' && 'border-success bg-success text-success-foreground',
                  item.status === 'current' && 'border-accent bg-accent text-accent-foreground',
                  item.status === 'upcoming' && 'border-muted-foreground bg-muted text-muted-foreground',
                  item.status === 'error' && 'border-destructive bg-destructive text-destructive-foreground',
                  !item.status && 'border-primary bg-primary text-primary-foreground'
                )}
              >
                {item.icon || (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {!isLast && (
                <div
                  className={cn(
                    'bg-border',
                    isVertical
                      ? 'absolute top-10 h-full w-0.5 left-1/2 -translate-x-1/2'
                      : 'h-0.5 w-full'
                  )}
                />
              )}
            </div>

            <div className={cn(
              'flex-1',
              isVertical ? 'pb-8' : 'pt-4'
            )}>
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <time className="text-xs text-muted-foreground whitespace-nowrap">
                  {timestamp}
                </time>
              </div>
              
              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}

              {item.metadata && Object.keys(item.metadata).length > 0 && (
                <div className="mt-2 space-y-1">
                  {Object.entries(item.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
