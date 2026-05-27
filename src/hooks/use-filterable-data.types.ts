export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn'

export interface FilterRule<T> {
  field: keyof T
  operator: FilterOperator
  value: unknown
}

export interface UseFilterableDataReturn<T> {
  filteredData: T[]
  filters: FilterRule<T>[]
  addFilter: (rule: FilterRule<T>) => void
  removeFilter: (index: number) => void
  clearFilters: () => void
  updateFilter: (index: number, rule: FilterRule<T>) => void
}
