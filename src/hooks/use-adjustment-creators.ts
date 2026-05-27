import { useCallback } from 'react'
import { APPROVAL_THRESHOLDS } from './use-time-and-rate-adjustment.types'
import type { TimeAndRateAdjustmentInput, AdjustmentRecord } from './use-time-and-rate-adjustment.types'

export function useAdjustmentCreators() {
  const calculateRequiresApproval = useCallback((
    originalHours: number,
    originalRate: number,
    adjustedHours?: number,
    adjustedRate?: number
  ): boolean => {
    const originalTotal = originalHours * originalRate
    const newTotal = (adjustedHours ?? originalHours) * (adjustedRate ?? originalRate)
    const difference = Math.abs(newTotal - originalTotal)
    const percentageChange = originalTotal > 0 ? Math.abs((difference / originalTotal) * 100) : 0
    return difference > APPROVAL_THRESHOLDS.absoluteAmount || percentageChange > APPROVAL_THRESHOLDS.percentageChange
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
      percentageChange: originalTotal > 0 ? (difference / originalTotal) * 100 : 0,
      reason: input.adjustmentReason,
      notes: input.notes,
      requiresApproval: input.approvalRequired,
      approvalStatus: input.approvalRequired ? 'pending_approval' : 'applied',
      type: input.adjustmentType,
    }
  }, [])

  return { calculateRequiresApproval, createAdjustmentRecord }
}
