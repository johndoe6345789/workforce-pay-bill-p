import { useMemo } from 'react'

export type SortDirection = 'asc' | 'desc' | null

export interface SortConfig<T> {
  key: keyof T
  direction: SortDirection
}

export function useSortAdvanced<T>(
  data: T[],
  sortConfig: SortConfig<T> | null
): T[] {
  return useMemo(() => {
    if (!sortConfig || !sortConfig.direction) {
      return data
    }

    const { key, direction } = sortConfig
    
    const sortedData = [...data].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]

      if (aVal === bVal) return 0

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return direction === 'asc' 
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime()
      }

      return direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })

    return sortedData
  }, [data, sortConfig])
}

export interface MultiSortConfig<T> {
  key: keyof T
  direction: 'asc' | 'desc'
}

export function useMultiSort<T>(
  data: T[],
  sortConfigs: MultiSortConfig<T>[]
): T[] {
  return useMemo(() => {
    if (!sortConfigs.length) {
      return data
    }

    return [...data].sort((a, b) => {
      for (const config of sortConfigs) {
        const { key, direction } = config
        const aVal = a[key]
        const bVal = b[key]

        if (aVal === bVal) continue

        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const comparison = aVal.localeCompare(bVal)
          if (comparison !== 0) {
            return direction === 'asc' ? comparison : -comparison
          }
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          if (aVal !== bVal) {
            return direction === 'asc' ? aVal - bVal : bVal - aVal
          }
        } else if (aVal instanceof Date && bVal instanceof Date) {
          const comparison = aVal.getTime() - bVal.getTime()
          if (comparison !== 0) {
            return direction === 'asc' ? comparison : -comparison
          }
        } else {
          const comparison = String(aVal).localeCompare(String(bVal))
          if (comparison !== 0) {
            return direction === 'asc' ? comparison : -comparison
          }
        }
      }
      return 0
    })
  }, [data, sortConfigs])
}
