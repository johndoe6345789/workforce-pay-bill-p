import type { QueryFilter, ParsedQuery } from './query-parser.types'

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
      const value = tokens[i + 2]

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
        if (current) { tokens.push(current); current = '' }
        inQuotes = false
      } else {
        if (current) { tokens.push(current); current = '' }
        inQuotes = true
      }
    } else if (char === ' ' && !inQuotes) {
      if (current) { tokens.push(current); current = '' }
    } else {
      current += char
    }
  }

  if (current) tokens.push(current)
  return tokens
}

function parseFilter(field: string, operator: string, value: string): QueryFilter | null {
  const operatorMap: Record<string, QueryFilter['operator']> = {
    '=': 'equals', '==': 'equals',
    ':': 'contains', 'contains': 'contains',
    '>': 'gt', '>=': 'gte',
    '<': 'lt', '<=': 'lte',
    'in': 'in', 'starts': 'startsWith', 'ends': 'endsWith',
  }

  const mappedOperator = operatorMap[operator.toLowerCase()]
  if (!mappedOperator) return null

  let parsedValue: unknown = value

  if (mappedOperator === 'in') {
    parsedValue = value.split(',').map(v => v.trim())
  } else if (!isNaN(Number(value))) {
    parsedValue = Number(value)
  } else if (value.toLowerCase() === 'true') {
    parsedValue = true
  } else if (value.toLowerCase() === 'false') {
    parsedValue = false
  }

  return { field, operator: mappedOperator, value: parsedValue }
}
