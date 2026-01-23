import { useMemo } from 'react'

export type SortDirection = 'asc' | 'desc'

export function useSort<T>(
  items: T[],
  sortKey: keyof T | null,
  sortDirection: SortDirection
): T[] {
  return useMemo(() => {
    if (!sortKey) {
      return items
    }

    const sorted = [...items].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [items, sortKey, sortDirection])
}
