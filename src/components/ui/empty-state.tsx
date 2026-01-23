import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-16 px-4 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 text-muted-foreground opacity-50">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'
