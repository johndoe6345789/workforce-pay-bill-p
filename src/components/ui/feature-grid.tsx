import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  features: Feature[]
  columns?: 2 | 3 | 4
}

export interface Feature {
  icon?: React.ReactNode
  title: string
  description: string
}

const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

const FeatureGrid = React.forwardRef<HTMLDivElement, FeatureGridProps>(
  ({ className, features, columns = 3, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('grid gap-6', columnClasses[columns], className)}
        {...props}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/50"
          >
            {feature.icon && (
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {feature.icon}
              </div>
            )}
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    )
  }
)
FeatureGrid.displayName = 'FeatureGrid'

export { FeatureGrid }
