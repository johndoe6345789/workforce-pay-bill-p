export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  rowCount: number
  preview: Record<string, string>[]
  headers: string[]
}

export interface FieldMapping {
  sourceField: string
  targetField: string
  transform?: 'none' | 'uppercase' | 'lowercase' | 'date' | 'number'
  required: boolean
}

export interface ImportProgress {
  total: number
  processed: number
  succeeded: number
  failed: number
  errors: { row: number; error: string }[]
}
