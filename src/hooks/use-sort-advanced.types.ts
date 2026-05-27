export type SortDirection = 'asc' | 'desc' | null

export interface SortConfig<T> {
  key: keyof T
  direction: SortDirection
}

export interface MultiSortConfig<T> {
  key: keyof T
  direction: 'asc' | 'desc'
}
