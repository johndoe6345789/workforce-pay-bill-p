import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, Warning, Info } from '@phosphor-icons/react'

export interface StatusBadgeProps extends HTMLAttributes<HTMLDivElement> {
  status: 'success' | 'error' | 'warning' | 'info' | 'pending' | 'neutral'
  label: string
  showIcon?: boolean
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20'
  },
  error: {
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20'
  },
  warning: {
    icon: Warning,
    className: 'bg-warning/10 text-warning border-warning/20'
  },
  info: {
    icon: Info,
    className: 'bg-info/10 text-info border-info/20'
  },
  pending: {
    icon: Warning,
    className: 'bg-muted text-muted-foreground border-border'
  },
  neutral: {
    icon: Info,
    className: 'bg-secondary text-secondary-foreground border-border'
  }
}

export const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, label, showIcon = true, ...props }, ref) => {
    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border',
          config.className,
          className
        )}
        {...props}
      >
        {showIcon && <Icon className="h-3.5 w-3.5" />}
        <span>{label}</span>
      </div>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'
