import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import type { PayrollRun } from '@/lib/types'

export function usePayrollCrud() {
  const [payrollRuns, setPayrollRuns] = useIndexedDBState<PayrollRun[]>(STORES.PAYROLL_RUNS, [])

  const createPayrollRun = useCallback(async (payrollRun: Omit<PayrollRun, 'id'>) => {
    const newPayrollRun: PayrollRun = {
      ...payrollRun,
      id: `payroll-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    
    try {
      await indexedDB.create(STORES.PAYROLL_RUNS, newPayrollRun)
      setPayrollRuns(current => [...current, newPayrollRun])
      return newPayrollRun
    } catch (error) {
      console.error('Failed to create payroll run:', error)
      throw error
    }
  }, [setPayrollRuns])

  const updatePayrollRun = useCallback(async (id: string, updates: Partial<PayrollRun>) => {
    try {
      const existing = await indexedDB.read<PayrollRun>(STORES.PAYROLL_RUNS, id)
      if (!existing) throw new Error('Payroll run not found')

      const updated = { ...existing, ...updates }
      await indexedDB.update(STORES.PAYROLL_RUNS, updated)
      
      setPayrollRuns(current =>
        current.map(p => p.id === id ? updated : p)
      )
      return updated
    } catch (error) {
      console.error('Failed to update payroll run:', error)
      throw error
    }
  }, [setPayrollRuns])

  const deletePayrollRun = useCallback(async (id: string) => {
    try {
      await indexedDB.delete(STORES.PAYROLL_RUNS, id)
      setPayrollRuns(current => current.filter(p => p.id !== id))
    } catch (error) {
      console.error('Failed to delete payroll run:', error)
      throw error
    }
  }, [setPayrollRuns])

  const getPayrollRunById = useCallback(async (id: string) => {
    try {
      return await indexedDB.read<PayrollRun>(STORES.PAYROLL_RUNS, id)
    } catch (error) {
      console.error('Failed to get payroll run:', error)
      throw error
    }
  }, [])

  const getPayrollRunsByStatus = useCallback(async (status: string) => {
    try {
      return await indexedDB.readByIndex<PayrollRun>(STORES.PAYROLL_RUNS, 'status', status)
    } catch (error) {
      console.error('Failed to get payroll runs by status:', error)
      throw error
    }
  }, [])

  const bulkCreatePayrollRuns = useCallback(async (payrollRunsData: Omit<PayrollRun, 'id'>[]) => {
    try {
      const newPayrollRuns = payrollRunsData.map(data => ({
        ...data,
        id: `payroll-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }))

      await indexedDB.bulkCreate(STORES.PAYROLL_RUNS, newPayrollRuns)
      setPayrollRuns(current => [...current, ...newPayrollRuns])
      return newPayrollRuns
    } catch (error) {
      console.error('Failed to bulk create payroll runs:', error)
      throw error
    }
  }, [setPayrollRuns])

  const bulkUpdatePayrollRuns = useCallback(async (updates: { id: string; updates: Partial<PayrollRun> }[]) => {
    try {
      const updatedPayrollRuns = await Promise.all(
        updates.map(async ({ id, updates: data }) => {
          const existing = await indexedDB.read<PayrollRun>(STORES.PAYROLL_RUNS, id)
          if (!existing) throw new Error(`Payroll run ${id} not found`)
          return { ...existing, ...data }
        })
      )

      await indexedDB.bulkUpdate(STORES.PAYROLL_RUNS, updatedPayrollRuns)
      
      setPayrollRuns(current =>
        current.map(p => {
          const updated = updatedPayrollRuns.find(u => u.id === p.id)
          return updated || p
        })
      )
      
      return updatedPayrollRuns
    } catch (error) {
      console.error('Failed to bulk update payroll runs:', error)
      throw error
    }
  }, [setPayrollRuns])

  return {
    payrollRuns,
    createPayrollRun,
    updatePayrollRun,
    deletePayrollRun,
    getPayrollRunById,
    getPayrollRunsByStatus,
    bulkCreatePayrollRuns,
    bulkUpdatePayrollRuns
  }
}
