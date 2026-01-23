import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export function Stat({ label, value, change, trend, icon, className, ...props }: StatProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-border bg-card p-4',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        {change !== undefined && (
          <span
            className={cn(
              'text-sm font-medium',
              trend === 'up' && 'text-success',
              trend === 'down' && 'text-destructive',
              trend === 'neutral' && 'text-muted-foreground'
            )}
          >
            {change > 0 ? '+' : ''}
            {change}%
          </span>
        )}
      </div>
    </div>
  )
}
