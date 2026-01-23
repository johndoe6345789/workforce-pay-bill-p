import { useState, useCallback, useMemo } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig<T> {
  key: keyof T
  direction: SortDirection
}

export interface UseSortableDataReturn<T> {
  sortedData: T[]
  sortConfig: SortConfig<T> | null
  requestSort: (key: keyof T) => void
  clearSort: () => void
}

export function useSortableData<T>(
  data: T[],
  defaultConfig?: SortConfig<T>
): UseSortableDataReturn<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    defaultConfig || null
  )

  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === bValue) return 0

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })

    return sorted
  }, [data, sortConfig])

  const requestSort = useCallback(
    (key: keyof T) => {
      setSortConfig((current) => {
        if (!current || current.key !== key) {
          return { key, direction: 'asc' }
        }

        if (current.direction === 'asc') {
          return { key, direction: 'desc' }
        }

        return null
      })
    },
    []
  )

  const clearSort = useCallback(() => {
    setSortConfig(null)
  }, [])

  return {
    sortedData,
    sortConfig,
    requestSort,
    clearSort,
  }
}
