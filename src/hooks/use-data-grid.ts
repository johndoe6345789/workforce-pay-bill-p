import { useState, useMemo, useCallback } from 'react'

export interface DataGridColumn<T> {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: number
  render?: (value: any, row: T) => React.ReactNode
}

export interface DataGridOptions<T> {
  data: T[]
  columns: DataGridColumn<T>[]
  pageSize?: number
  initialSort?: { key: string; direction: 'asc' | 'desc' }
}

export function useDataGrid<T extends Record<string, any>>(options: DataGridOptions<T>) {
  const { data, columns, pageSize = 10, initialSort } = options

  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState(initialSort || { key: '', direction: 'asc' as const })
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        const cellValue = String(row[key] || '').toLowerCase()
        return cellValue.includes(value.toLowerCase())
      })
    })
  }, [data, filters])

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal === bVal) return 0

      const comparison = aVal > bVal ? 1 : -1
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortConfig])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  const handleFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  return {
    data: paginatedData,
    totalRows: sortedData.length,
    currentPage,
    totalPages,
    setCurrentPage,
    sortConfig,
    handleSort,
    filters,
    handleFilter,
    clearFilters,
    hasFilters: Object.values(filters).some(v => v)
  }
}
