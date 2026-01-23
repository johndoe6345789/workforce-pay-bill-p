import * as React from 'react'
import { cn } from '@/lib/utils'

export type StatusType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'
  | 'pending'
  | 'approved'
  | 'rejected'

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType
  label?: string
  pulse?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  info: 'bg-info',
  default: 'bg-muted-foreground',
  pending: 'bg-warning',
  approved: 'bg-success',
  rejected: 'bg-destructive',
}

const sizeStyles = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ status, label, pulse = false, size = 'md', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-2', className)}
        {...props}
      >
        <div className="relative">
          <div
            className={cn(
              'rounded-full',
              statusStyles[status],
              sizeStyles[size]
            )}
          />
          {pulse && (
            <div
              className={cn(
                'absolute inset-0 rounded-full animate-ping opacity-75',
                statusStyles[status],
                sizeStyles[size]
              )}
            />
          )}
        </div>
        {label && <span className="text-sm">{label}</span>}
      </div>
    )
  }
)
StatusIndicator.displayName = 'StatusIndicator'

export { StatusIndicator }
