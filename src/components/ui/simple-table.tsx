import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: keyof T | string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
  sortable?: boolean
}

export interface SimpleTableProps<T> extends React.HTMLAttributes<HTMLTableElement> {
  data: T[]
  columns: DataTableColumn<T>[]
  onRowClick?: (row: T, index: number) => void
  emptyMessage?: string
  striped?: boolean
  hoverable?: boolean
}

function SimpleTableInner<T>(
  {
    data,
    columns,
    onRowClick,
    emptyMessage = 'No data available',
    striped = true,
    hoverable = true,
    className,
    ...props
  }: SimpleTableProps<T>,
  ref: React.ForwardedRef<HTMLTableElement>
) {
  const getCellValue = (row: T, column: DataTableColumn<T>) => {
    if (typeof column.key === 'string' && column.key.includes('.')) {
      const keys = column.key.split('.')
      let value: any = row
      for (const key of keys) {
        value = value?.[key]
      }
      return value
    }
    return row[column.key as keyof T]
  }

  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      >
        <thead className="border-b bg-muted/50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={String(column.key) || index}
                className={cn(
                  'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row, rowIndex)}
                className={cn(
                  'border-b transition-colors',
                  striped && rowIndex % 2 === 0 && 'bg-muted/20',
                  hoverable && onRowClick && 'cursor-pointer hover:bg-muted/50',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((column, colIndex) => {
                  const value = getCellValue(row, column)
                  const rendered = column.render
                    ? column.render(value, row, rowIndex)
                    : value

                  return (
                    <td
                      key={String(column.key) || colIndex}
                      className={cn(
                        'p-4 align-middle',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {rendered}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export const SimpleTable = React.forwardRef(SimpleTableInner) as <T>(
  props: SimpleTableProps<T> & { ref?: React.ForwardedRef<HTMLTableElement> }
) => React.ReactElement
