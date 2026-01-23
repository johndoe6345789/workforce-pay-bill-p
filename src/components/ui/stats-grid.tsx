import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ children, columns = 3, className, ...props }: StatsGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
