import { toast } from 'sonner'
import type { Timesheet, ShiftEntry } from '@/lib/types'
import { parseBulkTimesheets } from './use-bulk-import-utils'

export function useTimesheetCreateActions(
  setTimesheets: (updater: (current: Timesheet[]) => Timesheet[]) => void,
) {
  const handleCreateTimesheet = (data: {
    workerName: string
    clientName: string
    hours: number
    rate: number
    weekEnding: string
  }) => {
    const newTimesheet: Timesheet = {
      id: `TS-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: data.workerName,
      clientName: data.clientName,
      weekEnding: data.weekEnding,
      hours: data.hours,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      amount: data.hours * data.rate
    }
    setTimesheets(current => [...current, newTimesheet])
    toast.success('Timesheet created successfully')
  }

  const handleCreateDetailedTimesheet = (data: {
    workerName: string
    clientName: string
    weekEnding: string
    shifts: ShiftEntry[]
    totalHours: number
    totalAmount: number
    baseRate: number
  }) => {
    const newTimesheet: Timesheet = {
      id: `TS-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: data.workerName,
      clientName: data.clientName,
      weekEnding: data.weekEnding,
      hours: data.totalHours,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      amount: data.totalAmount,
      rate: data.baseRate,
      shifts: data.shifts
    }
    setTimesheets(current => [...current, newTimesheet])
    toast.success(`Detailed timesheet created with ${data.shifts.length} shifts`)
  }

  const handleBulkImport = (csvData: string) => {
    const newTimesheets = parseBulkTimesheets(csvData)
    if (!newTimesheets) {
      toast.error('Invalid CSV format')
      return
    }
    if (newTimesheets.length > 0) {
      setTimesheets(current => [...current, ...newTimesheets])
      toast.success(`Imported ${newTimesheets.length} timesheets`)
    } else {
      toast.error('No valid timesheets found in CSV')
    }
  }

  return { handleCreateTimesheet, handleCreateDetailedTimesheet, handleBulkImport }
}
