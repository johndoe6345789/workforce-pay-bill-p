import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function FilterBar({ children, className, ...props }: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface FilterGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  children: React.ReactNode
}

export function FilterGroup({ label, children, className, ...props }: FilterGroupProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
      )}
      {children}
    </div>
  )
}
