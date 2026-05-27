import { useState } from 'react'
import { useTableFilter, useTableSort, useTablePaginate } from './use-table-core'
import type { UseTableOptions } from './use-table.types'

export type { UseTableOptions } from './use-table.types'

export function useTable<T extends Record<string, unknown>>({
  data,
  pageSize = 10,
  initialSort,
}: UseTableOptions<T>) {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSort?.key || null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSort?.direction || 'asc')
  const [filters, setFilters] = useState<Partial<Record<keyof T, unknown>>>({})

  const filteredData = useTableFilter(data, filters)
  const sortedData = useTableSort(filteredData, sortKey, sortDirection)
  const { paginatedData, totalPages } = useTablePaginate(sortedData, page, pageSize)

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setPage(1)
  }

  const handleFilter = (key: keyof T, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setPage(1)
  }

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
  }

  return {
    data: paginatedData,
    page,
    totalPages,
    totalItems: sortedData.length,
    pageSize,
    sortKey,
    sortDirection,
    filters,
    handleSort,
    handleFilter,
    clearFilters,
    goToPage,
    nextPage: () => goToPage(page + 1),
    prevPage: () => goToPage(page - 1),
    goToFirstPage: () => goToPage(1),
    goToLastPage: () => goToPage(totalPages),
  }
}
