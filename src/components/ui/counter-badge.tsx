import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CounterBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number
  max?: number
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  className?: string
}

const variants = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  error: 'bg-destructive text-destructive-foreground'
}

export function CounterBadge({
  count,
  max = 99,
  variant = 'default',
  className,
  ...props
}: CounterBadgeProps) {
  const displayCount = count > max ? `${max}+` : count

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {displayCount}
    </span>
  )
}
