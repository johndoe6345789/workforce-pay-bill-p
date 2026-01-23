import * as React from 'react'
import { cn } from '@/lib/utils'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
  responsive?: boolean
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 4, responsive = true, children, ...props }, ref) => {
    const gridColsClass = responsive 
      ? `grid-cols-1 ${cols >= 2 ? 'sm:grid-cols-2' : ''} ${cols >= 3 ? 'md:grid-cols-3' : ''} ${cols === 4 ? 'lg:grid-cols-4' : ''} ${cols >= 5 ? `lg:grid-cols-${cols}` : ''}`
      : `grid-cols-${cols}`

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          gridColsClass,
          `gap-${gap}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Grid.displayName = 'Grid'

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full'
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'full'
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan, rowSpan, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          colSpan && (colSpan === 'full' ? 'col-span-full' : `col-span-${colSpan}`),
          rowSpan && (rowSpan === 'full' ? 'row-span-full' : `row-span-${rowSpan}`),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GridItem.displayName = 'GridItem'

export { Grid, GridItem }
