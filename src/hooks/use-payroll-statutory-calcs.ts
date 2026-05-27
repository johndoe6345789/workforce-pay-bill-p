import { useCallback } from 'react'

export function usePAYEStatutoryCalcs() {
  const calculateCISDeduction = useCallback((grossPay: number, cisRate: number = 0.20): number => {
    return grossPay * cisRate
  }, [])

  const calculateStatutoryPayments = useCallback((
    weeklyRate: number,
    weeks: number,
    type: 'sick' | 'maternity' | 'paternity'
  ): number => {
    const rates = { sick: 116.75, maternity: 184.03, paternity: 184.03 }
    const weeklyAmount = Math.min(weeklyRate * 0.9, rates[type])
    return weeklyAmount * weeks
  }, [])

  return { calculateCISDeduction, calculateStatutoryPayments }
}
