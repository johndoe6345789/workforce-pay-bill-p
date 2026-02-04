import { ReactNode } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdvancedTable, TableColumn } from '@/hooks/use-advanced-table'
import { CaretUp, CaretDown, CaretUpDown, MagnifyingGlass } from '@phosphor-icons/react'

interface AdvancedDataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  initialPageSize?: number
  showSearch?: boolean
  showPagination?: boolean
  emptyMessage?: string
  rowKey: keyof T
  onRowClick?: (row: T) => void
  rowClassName?: (row: T) => string
}

export function AdvancedDataTable<T>({
  data,
  columns,
  initialPageSize = 20,
  showSearch = true,
  showPagination = true,
  emptyMessage = 'No data available',
  rowKey,
  onRowClick,
  rowClassName,
}: AdvancedDataTableProps<T>) {
  const {
    items,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    state,
    actions,
    filteredCount,
  } = useAdvancedTable(data, columns, initialPageSize)

  const getSortIcon = (columnKey: keyof T) => {
    if (!state.sortConfig || state.sortConfig.key !== columnKey) {
      return <CaretUpDown size={16} className="text-muted-foreground" />
    }
    
    return state.sortConfig.direction === 'asc' 
      ? <CaretUp size={16} className="text-primary" />
      : <CaretDown size={16} className="text-primary" />
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {state.searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => actions.setSearch('')}
              size="sm"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)}
                  className={column.sortable !== false ? 'cursor-pointer select-none' : ''}
                  onClick={() => column.sortable !== false && actions.setSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow
                  key={String(row[rowKey])}
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${rowClassName?.(row) || ''}`}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {filteredCount} 
            {filteredCount !== totalItems && ` (filtered from ${totalItems})`}
          </div>

          <div className="flex items-center gap-2">
            <Select 
              value={String(pageSize)} 
              onValueChange={(value) => actions.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={actions.goToFirstPage}
                disabled={!hasPreviousPage}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={actions.goToPreviousPage}
                disabled={!hasPreviousPage}
              >
                Previous
              </Button>
              <div className="px-3 text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={actions.goToNextPage}
                disabled={!hasNextPage}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={actions.goToLastPage}
                disabled={!hasNextPage}
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
