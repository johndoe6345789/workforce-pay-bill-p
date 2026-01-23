import { useState, useCallback, useMemo } from 'react'

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
  value: any
}

export interface UseFilterableDataReturn<T> {
  filteredData: T[]
  filters: FilterRule<T>[]
  addFilter: (rule: FilterRule<T>) => void
  removeFilter: (index: number) => void
  clearFilters: () => void
  updateFilter: (index: number, rule: FilterRule<T>) => void
}

export function useFilterableData<T>(data: T[]): UseFilterableDataReturn<T> {
  const [filters, setFilters] = useState<FilterRule<T>[]>([])

  const applyFilter = useCallback((item: T, rule: FilterRule<T>): boolean => {
    const value = item[rule.field]

    switch (rule.operator) {
      case 'equals':
        return value === rule.value

      case 'notEquals':
        return value !== rule.value

      case 'contains':
        return String(value).toLowerCase().includes(String(rule.value).toLowerCase())

      case 'notContains':
        return !String(value).toLowerCase().includes(String(rule.value).toLowerCase())

      case 'startsWith':
        return String(value).toLowerCase().startsWith(String(rule.value).toLowerCase())

      case 'endsWith':
        return String(value).toLowerCase().endsWith(String(rule.value).toLowerCase())

      case 'greaterThan':
        return Number(value) > Number(rule.value)

      case 'lessThan':
        return Number(value) < Number(rule.value)

      case 'greaterThanOrEqual':
        return Number(value) >= Number(rule.value)

      case 'lessThanOrEqual':
        return Number(value) <= Number(rule.value)

      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(value)

      case 'notIn':
        return Array.isArray(rule.value) && !rule.value.includes(value)

      default:
        return true
    }
  }, [])

  const filteredData = useMemo(() => {
    if (filters.length === 0) return data

    return data.filter((item) => {
      return filters.every((rule) => applyFilter(item, rule))
    })
  }, [data, filters, applyFilter])

  const addFilter = useCallback((rule: FilterRule<T>) => {
    setFilters((current) => [...current, rule])
  }, [])

  const removeFilter = useCallback((index: number) => {
    setFilters((current) => current.filter((_, i) => i !== index))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters([])
  }, [])

  const updateFilter = useCallback((index: number, rule: FilterRule<T>) => {
    setFilters((current) =>
      current.map((filter, i) => (i === index ? rule : filter))
    )
  }, [])

  return {
    filteredData,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter,
  }
}
