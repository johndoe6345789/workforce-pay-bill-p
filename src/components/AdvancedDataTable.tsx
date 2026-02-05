import { ReactNode } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAdvancedTable, TableColumn } from '@/hooks/use-advanced-table'
import { useDataExport } from '@/hooks/use-data-export'
import { CaretUp, CaretDown, CaretUpDown, MagnifyingGlass, Export, FileCsv, FileXls, FileCode } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AdvancedDataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  initialPageSize?: number
  showSearch?: boolean
  showPagination?: boolean
  showExport?: boolean
  exportFilename?: string
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
  showExport = true,
  exportFilename = 'export',
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

  const { exportToCSV, exportToExcel, exportToJSON } = useDataExport()

  const handleExport = (format: 'csv' | 'xlsx' | 'json') => {
    try {
      const exportData = items.length > 0 ? items : data
      
      if (exportData.length === 0) {
        toast.error('No data to export')
        return
      }

      const exportColumns = columns.map(col => String(col.key))
      const formattedData = exportData.map(row => {
        const formattedRow: any = {}
        columns.forEach(col => {
          const key = String(col.key)
          const value = row[col.key]
          formattedRow[col.label] = value
        })
        return formattedRow
      })

      const options = {
        filename: exportFilename,
        includeHeaders: true,
      }

      if (format === 'csv') {
        exportToCSV(formattedData, options)
        toast.success(`Exported ${formattedData.length} rows to CSV`)
      } else if (format === 'xlsx') {
        exportToExcel(formattedData, options)
        toast.success(`Exported ${formattedData.length} rows to Excel`)
      } else if (format === 'json') {
        exportToJSON(formattedData, options)
        toast.success(`Exported ${formattedData.length} rows to JSON`)
      }
    } catch (error) {
      toast.error('Failed to export data')
      console.error('Export error:', error)
    }
  }

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
      {(showSearch || showExport) && (
        <div className="flex items-center gap-4">
          {showSearch && (
            <>
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
            </>
          )}

          {showExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Export className="mr-2" size={18} />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileCsv className="mr-2" size={18} />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                  <FileXls className="mr-2" size={18} />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <FileCode className="mr-2" size={18} />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
