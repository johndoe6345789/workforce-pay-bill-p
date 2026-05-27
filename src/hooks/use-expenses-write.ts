import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { Expense } from '@/lib/types'

type SetExpenses = (updater: (prev: Expense[]) => Expense[]) => void

export function useExpensesWrite(setExpenses: SetExpenses) {
  const createExpense = useCallback(
    async (expense: Omit<Expense, 'id'>) => {
      const newExpense: Expense = {
        ...expense,
        id: `expense-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      }
      try {
        await indexedDB.create(STORES.EXPENSES, newExpense)
        setExpenses(current => [...current, newExpense])
        return newExpense
      } catch (error) {
        console.error('Failed to create expense:', error)
        throw error
      }
    },
    [setExpenses]
  )

  const updateExpense = useCallback(
    async (id: string, updates: Partial<Expense>) => {
      try {
        const existing = await indexedDB.read<Expense>(STORES.EXPENSES, id)
        if (!existing) throw new Error('Expense not found')
        const updated = { ...existing, ...updates }
        await indexedDB.update(STORES.EXPENSES, updated)
        setExpenses(current => current.map(e => (e.id === id ? updated : e)))
        return updated
      } catch (error) {
        console.error('Failed to update expense:', error)
        throw error
      }
    },
    [setExpenses]
  )

  const deleteExpense = useCallback(
    async (id: string) => {
      try {
        await indexedDB.delete(STORES.EXPENSES, id)
        setExpenses(current => current.filter(e => e.id !== id))
      } catch (error) {
        console.error('Failed to delete expense:', error)
        throw error
      }
    },
    [setExpenses]
  )

  return { createExpense, updateExpense, deleteExpense }
}
