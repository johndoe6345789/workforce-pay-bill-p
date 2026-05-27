import type { ReportFrequency } from './use-scheduled-reports.types'

export function calculateNextRunDate(frequency: ReportFrequency, fromDate: Date = new Date()): string {
  const next = new Date(fromDate)

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1)
      break
    case 'weekly':
      next.setDate(next.getDate() + 7)
      break
    case 'monthly':
      next.setMonth(next.getMonth() + 1)
      break
    case 'quarterly':
      next.setMonth(next.getMonth() + 3)
      break
  }

  next.setHours(9, 0, 0, 0)
  return next.toISOString()
}
