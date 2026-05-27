export interface UseTableOptions<T> {
  data: T[]
  pageSize?: number
  initialSort?: {
    key: keyof T
    direction: 'asc' | 'desc'
  }
}

export interface UseTableState<T> {
  sortKey: keyof T | null
  sortDirection: 'asc' | 'desc'
  filters: Partial<Record<keyof T, unknown>>
  page: number
}
