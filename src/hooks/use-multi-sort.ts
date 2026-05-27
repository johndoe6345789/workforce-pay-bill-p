import { useMemo } from 'react'
import type { MultiSortConfig } from './use-sort-advanced.types'

export type { MultiSortConfig } from './use-sort-advanced.types'

function compareValues<T>(aVal: T[keyof T], bVal: T[keyof T], direction: 'asc' | 'desc'): number {
  if (aVal === null || aVal === undefined) return 1
  if (bVal === null || bVal === undefined) return -1

  if (typeof aVal === 'string' && typeof bVal === 'string') {
    const cmp = aVal.localeCompare(bVal)
    return direction === 'asc' ? cmp : -cmp
  }
  if (typeof aVal === 'number' && typeof bVal === 'number') {
    return direction === 'asc' ? aVal - bVal : bVal - aVal
  }
  if (aVal instanceof Date && bVal instanceof Date) {
    const cmp = aVal.getTime() - bVal.getTime()
    return direction === 'asc' ? cmp : -cmp
  }
  const cmp = String(aVal).localeCompare(String(bVal))
  return direction === 'asc' ? cmp : -cmp
}

export function useMultiSort<T>(data: T[], sortConfigs: MultiSortConfig<T>[]): T[] {
  return useMemo(() => {
    if (!sortConfigs.length) return data

    return [...data].sort((a, b) => {
      for (const { key, direction } of sortConfigs) {
        const aVal = a[key]
        const bVal = b[key]
        if (aVal === bVal) continue
        const result = compareValues(aVal, bVal, direction)
        if (result !== 0) return result
      }
      return 0
    })
  }, [data, sortConfigs])
}
