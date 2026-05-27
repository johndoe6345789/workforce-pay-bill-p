export { createMockTimesheet, createMockInvoice } from './data-generator.timesheets-invoices'
export { createMockPayroll, createMockWorker } from './data-generator.payroll-workers'

export interface DataGeneratorOptions<T> {
  count: number
  template: (index: number) => T
  batchSize?: number
}

export async function generateLargeDataset<T>({
  count,
  template,
  batchSize = 1000,
}: DataGeneratorOptions<T>): Promise<T[]> {
  const result: T[] = []

  for (let i = 0; i < count; i += batchSize) {
    const batch: T[] = []
    const end = Math.min(i + batchSize, count)
    for (let j = i; j < end; j++) {
      batch.push(template(j))
    }
    result.push(...batch)
    if (i + batchSize < count) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  return result
}
