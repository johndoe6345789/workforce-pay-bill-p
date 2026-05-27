import { useState, useMemo, useEffect } from 'react'
import { parseQuery, applyFilters, applySorting } from '@/lib/query-parser'
import type { FilterField } from '@/components/AdvancedSearch'

export function useAdvancedSearch<T extends Record<string, unknown>>(
  items: T[],
  fields: FilterField[],
  onResultsChange: (results: T[]) => void
) {
  const [query, setQuery] = useState('')
  const [showBuilder, setShowBuilder] = useState(false)

  const parsed = useMemo(() => parseQuery(query), [query])

  const filteredItems = useMemo(() => {
    let results = items

    if (parsed.filters.length > 0) {
      results = applyFilters(results, parsed.filters)
    } else if (query.trim()) {
      const searchTerm = query.toLowerCase().trim()
      results = items.filter(item =>
        fields.some(field => {
          const value = item[field.name]
          if (value === undefined || value === null) return false
          return String(value).toLowerCase().includes(searchTerm)
        })
      )
    }

    if (parsed.sortBy && parsed.sortOrder) {
      results = applySorting(results, parsed.sortBy, parsed.sortOrder)
    }

    return results
  }, [items, parsed, query, fields])

  useEffect(() => {
    onResultsChange(filteredItems)
  }, [filteredItems])

  const addFilter = (field: string, operator: string, value: string) => {
    const filterQuery = `${field} ${operator} "${value}"`
    setQuery(prev => prev ? `${prev} ${filterQuery}` : filterQuery)
  }

  const removeFilter = (index: number) => {
    const newFilters = parsed.filters.filter((_, i) => i !== index)
    const newQuery = newFilters.map(f => `${f.field} ${f.operator} "${f.value}"`).join(' ')
    setQuery(newQuery)
  }

  const clearAll = () => setQuery('')

  return {
    query,
    setQuery,
    showBuilder,
    setShowBuilder,
    parsed,
    filteredItems,
    totalCount: items.length,
    addFilter,
    removeFilter,
    clearAll,
  }
}
