export type { QueryFilter, ParsedQuery } from './query-parser.types'
export { parseQuery } from './query-parser.parse'

import type { QueryFilter } from './query-parser.types'

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let value: unknown = obj

  for (const key of keys) {
    if (value && typeof value === 'object' && key in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return value
}

export function applyFilters<T extends Record<string, unknown>>(
  items: T[],
  filters: QueryFilter[]
): T[] {
  if (filters.length === 0) return items

  return items.filter(item => {
    return filters.every(filter => {
      const fieldValue = getNestedValue(item, filter.field)

      if (fieldValue === undefined || fieldValue === null) {
        return false
      }

      switch (filter.operator) {
        case 'equals':
          return String(fieldValue).toLowerCase() === String(filter.value).toLowerCase()

        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase())

        case 'startsWith':
          return String(fieldValue).toLowerCase().startsWith(String(filter.value).toLowerCase())

        case 'endsWith':
          return String(fieldValue).toLowerCase().endsWith(String(filter.value).toLowerCase())

        case 'gt':
          return Number(fieldValue) > Number(filter.value)

        case 'gte':
          return Number(fieldValue) >= Number(filter.value)

        case 'lt':
          return Number(fieldValue) < Number(filter.value)

        case 'lte':
          return Number(fieldValue) <= Number(filter.value)

        case 'in':
          return Array.isArray(filter.value) && filter.value.some(v =>
            String(fieldValue).toLowerCase() === String(v).toLowerCase()
          )

        default:
          return false
      }
    })
  })
}

export function applySorting<T extends Record<string, unknown>>(
  items: T[],
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] {
  if (!sortBy) return items

  return [...items].sort((a, b) => {
    const aVal = getNestedValue(a, sortBy)
    const bVal = getNestedValue(b, sortBy)

    if (aVal === undefined || aVal === null) return 1
    if (bVal === undefined || bVal === null) return -1

    let comparison = 0

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal
    } else if (aVal instanceof Date && bVal instanceof Date) {
      comparison = aVal.getTime() - bVal.getTime()
    } else {
      comparison = String(aVal).localeCompare(String(bVal))
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })
}
