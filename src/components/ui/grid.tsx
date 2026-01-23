import * as React from 'react'
import { cn } from '@/lib/utils'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function Grid({
  children,
  cols = 1,
  gap = 'md',
  className,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        cols === 1 && 'grid-cols-1',
        cols === 2 && 'grid-cols-1 md:grid-cols-2',
        cols === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        cols === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        cols === 5 && 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
        cols === 6 && 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
        gap === 'none' && 'gap-0',
        gap === 'sm' && 'gap-2',
        gap === 'md' && 'gap-4',
        gap === 'lg' && 'gap-6',
        gap === 'xl' && 'gap-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
