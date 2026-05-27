import { useCallback } from 'react'
import { useTimesheetsCrud } from './use-timesheets-crud'
import { useAuth } from './use-auth'
import { APPROVAL_THRESHOLDS } from './use-time-and-rate-adjustment.types'
import type { AdjustmentRecord } from './use-time-and-rate-adjustment.types'
import { useAdjustmentCreators } from './use-adjustment-creators'
import { useAdjustmentActions } from './use-adjustment-actions'

export type { TimeAndRateAdjustmentInput, AdjustmentRecord } from './use-time-and-rate-adjustment.types'

export function useTimeAndRateAdjustment() {
  const { updateTimesheet, getTimesheetById, timesheets } = useTimesheetsCrud()
  const { user } = useAuth()

  const { calculateRequiresApproval, createAdjustmentRecord } = useAdjustmentCreators()

  const { applyAdjustment, approveAdjustment, rejectAdjustment, getAdjustmentHistory } =
    useAdjustmentActions(user, getTimesheetById as Parameters<typeof useAdjustmentActions>[1], updateTimesheet as Parameters<typeof useAdjustmentActions>[2], createAdjustmentRecord)

  const getPendingAdjustments = useCallback(() => {
    const pending: Array<{ timesheetId: string; timesheet: unknown; adjustment: AdjustmentRecord }> = []
    timesheets.forEach(timesheet => {
      const pendingAdjs = (timesheet.adjustments || []).filter(
        (adj: unknown) => (adj as AdjustmentRecord).approvalStatus === 'pending_approval'
      )
      pendingAdjs.forEach(adj => {
        pending.push({ timesheetId: timesheet.id, timesheet, adjustment: adj as AdjustmentRecord })
      })
    })
    return pending
  }, [timesheets])

  return {
    calculateRequiresApproval,
    applyAdjustment,
    approveAdjustment,
    rejectAdjustment,
    getAdjustmentHistory,
    getPendingAdjustments,
    APPROVAL_THRESHOLDS,
  }
}
