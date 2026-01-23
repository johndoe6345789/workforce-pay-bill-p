import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'
import { Button } from './button'
import { EmptyState } from './empty-state'
import { LoadingSpinner } from './loading-spinner'
import { QuickPagination } from './quick-pagination'
import { SortableHeader } from './sortable-header'
import { Checkbox } from './checkbox'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  accessor?: (item: T) => any
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  getRowId?: (item: T) => string
  onRowClick?: (item: T) => void
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    itemsPerPage?: number
    totalItems?: number
  }
  className?: string
}

function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon,
  onSort,
  sortKey,
  sortDirection,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  getRowId,
  onRowClick,
  pagination,
  className
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedIds.length === data.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length

  const handleSelectAll = () => {
    if (!onSelectionChange || !getRowId) return
    
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(data.map(getRowId))
    }
  }

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return
    
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyMessage}
        description="Try adjusting your search or filters"
      />
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={someSelected ? 'opacity-50' : ''}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(column.headerClassName)}
                >
                  {column.sortable && onSort ? (
                    <SortableHeader
                      label={column.header}
                      active={sortKey === column.key}
                      direction={sortKey === column.key ? sortDirection : undefined}
                      onClick={() => {
                        const newDirection = sortKey === column.key && sortDirection === 'asc' ? 'desc' : 'asc'
                        onSort(column.key, newDirection)
                      }}
                    />
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const rowId = getRowId ? getRowId(item) : String(index)
              const isSelected = selectedIds.includes(rowId)

              return (
                <TableRow
                  key={rowId}
                  className={cn(
                    onRowClick && 'cursor-pointer',
                    isSelected && 'bg-muted/50'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectRow(rowId)}
                        aria-label={`Select row ${rowId}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(column.className)}
                    >
                      {column.render
                        ? column.render(item)
                        : column.accessor
                          ? column.accessor(item)
                          : (item as any)[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <QuickPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
          showInfo
        />
      )}
    </div>
  )
}

export { DataTable }
