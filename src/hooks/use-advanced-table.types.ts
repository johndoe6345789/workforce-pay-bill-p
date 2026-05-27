import { SortConfig } from './use-sort-advanced'
import { PaginationResult } from './use-pagination-advanced'

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface TableState<T> {
  page: number
  pageSize: number
  sortConfig: SortConfig<T> | null
  searchQuery: string
  filters: Partial<Record<keyof T, unknown>>
}

export interface TableActions<T> {
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSort: (key: keyof T) => void
  setSearch: (query: string) => void
  setFilter: (key: keyof T, value: unknown) => void
  clearFilters: () => void
  resetTable: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void
}

export interface UseAdvancedTableResult<T> extends PaginationResult<T> {
  state: TableState<T>
  actions: TableActions<T>
  filteredCount: number
  sortedCount: number
}
