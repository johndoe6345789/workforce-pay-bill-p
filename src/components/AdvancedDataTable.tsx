import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAdvancedTable, TableColumn } from '@/hooks/use-advanced-table'
import { useDataExport } from '@/hooks/use-data-export'
import { CaretUp, CaretDown, CaretUpDown } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'

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

export function AdvancedDataTable<T>({ data, columns, initialPageSize = 20, showSearch = true, showPagination = true, showExport = true, exportFilename = 'export', emptyMessage = 'No data available', rowKey, onRowClick, rowClassName }: AdvancedDataTableProps<T>) {
  const { items, currentPage, totalPages, pageSize, totalItems, hasNextPage, hasPreviousPage, startIndex, endIndex, state, actions, filteredCount } = useAdvancedTable(data, columns, initialPageSize)
  const { exportToCSV, exportToExcel, exportToJSON, exportToPDF } = useDataExport()

  const handleExport = (format: 'csv' | 'xlsx' | 'json' | 'pdf') => {
    try {
      const exportData = items.length > 0 ? items : data
      if (exportData.length === 0) { toast.error('No data to export'); return }
      const formattedData = exportData.map(row => {
        const out: Record<string, unknown> = {}
        columns.forEach(col => { out[col.label] = row[col.key] })
        return out
      })
      const options = { filename: exportFilename, includeHeaders: true }
      if (format === 'csv') { exportToCSV(formattedData, options); toast.success(`Exported ${formattedData.length} rows to CSV`) }
      else if (format === 'xlsx') { exportToExcel(formattedData, options); toast.success(`Exported ${formattedData.length} rows to Excel`) }
      else if (format === 'json') { exportToJSON(formattedData, options); toast.success(`Exported ${formattedData.length} rows to JSON`) }
      else if (format === 'pdf') {
        const columnHeaders = Object.fromEntries(columns.map(c => [c.label, c.label]))
        exportToPDF(formattedData, { ...options, title: `${exportFilename} Report`, columnHeaders })
        toast.success(`Exported ${formattedData.length} rows to PDF`)
      }
    } catch (error) {
      toast.error('Failed to export data')
      console.error('Export error:', error)
    }
  }

  const getSortIcon = (columnKey: keyof T) => {
    if (!state.sortConfig || state.sortConfig.key !== columnKey) return <CaretUpDown size={16} className="text-muted-foreground" />
    return state.sortConfig.direction === 'asc' ? <CaretUp size={16} className="text-primary" /> : <CaretDown size={16} className="text-primary" />
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar showSearch={showSearch} showExport={showExport} searchQuery={state.searchQuery} onSearch={actions.setSearch} onExport={handleExport} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={String(col.key)} className={col.sortable !== false ? 'cursor-pointer select-none' : ''} onClick={() => col.sortable !== false && actions.setSort(col.key)}>
                  <div className="flex items-center gap-2"><span>{col.label}</span>{col.sortable !== false && getSortIcon(col.key)}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">{emptyMessage}</TableCell></TableRow>
            ) : items.map(row => (
              <TableRow key={String(row[rowKey])} onClick={() => onRowClick?.(row)} className={`${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${rowClassName?.(row) || ''}`}>
                {columns.map(col => (
                  <TableCell key={String(col.key)}>{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalPages > 1 && (
        <DataTablePagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} startIndex={startIndex} endIndex={endIndex} filteredCount={filteredCount} totalItems={totalItems} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageSize={actions.setPageSize} onFirst={actions.goToFirstPage} onPrev={actions.goToPreviousPage} onNext={actions.goToNextPage} onLast={actions.goToLastPage} />
      )}
    </div>
  )
}
