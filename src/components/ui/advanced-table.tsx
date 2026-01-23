import * as React from 'react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T, index: number) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  sticky?: boolean
}

export interface AdvancedTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (row: T) => string
  className?: string
  hoverable?: boolean
  striped?: boolean
  bordered?: boolean
  compact?: boolean
  onRowClick?: (row: T, index: number) => void
  emptyMessage?: string
  loading?: boolean
  stickyHeader?: boolean
}

export function AdvancedTable<T>({
  data,
  columns,
  keyExtractor,
  className,
  hoverable = true,
  striped = false,
  bordered = true,
  compact = false,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
  stickyHeader = false
}: AdvancedTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data

    return [...data].sort((a, b) => {
      const aVal = (a as any)[sortKey]
      const bVal = (b as any)[sortKey]

      if (aVal === bVal) return 0
      
      const comparison = aVal > bVal ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortKey, sortDirection])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className={cn('w-full overflow-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead
          className={cn(
            'bg-muted/50',
            stickyHeader && 'sticky top-0 z-10 bg-muted'
          )}
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left font-semibold text-muted-foreground',
                  bordered && 'border-b border-border',
                  compact && 'px-2 py-2',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.sortable && 'cursor-pointer select-none hover:text-foreground',
                  col.sticky && 'sticky left-0 bg-muted z-20'
                )}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <svg
                      className={cn(
                        'h-4 w-4 transition-transform',
                        sortDirection === 'desc' && 'rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <tr
                key={keyExtractor(row)}
                className={cn(
                  hoverable && 'hover:bg-muted/50 transition-colors',
                  striped && index % 2 === 1 && 'bg-muted/20',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row, index)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3',
                      bordered && 'border-b border-border',
                      compact && 'px-2 py-2',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.sticky && 'sticky left-0 bg-background'
                    )}
                  >
                    {col.render ? col.render(row, index) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
