import { useState, useMemo, useCallback } from 'react'
import { usePagination, PaginationResult } from './use-pagination-advanced'
import { useSortAdvanced, SortConfig, SortDirection } from './use-sort-advanced'

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface TableState<T> {
  page: number
  pageSize: number
  sortConfig: SortConfig<T> | null
  searchQuery: string
  filters: Partial<Record<keyof T, any>>
}

export interface TableActions<T> {
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSort: (key: keyof T) => void
  setSearch: (query: string) => void
  setFilter: (key: keyof T, value: any) => void
  clearFilters: () => void
  resetTable: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void
}

export interface UseAdvancedTableResult<T> extends PaginationResult<T> {
  state: TableState<T>
  actions: TableActions<T>
  filteredCount: number
  sortedCount: number
}

export function useAdvancedTable<T>(
  data: T[],
  columns: TableColumn<T>[],
  initialPageSize: number = 20
): UseAdvancedTableResult<T> {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Partial<Record<keyof T, any>>>({})

  const searchableKeys = useMemo(() => 
    columns.filter(col => col.filterable !== false).map(col => col.key),
    [columns]
  )

  const filteredData = useMemo(() => {
    if (!searchQuery) return data

    const query = searchQuery.toLowerCase()
    return data.filter(item => 
      searchableKeys.some(key => {
        const value = item[key]
        return String(value).toLowerCase().includes(query)
      })
    )
  }, [data, searchQuery, searchableKeys])

  const filteredByFilters = useMemo(() => {
    if (Object.keys(filters).length === 0) return filteredData

    return filteredData.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '') return true
        
        const itemValue = item[key as keyof T]
        
        if (Array.isArray(value)) {
          return value.includes(itemValue)
        }
        
        return itemValue === value
      })
    })
  }, [filteredData, filters])

  const sortedData = useSortAdvanced(filteredByFilters, sortConfig)

  const paginationResult = usePagination(sortedData, page, pageSize)

  const handleSetSort = useCallback((key: keyof T) => {
    setSortConfig(prev => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'asc' }
      }
      
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      
      return null
    })
    setPage(1)
  }, [])

  const handleSetFilter = useCallback((key: keyof T, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
    setPage(1)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({})
    setSearchQuery('')
    setPage(1)
  }, [])

  const handleResetTable = useCallback(() => {
    setPage(1)
    setPageSize(initialPageSize)
    setSortConfig(null)
    setSearchQuery('')
    setFilters({})
  }, [initialPageSize])

  const handleSetSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setPage(1)
  }, [])

  const handleSetPageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }, [])

  const goToFirstPage = useCallback(() => setPage(1), [])
  const goToLastPage = useCallback(() => setPage(paginationResult.totalPages), [paginationResult.totalPages])
  const goToNextPage = useCallback(() => {
    if (paginationResult.hasNextPage) {
      setPage(p => p + 1)
    }
  }, [paginationResult.hasNextPage])
  const goToPreviousPage = useCallback(() => {
    if (paginationResult.hasPreviousPage) {
      setPage(p => p - 1)
    }
  }, [paginationResult.hasPreviousPage])

  return {
    ...paginationResult,
    state: {
      page,
      pageSize,
      sortConfig,
      searchQuery,
      filters,
    },
    actions: {
      setPage,
      setPageSize: handleSetPageSize,
      setSort: handleSetSort,
      setSearch: handleSetSearch,
      setFilter: handleSetFilter,
      clearFilters: handleClearFilters,
      resetTable: handleResetTable,
      goToFirstPage,
      goToLastPage,
      goToNextPage,
      goToPreviousPage,
    },
    filteredCount: filteredByFilters.length,
    sortedCount: sortedData.length,
  }
}
