import { useState, useMemo, useCallback } from 'react'
import { TableColumn } from './use-advanced-table.types'

export function useTableFilter<T>(data: T[], columns: TableColumn<T>[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Partial<Record<keyof T, unknown>>>({})

  const searchableKeys = useMemo(
    () => columns.filter(col => col.filterable !== false).map(col => col.key),
    [columns]
  )

  const searchFiltered = useMemo(() => {
    if (!searchQuery) return data
    const query = searchQuery.toLowerCase()
    return data.filter(item =>
      searchableKeys.some(key =>
        String(item[key]).toLowerCase().includes(query)
      )
    )
  }, [data, searchQuery, searchableKeys])

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return searchFiltered
    return searchFiltered.filter(item =>
      Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '') return true
        const itemValue = item[key as keyof T]
        if (Array.isArray(value)) return value.includes(itemValue)
        return itemValue === value
      })
    )
  }, [searchFiltered, filters])

  const handleSetFilter = useCallback(
    (key: keyof T, value: unknown) => {
      setFilters(prev => ({ ...prev, [key]: value }))
    },
    []
  )

  const handleClearFilters = useCallback(() => {
    setFilters({})
    setSearchQuery('')
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    filters,
    filteredData,
    searchFilteredCount: searchFiltered.length,
    handleSetFilter,
    handleClearFilters
  }
}
