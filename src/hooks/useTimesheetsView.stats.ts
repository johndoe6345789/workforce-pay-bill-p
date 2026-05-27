import type { Timesheet } from '@/lib/types'
import type { TimesheetStats, TimesheetWithValidation, ValidationStats } from './useTimesheetsView.types'

export function computeTimesheetStats(filteredTimesheets: Timesheet[]): TimesheetStats {
  const approvedCount = filteredTimesheets.filter(ts => ts.status === 'approved').length
  return {
    pendingCount: filteredTimesheets.filter(ts => ts.status === 'pending').length,
    approvedCount,
    totalHours: filteredTimesheets.reduce((sum, ts) => sum + ts.hours, 0),
    totalValue: filteredTimesheets.reduce((sum, ts) => sum + ts.amount, 0),
    approvalRate: filteredTimesheets.length > 0 ? (approvedCount / filteredTimesheets.length) * 100 : 0,
  }
}

export function computeValidationStats(timesheetsWithValidation: TimesheetWithValidation[]): ValidationStats {
  return {
    invalid: timesheetsWithValidation.filter(ts => !ts.isValid).length,
    withWarnings: timesheetsWithValidation.filter(ts => ts.validationWarnings && ts.validationWarnings.length > 0).length,
  }
}
