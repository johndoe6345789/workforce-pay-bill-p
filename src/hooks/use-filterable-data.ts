import { useState, useCallback, useMemo } from 'react'
import type { FilterRule, UseFilterableDataReturn } from './use-filterable-data.types'
import { applyFilter } from './use-filterable-data.filter-logic'

export type { FilterOperator, FilterRule, UseFilterableDataReturn } from './use-filterable-data.types'

export function useFilterableData<T>(data: T[]): UseFilterableDataReturn<T> {
  const [filters, setFilters] = useState<FilterRule<T>[]>([])

  const filteredData = useMemo(() => {
    if (filters.length === 0) return data
    return data.filter((item) => filters.every((rule) => applyFilter(item, rule)))
  }, [data, filters])

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
    setFilters((current) => current.map((f, i) => (i === index ? rule : f)))
  }, [])

  return { filteredData, filters, addFilter, removeFilter, clearFilters, updateFilter }
}
