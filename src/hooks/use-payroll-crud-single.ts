import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { PayrollRun } from '@/lib/types'

type SetPayrollRuns = (updater: (current: PayrollRun[]) => PayrollRun[]) => void

function generateId() {
  return `payroll-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function usePayrollCrudSingle(setPayrollRuns: SetPayrollRuns) {
  const createPayrollRun = useCallback(async (payrollRun: Omit<PayrollRun, 'id'>) => {
    const newPayrollRun: PayrollRun = { ...payrollRun, id: generateId() }
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
      setPayrollRuns(current => current.map(p => p.id === id ? updated : p))
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

  return { createPayrollRun, updatePayrollRun, deletePayrollRun, getPayrollRunById, getPayrollRunsByStatus }
}
