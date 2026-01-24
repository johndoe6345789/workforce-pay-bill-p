import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import type { Expense } from '@/lib/types'

export function useExpensesCrud() {
  const [expenses, setExpenses] = useIndexedDBState<Expense[]>(STORES.EXPENSES, [])

  const createExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `expense-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    
    try {
      await indexedDB.create(STORES.EXPENSES, newExpense)
      setExpenses(current => [...current, newExpense])
      return newExpense
    } catch (error) {
      console.error('Failed to create expense:', error)
      throw error
    }
  }, [setExpenses])

  const updateExpense = useCallback(async (id: string, updates: Partial<Expense>) => {
    try {
      const existing = await indexedDB.read<Expense>(STORES.EXPENSES, id)
      if (!existing) throw new Error('Expense not found')

      const updated = { ...existing, ...updates }
      await indexedDB.update(STORES.EXPENSES, updated)
      
      setExpenses(current =>
        current.map(e => e.id === id ? updated : e)
      )
      return updated
    } catch (error) {
      console.error('Failed to update expense:', error)
      throw error
    }
  }, [setExpenses])

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await indexedDB.delete(STORES.EXPENSES, id)
      setExpenses(current => current.filter(e => e.id !== id))
    } catch (error) {
      console.error('Failed to delete expense:', error)
      throw error
    }
  }, [setExpenses])

  const getExpenseById = useCallback(async (id: string) => {
    try {
      return await indexedDB.read<Expense>(STORES.EXPENSES, id)
    } catch (error) {
      console.error('Failed to get expense:', error)
      throw error
    }
  }, [])

  const getExpensesByWorker = useCallback(async (workerId: string) => {
    try {
      return await indexedDB.readByIndex<Expense>(STORES.EXPENSES, 'workerId', workerId)
    } catch (error) {
      console.error('Failed to get expenses by worker:', error)
      throw error
    }
  }, [])

  const getExpensesByStatus = useCallback(async (status: string) => {
    try {
      return await indexedDB.readByIndex<Expense>(STORES.EXPENSES, 'status', status)
    } catch (error) {
      console.error('Failed to get expenses by status:', error)
      throw error
    }
  }, [])

  const bulkCreateExpenses = useCallback(async (expensesData: Omit<Expense, 'id'>[]) => {
    try {
      const newExpenses = expensesData.map(data => ({
        ...data,
        id: `expense-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }))

      await indexedDB.bulkCreate(STORES.EXPENSES, newExpenses)
      setExpenses(current => [...current, ...newExpenses])
      return newExpenses
    } catch (error) {
      console.error('Failed to bulk create expenses:', error)
      throw error
    }
  }, [setExpenses])

  const bulkUpdateExpenses = useCallback(async (updates: { id: string; updates: Partial<Expense> }[]) => {
    try {
      const updatedExpenses = await Promise.all(
        updates.map(async ({ id, updates: data }) => {
          const existing = await indexedDB.read<Expense>(STORES.EXPENSES, id)
          if (!existing) throw new Error(`Expense ${id} not found`)
          return { ...existing, ...data }
        })
      )

      await indexedDB.bulkUpdate(STORES.EXPENSES, updatedExpenses)
      
      setExpenses(current =>
        current.map(e => {
          const updated = updatedExpenses.find(u => u.id === e.id)
          return updated || e
        })
      )
      
      return updatedExpenses
    } catch (error) {
      console.error('Failed to bulk update expenses:', error)
      throw error
    }
  }, [setExpenses])

  return {
    expenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    getExpensesByWorker,
    getExpensesByStatus,
    bulkCreateExpenses,
    bulkUpdateExpenses
  }
}
