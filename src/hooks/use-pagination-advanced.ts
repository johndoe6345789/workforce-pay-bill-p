import { useMemo } from 'react'

export interface PaginationConfig {
  page: number
  pageSize: number
  totalItems: number
}

export interface PaginationResult<T> {
  items: T[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startIndex: number
  endIndex: number
}

export function usePagination<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 20
): PaginationResult<T> {
  return useMemo(() => {
    const totalItems = data.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const safePage = Math.max(1, Math.min(page, totalPages || 1))
    
    const startIndex = (safePage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)
    const items = data.slice(startIndex, endIndex)

    return {
      items,
      currentPage: safePage,
      totalPages,
      pageSize,
      totalItems,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
      startIndex,
      endIndex,
    }
  }, [data, page, pageSize])
}

export function useServerPagination<T>(
  data: T[],
  totalItems: number,
  page: number = 1,
  pageSize: number = 20
): Omit<PaginationResult<T>, 'startIndex' | 'endIndex'> {
  return useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize)
    const safePage = Math.max(1, Math.min(page, totalPages || 1))

    return {
      items: data,
      currentPage: safePage,
      totalPages,
      pageSize,
      totalItems,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    }
  }, [data, totalItems, page, pageSize])
}
