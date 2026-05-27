import { useMemo } from 'react'

export function useTableFilter<T extends Record<string, unknown>>(
  data: T[],
  filters: Partial<Record<keyof T, unknown>>
): T[] {
  return useMemo(() => {
    return data.filter(item =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        const itemValue = item[key as keyof T]
        if (typeof value === 'string') {
          return String(itemValue).toLowerCase().includes(value.toLowerCase())
        }
        return itemValue === value
      })
    )
  }, [data, filters])
}

export function useTableSort<T extends Record<string, unknown>>(
  data: T[],
  sortKey: keyof T | null,
  sortDirection: 'asc' | 'desc'
): T[] {
  return useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
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
  }, [data, sortKey, sortDirection])
}

export function useTablePaginate<T>(
  data: T[],
  page: number,
  pageSize: number
): { paginatedData: T[]; totalPages: number } {
  return useMemo(() => {
    const start = (page - 1) * pageSize
    return {
      paginatedData: data.slice(start, start + pageSize),
      totalPages: Math.ceil(data.length / pageSize),
    }
  }, [data, page, pageSize])
}
