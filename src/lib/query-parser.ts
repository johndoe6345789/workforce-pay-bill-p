export interface QueryFilter {
  field: string
  operator: 'equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'startsWith' | 'endsWith'
  value: any
}

export interface ParsedQuery {
  filters: QueryFilter[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  error?: string
}

export function parseQuery(query: string): ParsedQuery {
  const result: ParsedQuery = { filters: [] }
  
  if (!query || query.trim() === '') {
    return result
  }

  const tokens = tokenize(query)
  let i = 0

  while (i < tokens.length) {
    const token = tokens[i]

    if (token.toLowerCase() === 'sort' && i + 2 < tokens.length) {
      result.sortBy = tokens[i + 1]
      const order = tokens[i + 2].toLowerCase()
      if (order === 'asc' || order === 'desc') {
        result.sortOrder = order
      }
      i += 3
      continue
    }

    if (i + 2 < tokens.length) {
      const field = token
      const operator = tokens[i + 1]
      let value = tokens[i + 2]

      const filter = parseFilter(field, operator, value)
      if (filter) {
        result.filters.push(filter)
        i += 3
      } else {
        i += 1
      }
    } else {
      i += 1
    }
  }

  return result
}

function tokenize(query: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < query.length; i++) {
    const char = query[i]

    if (char === '"' || char === "'") {
      if (inQuotes) {
        if (current) {
          tokens.push(current)
          current = ''
        }
        inQuotes = false
      } else {
        if (current) {
          tokens.push(current)
          current = ''
        }
        inQuotes = true
      }
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += char
    }
  }

  if (current) {
    tokens.push(current)
  }

  return tokens
}

function parseFilter(field: string, operator: string, value: string): QueryFilter | null {
  const operatorMap: Record<string, QueryFilter['operator']> = {
    '=': 'equals',
    '==': 'equals',
    ':': 'contains',
    'contains': 'contains',
    '>': 'gt',
    '>=': 'gte',
    '<': 'lt',
    '<=': 'lte',
    'in': 'in',
    'starts': 'startsWith',
    'ends': 'endsWith',
  }

  const mappedOperator = operatorMap[operator.toLowerCase()]
  if (!mappedOperator) {
    return null
  }

  let parsedValue: any = value

  if (mappedOperator === 'in') {
    parsedValue = value.split(',').map(v => v.trim())
  } else if (!isNaN(Number(value))) {
    parsedValue = Number(value)
  } else if (value.toLowerCase() === 'true') {
    parsedValue = true
  } else if (value.toLowerCase() === 'false') {
    parsedValue = false
  }

  return {
    field,
    operator: mappedOperator,
    value: parsedValue
  }
}

export function applyFilters<T extends Record<string, any>>(
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

function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.')
  let value = obj

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return undefined
    }
  }

  return value
}

export function applySorting<T extends Record<string, any>>(
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
