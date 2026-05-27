import { useCallback } from 'react'
import type { Timesheet, Worker } from '@/lib/types'
import type { HolidayPayCalculation } from './use-payroll-calculations.types'

export function usePAYEHolidayCalc(workers: Worker[], timesheets: Timesheet[]) {
  const calculateHolidayPay = useCallback((
    workerId: string,
    startDate: Date,
    endDate: Date,
    holidayAccrualRate: number = 0.1207
  ): HolidayPayCalculation => {
    const worker = workers.find(w => w.id === workerId)
    const workerTimesheets = timesheets.filter(ts => {
      if (ts.workerId !== workerId) return false
      const tsDate = new Date(ts.weekEnding)
      return tsDate >= startDate && tsDate <= endDate
    })

    const eligibleHours = workerTimesheets.reduce((sum, ts) => sum + (ts.hours || 0), 0)
    const accruedHoliday = eligibleHours * holidayAccrualRate
    const avgRate = workerTimesheets.length > 0
      ? workerTimesheets.reduce((sum, ts) => sum + (ts.rate || 0), 0) / workerTimesheets.length
      : 0

    return {
      workerId,
      workerName: worker?.name || 'Unknown',
      eligibleHours,
      holidayAccrualRate,
      accruedHoliday,
      usedHoliday: 0,
      remainingHoliday: accruedHoliday,
      holidayPayRate: avgRate,
      totalHolidayPay: accruedHoliday * avgRate
    }
  }, [workers, timesheets])

  return { calculateHolidayPay }
}
