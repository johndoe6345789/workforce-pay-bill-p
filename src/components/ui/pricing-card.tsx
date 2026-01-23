import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  price: string | number
  period?: string
  description?: string
  features: string[]
  highlighted?: boolean
  cta?: {
    label: string
    onClick: () => void
  }
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      title,
      price,
      period = 'month',
      description,
      features,
      highlighted = false,
      cta,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex flex-col gap-6 rounded-lg border p-6 transition-all',
          highlighted
            ? 'border-primary bg-primary/5 shadow-lg scale-105'
            : 'border-border bg-card hover:shadow-md',
          className
        )}
        {...props}
      >
        {highlighted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            Most Popular
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-sm text-muted-foreground">/{period}</span>
        </div>

        <ul className="flex-1 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-primary">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {cta && (
          <button
            onClick={cta.onClick}
            className={cn(
              'w-full rounded-md px-4 py-2 font-medium transition-colors',
              highlighted
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {cta.label}
          </button>
        )}
      </div>
    )
  }
)
PricingCard.displayName = 'PricingCard'

export { PricingCard }
