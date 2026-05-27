import type { FieldMapping, ValidationResult } from './useBatchImport.types'
import { FIELD_DEFINITIONS } from '@/data/batchImportConfig'
import type { ImportType } from '@/data/batchImportConfig'

export function parseCsv(data: string): { headers: string[]; rows: string[][] } {
  const lines = data.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''))
  const rows = lines.slice(1).map(line =>
    line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
  )
  return { headers, rows }
}

export function transformValue(value: string, transform: string): string | number {
  if (transform === 'uppercase') return value.toUpperCase()
  if (transform === 'lowercase') return value.toLowerCase()
  if (transform === 'number') return parseFloat(value) || 0
  return value
}

export function buildValidationResult(
  data: string,
  type: ImportType,
  onMappingsDetected: (mappings: FieldMapping[]) => void
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const preview: Record<string, string>[] = []

  if (!data.trim()) {
    return { valid: false, errors: ['No data provided'], warnings, rowCount: 0, preview: [], headers: [] }
  }

  const { headers, rows } = parseCsv(data)
  if (rows.length === 0) {
    return { valid: false, errors: ['CSV must contain at least one data row'], warnings, rowCount: 0, preview: [], headers }
  }

  const defs = FIELD_DEFINITIONS[type]
  const detectedMappings: FieldMapping[] = []

  defs.filter(f => f.required).forEach(def => {
    const matchingHeader = headers.find(h =>
      h.toLowerCase() === def.name.toLowerCase() ||
      h.toLowerCase().replace(/[_\s]/g, '') === def.name.toLowerCase().replace(/[_\s]/g, '')
    )
    if (matchingHeader) {
      detectedMappings.push({
        sourceField: matchingHeader,
        targetField: def.name,
        transform: def.type === 'number' ? 'number' : def.type === 'date' ? 'date' : 'none',
        required: true,
      })
    } else {
      errors.push(`Missing required field: ${def.label}`)
    }
  })

  if (detectedMappings.length > 0) onMappingsDetected(detectedMappings)

  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => { row[h] = rows[i][idx] || '' })

    if (type === 'timesheets') {
      const hoursField = detectedMappings.find(m => m.targetField === 'hours')?.sourceField
      const rateField = detectedMappings.find(m => m.targetField === 'rate')?.sourceField
      if (hoursField) {
        const hours = parseFloat(row[hoursField])
        if (isNaN(hours) || hours <= 0) errors.push(`Row ${i + 1}: Invalid hours value "${row[hoursField]}"`)
        else if (hours > 80) warnings.push(`Row ${i + 1}: Hours value ${hours} seems unusually high`)
      }
      if (rateField) {
        const rate = parseFloat(row[rateField])
        if (isNaN(rate) || rate <= 0) errors.push(`Row ${i + 1}: Invalid rate value "${row[rateField]}"`)
      }
    }
    if (type === 'expenses') {
      const amountField = detectedMappings.find(m => m.targetField === 'amount')?.sourceField
      if (amountField) {
        const amount = parseFloat(row[amountField])
        if (isNaN(amount) || amount <= 0) errors.push(`Row ${i + 1}: Invalid amount value "${row[amountField]}"`)
      }
    }
    if (type === 'workers') {
      const emailField = detectedMappings.find(m => m.targetField === 'email')?.sourceField
      if (emailField && row[emailField] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[emailField])) {
        errors.push(`Row ${i + 1}: Invalid email format "${row[emailField]}"`)
      }
    }
    preview.push(row)
  }

  const rowCount = rows.length
  if (rowCount > 1000) warnings.push(`Large import: ${rowCount} rows will be processed. This may take some time.`)
  else if (rowCount > 500) warnings.push(`Medium import: ${rowCount} rows will be processed.`)

  return { valid: errors.length === 0, errors, warnings, rowCount, preview, headers }
}
