import { useCallback } from 'react'
import type { AdjustmentRecord, TimeAndRateAdjustmentInput } from './use-time-and-rate-adjustment.types'

type UpdateTimesheetFn = (id: string, updates: Record<string, unknown>) => Promise<void>
type GetTimesheetByIdFn = (id: string) => Promise<{ adjustments?: unknown[]; [k: string]: unknown } | null>

export function useAdjustmentActions(
  user: { id: string; name: string } | null,
  getTimesheetById: GetTimesheetByIdFn,
  updateTimesheet: UpdateTimesheetFn,
  createAdjustmentRecord: (input: TimeAndRateAdjustmentInput, userId: string, userName: string) => AdjustmentRecord,
) {
  const applyAdjustment = useCallback(async (
    input: TimeAndRateAdjustmentInput
  ): Promise<{ success: boolean; adjustmentId?: string; message: string }> => {
    try {
      const currentTimesheet = await getTimesheetById(input.timesheetId)
      if (!currentTimesheet) return { success: false, message: 'Timesheet not found' }
      const adjustmentRecord = createAdjustmentRecord(input, user?.id || 'unknown', user?.name || 'Unknown User')
      const updates: Record<string, unknown> = { adjustments: [...(currentTimesheet.adjustments || []), adjustmentRecord] }
      if (!input.approvalRequired) {
        if (input.adjustedHours !== undefined) updates.hours = input.adjustedHours
        if (input.adjustedRate !== undefined) updates.rate = input.adjustedRate
        if (input.adjustedHours !== undefined || input.adjustedRate !== undefined) {
          updates.amount = (input.adjustedHours ?? input.originalHours) * (input.adjustedRate ?? input.originalRate)
        }
      } else {
        updates.status = 'pending'
      }
      await updateTimesheet(input.timesheetId, updates)
      return { success: true, adjustmentId: adjustmentRecord.id, message: input.approvalRequired ? 'Adjustment submitted for approval' : 'Adjustment applied successfully' }
    } catch {
      return { success: false, message: 'Failed to apply adjustment' }
    }
  }, [user, createAdjustmentRecord, getTimesheetById, updateTimesheet])

  const approveAdjustment = useCallback(async (
    timesheetId: string,
    adjustmentId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const timesheet = await getTimesheetById(timesheetId)
      if (!timesheet) return { success: false, message: 'Timesheet not found' }
      const adjustments = (timesheet.adjustments || []) as AdjustmentRecord[]
      if (!adjustments.find(adj => adj.id === adjustmentId)) return { success: false, message: 'Adjustment not found' }
      const updatedAdjustments = adjustments.map(adj =>
        adj.id === adjustmentId
          ? { ...adj, approvalStatus: 'approved' as const, approvedBy: user?.name || 'Unknown User', approvedDate: new Date().toISOString() }
          : adj
      )
      const approved = updatedAdjustments.find(adj => adj.id === adjustmentId)!
      await updateTimesheet(timesheetId, { adjustments: updatedAdjustments, hours: approved.newHours, rate: approved.newRate, amount: approved.newAmount, status: 'approved' })
      return { success: true, message: 'Adjustment approved and applied' }
    } catch {
      return { success: false, message: 'Failed to approve adjustment' }
    }
  }, [user, getTimesheetById, updateTimesheet])

  const rejectAdjustment = useCallback(async (
    timesheetId: string,
    adjustmentId: string,
    rejectionReason?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const timesheet = await getTimesheetById(timesheetId)
      if (!timesheet) return { success: false, message: 'Timesheet not found' }
      const updatedAdjustments = ((timesheet.adjustments || []) as AdjustmentRecord[]).map(adj =>
        adj.id === adjustmentId
          ? { ...adj, approvalStatus: 'rejected' as const, approvedBy: user?.name || 'Unknown User', approvedDate: new Date().toISOString(), rejectionReason }
          : adj
      )
      await updateTimesheet(timesheetId, { adjustments: updatedAdjustments })
      return { success: true, message: 'Adjustment rejected' }
    } catch {
      return { success: false, message: 'Failed to reject adjustment' }
    }
  }, [user, getTimesheetById, updateTimesheet])

  const getAdjustmentHistory = useCallback(async (timesheetId: string): Promise<AdjustmentRecord[]> => {
    try {
      const timesheet = await getTimesheetById(timesheetId)
      return (timesheet?.adjustments as AdjustmentRecord[]) || []
    } catch {
      return []
    }
  }, [getTimesheetById])

  return { applyAdjustment, approveAdjustment, rejectAdjustment, getAdjustmentHistory }
}
