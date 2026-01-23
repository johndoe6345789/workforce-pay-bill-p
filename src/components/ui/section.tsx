import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  action?: React.ReactNode
  noPadding?: boolean
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, title, description, action, noPadding = false, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('space-y-6', !noPadding && 'py-6', className)}
        {...props}
      >
        {(title || description || action) && (
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {title && (
                <h2 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        )}
        {children}
      </section>
    )
  }
)
Section.displayName = 'Section'

export { Section }
