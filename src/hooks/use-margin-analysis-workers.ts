import { useCallback } from 'react'
import type { Timesheet } from '@/lib/types'
import type { WorkerUtilization } from './use-margin-analysis.types'

export function useMarginAnalysisWorkers(timesheets: Timesheet[]) {
  const analyzeWorkerUtilization = useCallback((
    startDate: Date,
    endDate: Date,
    standardWorkWeekHours: number = 40
  ): WorkerUtilization[] => {
    const periodTimesheets = timesheets.filter(ts => {
      const tsDate = new Date(ts.weekEnding)
      return tsDate >= startDate && tsDate <= endDate && ts.status === 'approved'
    })

    const workerData = new Map<string, { name: string; hours: number; revenue: number }>()

    periodTimesheets.forEach(ts => {
      const existing = workerData.get(ts.workerId) || {
        name: ts.workerName,
        hours: 0,
        revenue: 0
      }
      workerData.set(ts.workerId, {
        name: existing.name,
        hours: existing.hours + (ts.hours || 0),
        revenue: existing.revenue + (ts.amount || 0)
      })
    })

    const msPerWeek = 1000 * 60 * 60 * 24 * 7
    const weeksInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerWeek)
    const availableHours = weeksInPeriod * standardWorkWeekHours

    return Array.from(workerData.entries())
      .map(([workerId, data]) => ({
        workerId,
        workerName: data.name,
        hoursWorked: data.hours,
        availableHours,
        utilizationRate: (data.hours / availableHours) * 100,
        revenue: data.revenue,
        avgRate: data.hours > 0 ? data.revenue / data.hours : 0
      }))
      .sort((a, b) => b.utilizationRate - a.utilizationRate)
  }, [timesheets])

  return { analyzeWorkerUtilization }
}
