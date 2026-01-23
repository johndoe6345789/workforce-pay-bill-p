import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DataGridProps {
  children: React.ReactNode
  className?: string
}

const DataGrid = React.forwardRef<HTMLDivElement, DataGridProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full overflow-auto', className)}
        {...props}
      >
        <table className="w-full border-collapse">
          {children}
        </table>
      </div>
    )
  }
)
DataGrid.displayName = 'DataGrid'

const DataGridHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('border-b border-border', className)} {...props} />
))
DataGridHeader.displayName = 'DataGridHeader'

const DataGridBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props} />
))
DataGridBody.displayName = 'DataGridBody'

const DataGridRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border transition-colors hover:bg-muted/50',
      selected && 'bg-accent/10',
      className
    )}
    {...props}
  />
))
DataGridRow.displayName = 'DataGridRow'

const DataGridHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { sortable?: boolean }
>(({ className, sortable, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm',
      sortable && 'cursor-pointer hover:text-foreground',
      className
    )}
    {...props}
  />
))
DataGridHead.displayName = 'DataGridHead'

const DataGridCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle text-sm', className)}
    {...props}
  />
))
DataGridCell.displayName = 'DataGridCell'

export { DataGrid, DataGridHeader, DataGridBody, DataGridRow, DataGridHead, DataGridCell }
