import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
  breadcrumbs?: React.ReactNode
  backButton?: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, breadcrumbs, backButton, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-4 pb-6 border-b border-border', className)}
        {...props}
      >
        {breadcrumbs && (
          <div className="text-sm text-muted-foreground">
            {breadcrumbs}
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3">
              {backButton}
              <h1 className="text-3xl font-bold tracking-tight">
                {title}
              </h1>
            </div>
            {description && (
              <p className="text-muted-foreground text-lg">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    )
  }
)
PageHeader.displayName = 'PageHeader'

export { PageHeader }
