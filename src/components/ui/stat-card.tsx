import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, icon, trend, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card p-6 shadow-sm',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {label}
            </p>
            <p className="text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-2">
                {description}
              </p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-success' : 'text-destructive'
                  )}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last period
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }
)

StatCard.displayName = 'StatCard'
