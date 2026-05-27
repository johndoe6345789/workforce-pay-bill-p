import { useMemo } from 'react'
import type { SortConfig } from './use-sort-advanced.types'

export type { SortDirection, SortConfig, MultiSortConfig } from './use-sort-advanced.types'
export { useMultiSort } from './use-multi-sort'

export function useSortAdvanced<T>(data: T[], sortConfig: SortConfig<T> | null): T[] {
  return useMemo(() => {
    if (!sortConfig || !sortConfig.direction) return data

    const { key, direction } = sortConfig

    return [...data].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
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
  }, [data, sortConfig])
}
