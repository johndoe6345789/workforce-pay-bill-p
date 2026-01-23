import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PulseProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses = {
  default: 'bg-foreground',
  primary: 'bg-primary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
}

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ className, color = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative inline-flex', className)}
        {...props}
      >
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            colorClasses[color]
          )}
        />
        <span
          className={cn(
            'relative inline-flex rounded-full',
            sizeClasses[size],
            colorClasses[color]
          )}
        />
      </div>
    )
  }
)
Pulse.displayName = 'Pulse'

export { Pulse }
