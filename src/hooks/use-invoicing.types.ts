export interface InvoiceGenerationOptions {
  includeLineItems?: boolean
  applyTax?: boolean
  taxRate?: number
  paymentTermsDays?: number
  roundingPrecision?: number
}

export interface InvoiceAgingData {
  current: number
  days30: number
  days60: number
  days90: number
  over90: number
}
