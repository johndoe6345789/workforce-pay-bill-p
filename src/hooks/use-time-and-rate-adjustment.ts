import { useCallback } from 'react'
import { useTimesheetsCrud } from './use-timesheets-crud'
import { useAuth } from './use-auth'

export interface TimeAndRateAdjustmentInput {
  timesheetId: string
  workerId: string
  workerName: string
  clientName: string
  originalHours: number
  originalRate: number
  adjustedHours?: number
  adjustedRate?: number
  adjustmentReason: string
  adjustmentType: 'time' | 'rate' | 'both'
  approvalRequired: boolean
  notes?: string
}

export interface AdjustmentRecord {
  id: string
  adjustmentDate: string
  adjustedBy: string
  adjustedByUserId: string
  previousHours: number
  newHours: number
  previousRate: number
  newRate: number
  previousAmount: number
  newAmount: number
  difference: number
  percentageChange: number
  reason: string
  notes?: string
  requiresApproval: boolean
  approvalStatus: 'pending_approval' | 'approved' | 'rejected' | 'applied'
  approvedBy?: string
  approvedDate?: string
  type: 'time' | 'rate' | 'both'
}

const APPROVAL_THRESHOLDS = {
  absoluteAmount: 100,
  percentageChange: 10,
}

export function useTimeAndRateAdjustment() {
  const { updateTimesheet, getTimesheetById, timesheets } = useTimesheetsCrud()
  const { user } = useAuth()

  const calculateRequiresApproval = useCallback((
    originalHours: number,
    originalRate: number,
    adjustedHours?: number,
    adjustedRate?: number
  ): boolean => {
    const originalTotal = originalHours * originalRate
    const newHours = adjustedHours ?? originalHours
    const newRate = adjustedRate ?? originalRate
    const newTotal = newHours * newRate
    const difference = Math.abs(newTotal - originalTotal)
    const percentageChange = originalTotal > 0 ? Math.abs((difference / originalTotal) * 100) : 0

    return (
      difference > APPROVAL_THRESHOLDS.absoluteAmount ||
      percentageChange > APPROVAL_THRESHOLDS.percentageChange
    )
  }, [])

  const createAdjustmentRecord = useCallback((
    input: TimeAndRateAdjustmentInput,
    userId: string,
    userName: string
  ): AdjustmentRecord => {
    const originalTotal = input.originalHours * input.originalRate
    const newHours = input.adjustedHours ?? input.originalHours
    const newRate = input.adjustedRate ?? input.originalRate
    const newTotal = newHours * newRate
    const difference = newTotal - originalTotal
    const percentageChange = originalTotal > 0 ? (difference / originalTotal) * 100 : 0

    return {
      id: `adj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      adjustmentDate: new Date().toISOString(),
      adjustedBy: userName,
      adjustedByUserId: userId,
      previousHours: input.originalHours,
      newHours,
      previousRate: input.originalRate,
      newRate,
      previousAmount: originalTotal,
      newAmount: newTotal,
      difference,
      percentageChange,
      reason: input.adjustmentReason,
      notes: input.notes,
      requiresApproval: input.approvalRequired,
      approvalStatus: input.approvalRequired ? 'pending_approval' : 'applied',
      type: input.adjustmentType,
    }
  }, [])

  const applyAdjustment = useCallback(async (
    input: TimeAndRateAdjustmentInput
  ): Promise<{ success: boolean; adjustmentId?: string; message: string }> => {
    try {
      const currentTimesheet = await getTimesheetById(input.timesheetId)
      
      if (!currentTimesheet) {
        return {
          success: false,
          message: 'Timesheet not found'
        }
      }

      const adjustmentRecord = createAdjustmentRecord(
        input,
        user?.id || 'unknown',
        user?.name || 'Unknown User'
      )

      const updates: any = {
        adjustments: [
          ...(currentTimesheet.adjustments || []),
          adjustmentRecord as any
        ]
      }

      if (!input.approvalRequired) {
        if (input.adjustedHours !== undefined) {
          updates.hours = input.adjustedHours
        }
        if (input.adjustedRate !== undefined) {
          updates.rate = input.adjustedRate
        }
        if (input.adjustedHours !== undefined || input.adjustedRate !== undefined) {
          const newHours = input.adjustedHours ?? input.originalHours
          const newRate = input.adjustedRate ?? input.originalRate
          updates.amount = newHours * newRate
        }
      } else {
        updates.status = 'pending'
      }

      await updateTimesheet(input.timesheetId, updates)

      return {
        success: true,
        adjustmentId: adjustmentRecord.id,
        message: input.approvalRequired
          ? 'Adjustment submitted for approval'
          : 'Adjustment applied successfully'
      }
    } catch (error) {
      console.error('Error applying adjustment:', error)
      return {
        success: false,
        message: 'Failed to apply adjustment'
      }
    }
  }, [user, createAdjustmentRecord, getTimesheetById, updateTimesheet])

  const approveAdjustment = useCallback(async (
    timesheetId: string,
    adjustmentId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const timesheet = await getTimesheetById(timesheetId)
      
      if (!timesheet) {
        return { success: false, message: 'Timesheet not found' }
      }

      const adjustment = (timesheet.adjustments || []).find(adj => adj.id === adjustmentId) as any
      
      if (!adjustment) {
        return { success: false, message: 'Adjustment not found' }
      }

      const updatedAdjustments = (timesheet.adjustments || []).map(adj => {
        const adjAny = adj as any
        return adjAny.id === adjustmentId
          ? {
              ...adjAny,
              approvalStatus: 'approved' as const,
              approvedBy: user?.name || 'Unknown User',
              approvedDate: new Date().toISOString()
            }
          : adjAny
      })

      const approvedAdj = updatedAdjustments.find((adj: any) => adj.id === adjustmentId) as any

      await updateTimesheet(timesheetId, {
        adjustments: updatedAdjustments as any,
        hours: approvedAdj.newHours,
        rate: approvedAdj.newRate,
        amount: approvedAdj.newAmount,
        status: 'approved'
      })

      return {
        success: true,
        message: 'Adjustment approved and applied'
      }
    } catch (error) {
      console.error('Error approving adjustment:', error)
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
      
      if (!timesheet) {
        return { success: false, message: 'Timesheet not found' }
      }

      const updatedAdjustments = (timesheet.adjustments || []).map(adj => {
        const adjAny = adj as any
        return adjAny.id === adjustmentId
          ? {
              ...adjAny,
              approvalStatus: 'rejected' as const,
              approvedBy: user?.name || 'Unknown User',
              approvedDate: new Date().toISOString(),
              rejectionReason
            }
          : adjAny
      })

      await updateTimesheet(timesheetId, {
        adjustments: updatedAdjustments as any
      })

      return {
        success: true,
        message: 'Adjustment rejected'
      }
    } catch (error) {
      console.error('Error rejecting adjustment:', error)
      return { success: false, message: 'Failed to reject adjustment' }
    }
  }, [user, getTimesheetById, updateTimesheet])

  const getAdjustmentHistory = useCallback(async (
    timesheetId: string
  ): Promise<AdjustmentRecord[]> => {
    try {
      const timesheet = await getTimesheetById(timesheetId)
      return (timesheet?.adjustments as any as AdjustmentRecord[]) || []
    } catch (error) {
      console.error('Error fetching adjustment history:', error)
      return []
    }
  }, [getTimesheetById])

  const getPendingAdjustments = useCallback((): Array<{
    timesheetId: string
    timesheet: any
    adjustment: AdjustmentRecord
  }> => {
    const pending: Array<{
      timesheetId: string
      timesheet: any
      adjustment: AdjustmentRecord
    }> = []

    timesheets.forEach(timesheet => {
      const pendingAdjs = (timesheet.adjustments || []).filter(
        (adj: any) => adj.approvalStatus === 'pending_approval'
      )
      pendingAdjs.forEach((adj: any) => {
        pending.push({
          timesheetId: timesheet.id,
          timesheet,
          adjustment: adj as AdjustmentRecord
        })
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
    APPROVAL_THRESHOLDS
  }
}
