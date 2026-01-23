import * as React from 'react'
import { cn } from '@/lib/utils'

const MetricCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border border-border bg-card p-6 shadow-sm',
      className
    )}
    {...props}
  />
))
MetricCard.displayName = 'MetricCard'

const MetricCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between mb-2', className)}
    {...props}
  />
))
MetricCardHeader.displayName = 'MetricCardHeader'

const MetricCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm font-medium text-muted-foreground', className)}
    {...props}
  />
))
MetricCardTitle.displayName = 'MetricCardTitle'

const MetricCardIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-muted-foreground', className)}
    {...props}
  />
))
MetricCardIcon.displayName = 'MetricCardIcon'

const MetricCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
))
MetricCardContent.displayName = 'MetricCardContent'

const MetricCardValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-3xl font-bold text-foreground', className)}
    {...props}
  />
))
MetricCardValue.displayName = 'MetricCardValue'

const MetricCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-muted-foreground mt-1', className)}
    {...props}
  />
))
MetricCardDescription.displayName = 'MetricCardDescription'

const MetricCardTrend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { trend?: 'up' | 'down' | 'neutral' }
>(({ className, trend = 'neutral', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1 text-xs font-medium mt-2',
      trend === 'up' && 'text-success',
      trend === 'down' && 'text-destructive',
      trend === 'neutral' && 'text-muted-foreground',
      className
    )}
    {...props}
  />
))
MetricCardTrend.displayName = 'MetricCardTrend'

export {
  MetricCard,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardIcon,
  MetricCardContent,
  MetricCardValue,
  MetricCardDescription,
  MetricCardTrend
}
