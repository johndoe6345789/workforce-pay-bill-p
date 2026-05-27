export interface QueryFilter {
  field: string
  operator:
    | 'equals'
    | 'contains'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'between'
    | 'in'
    | 'startsWith'
    | 'endsWith'
  value: unknown
}

export interface ParsedQuery {
  filters: QueryFilter[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  error?: string
}
