import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card } from './card'

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down' | 'neutral'
  }
  icon?: React.ReactNode
  description?: string
  loading?: boolean
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, label, value, change, icon, description, loading = false, ...props }, ref) => {
    const trendColor = change?.trend === 'up' 
      ? 'text-success' 
      : change?.trend === 'down' 
        ? 'text-destructive' 
        : 'text-muted-foreground'

    const trendSign = change?.trend === 'up' ? '+' : change?.trend === 'down' ? '-' : ''

    return (
      <Card ref={ref} className={cn('p-6', className)} {...props}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">
              {label}
            </p>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-bold tracking-tight">
                {value}
              </p>
            )}
            {change && (
              <p className={cn('text-sm font-medium', trendColor)}>
                {trendSign}{Math.abs(change.value)}%
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </Card>
    )
  }
)
MetricCard.displayName = 'MetricCard'

export { MetricCard }
