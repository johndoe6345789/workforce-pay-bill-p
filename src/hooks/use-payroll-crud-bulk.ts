import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { PayrollRun } from '@/lib/types'

type SetPayrollRuns = (updater: (current: PayrollRun[]) => PayrollRun[]) => void

function generateId() {
  return `payroll-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function usePayrollCrudBulk(setPayrollRuns: SetPayrollRuns) {
  const bulkCreatePayrollRuns = useCallback(
    async (payrollRunsData: Omit<PayrollRun, 'id'>[]) => {
      try {
        const newPayrollRuns = payrollRunsData.map(data => ({ ...data, id: generateId() }))
        await indexedDB.bulkCreate(STORES.PAYROLL_RUNS, newPayrollRuns)
        setPayrollRuns(current => [...current, ...newPayrollRuns])
        return newPayrollRuns
      } catch (error) {
        console.error('Failed to bulk create payroll runs:', error)
        throw error
      }
    },
    [setPayrollRuns],
  )

  const bulkUpdatePayrollRuns = useCallback(
    async (updates: { id: string; updates: Partial<PayrollRun> }[]) => {
      try {
        const updatedPayrollRuns = await Promise.all(
          updates.map(async ({ id, updates: data }) => {
            const existing = await indexedDB.read<PayrollRun>(STORES.PAYROLL_RUNS, id)
            if (!existing) throw new Error(`Payroll run ${id} not found`)
            return { ...existing, ...data }
          }),
        )

        await indexedDB.bulkUpdate(STORES.PAYROLL_RUNS, updatedPayrollRuns)

        setPayrollRuns(current =>
          current.map(p => {
            const updated = updatedPayrollRuns.find(u => u.id === p.id)
            return updated || p
          }),
        )

        return updatedPayrollRuns
      } catch (error) {
        console.error('Failed to bulk update payroll runs:', error)
        throw error
      }
    },
    [setPayrollRuns],
  )

  return { bulkCreatePayrollRuns, bulkUpdatePayrollRuns }
}
