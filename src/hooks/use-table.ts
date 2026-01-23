import { useState, useMemo } from 'react'

export interface UseTableOptions<T> {
  data: T[]
  pageSize?: number
  initialSort?: {
    key: keyof T
    direction: 'asc' | 'desc'
  }
}

export function useTable<T extends Record<string, any>>({
  data,
  pageSize = 10,
  initialSort
}: UseTableOptions<T>) {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSort?.key || null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSort?.direction || 'asc')
  const [filters, setFilters] = useState<Partial<Record<keyof T, any>>>({})

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        const itemValue = item[key as keyof T]
        if (typeof value === 'string') {
          return String(itemValue).toLowerCase().includes(value.toLowerCase())
        }
        return itemValue === value
      })
    })
  }, [data, filters])

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (aVal === bVal) return 0

      let comparison = 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else {
        comparison = String(aVal).localeCompare(String(bVal))
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortKey, sortDirection])

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, page, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setPage(1)
  }

  const handleFilter = (key: keyof T, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setPage(1)
  }

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
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
    goToLastPage: () => goToPage(totalPages)
  }
}
