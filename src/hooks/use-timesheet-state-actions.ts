import { useCallback } from 'react'
import { toast } from 'sonner'
import type { Timesheet, NewNotification, TimesheetAdjustment } from '@/lib/types'

export function useTimesheetStateActions(
  setTimesheets: (updater: (current: Timesheet[]) => Timesheet[]) => void,
  addNotification: (notification: NewNotification) => void,
) {
  const handleApproveTimesheet = useCallback((id: string) => {
    setTimesheets(current => {
      const updated = current.map(t =>
        t.id === id
          ? { ...t, status: 'approved' as const, approvedDate: new Date().toISOString() }
          : t
      )
      const timesheet = updated.find(t => t.id === id)
      if (timesheet) {
        addNotification({
          type: 'timesheet',
          priority: 'medium',
          title: 'Timesheet Approved',
          message: `${timesheet.workerName}'s timesheet for ${new Date(timesheet.weekEnding).toLocaleDateString()} has been approved`,
          relatedId: id
        })
      }
      return updated
    })
    toast.success('Timesheet approved successfully')
  }, [setTimesheets, addNotification])

  const handleRejectTimesheet = useCallback((id: string) => {
    setTimesheets(current => {
      const updated = current.map(t =>
        t.id === id
          ? { ...t, status: 'rejected' as const }
          : t
      )
      const timesheet = updated.find(t => t.id === id)
      if (timesheet) {
        addNotification({
          type: 'timesheet',
          priority: 'medium',
          title: 'Timesheet Rejected',
          message: `${timesheet.workerName}'s timesheet for ${new Date(timesheet.weekEnding).toLocaleDateString()} has been rejected`,
          relatedId: id
        })
      }
      return updated
    })
    toast.error('Timesheet rejected')
  }, [setTimesheets, addNotification])

  const handleAdjustTimesheet = (timesheetId: string, adjustment: TimesheetAdjustment) => {
    setTimesheets(current =>
      current.map(t => {
        if (t.id !== timesheetId) return t
        const newAdjustment = {
          ...adjustment,
          id: adjustment.id || `ADJ-${Date.now()}`,
          adjustmentDate: adjustment.adjustmentDate || new Date().toISOString(),
        }
        const newHours = adjustment.newHours
        const newRate = adjustment.newRate ?? t.rate ?? 0
        return {
          ...t,
          hours: newHours,
          rate: newRate,
          amount: newHours * newRate,
          adjustments: [...(t.adjustments || []), newAdjustment]
        }
      })
    )
  }

  return { handleApproveTimesheet, handleRejectTimesheet, handleAdjustTimesheet }
}
