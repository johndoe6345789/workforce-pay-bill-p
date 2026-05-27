import { useState, useCallback } from 'react'
import { usePagination } from './use-pagination-advanced'
import { useSortAdvanced, SortConfig } from './use-sort-advanced'
import { useTableFilter } from './use-table-filter'
import {
  TableColumn, TableState, TableActions, UseAdvancedTableResult
} from './use-advanced-table.types'

export type {
  TableColumn, TableState, TableActions, UseAdvancedTableResult
} from './use-advanced-table.types'
export { SortConfig, SortDirection } from './use-sort-advanced'

export function useAdvancedTable<T>(
  data: T[],
  columns: TableColumn<T>[],
  initialPageSize: number = 20
): UseAdvancedTableResult<T> {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null)

  const {
    searchQuery, setSearchQuery, filteredData,
    handleSetFilter: applyFilter, handleClearFilters: applyClears, filters
  } = useTableFilter<T>(data, columns)

  const sortedData = useSortAdvanced(filteredData, sortConfig)
  const pg = usePagination(sortedData, page, pageSize)

  const handleSetSort = useCallback((key: keyof T) => {
    setSortConfig(prev => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
    setPage(1)
  }, [])

  const handleSetFilter = useCallback(
    (key: keyof T, value: unknown) => { applyFilter(key, value); setPage(1) },
    [applyFilter]
  )
  const handleClearFilters = useCallback(() => { applyClears(); setPage(1) }, [applyClears])
  const handleResetTable = useCallback(() => {
    setPage(1); setPageSize(initialPageSize); setSortConfig(null)
    setSearchQuery(''); applyClears()
  }, [initialPageSize, setSearchQuery, applyClears])
  const handleSetSearch = useCallback((q: string) => { setSearchQuery(q); setPage(1) }, [setSearchQuery])
  const handleSetPageSize = useCallback((s: number) => { setPageSize(s); setPage(1) }, [])

  const goToFirstPage = useCallback(() => setPage(1), [])
  const goToLastPage = useCallback(() => setPage(pg.totalPages), [pg.totalPages])
  const goToNextPage = useCallback(() => { if (pg.hasNextPage) setPage(p => p + 1) }, [pg.hasNextPage])
  const goToPreviousPage = useCallback(() => { if (pg.hasPreviousPage) setPage(p => p - 1) }, [pg.hasPreviousPage])

  return {
    ...pg,
    state: { page, pageSize, sortConfig, searchQuery, filters },
    actions: {
      setPage, setPageSize: handleSetPageSize, setSort: handleSetSort,
      setSearch: handleSetSearch, setFilter: handleSetFilter,
      clearFilters: handleClearFilters, resetTable: handleResetTable,
      goToFirstPage, goToLastPage, goToNextPage, goToPreviousPage
    },
    filteredCount: filteredData.length,
    sortedCount: sortedData.length
  }
}
