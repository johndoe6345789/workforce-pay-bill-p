import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { Expense } from '@/lib/types'

type SetExpenses = (updater: (prev: Expense[]) => Expense[]) => void

export function useExpensesBulk(setExpenses: SetExpenses) {
  const bulkCreateExpenses = useCallback(
    async (expensesData: Omit<Expense, 'id'>[]) => {
      try {
        const newExpenses = expensesData.map(data => ({
          ...data,
          id: `expense-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        }))
        await indexedDB.bulkCreate(STORES.EXPENSES, newExpenses)
        setExpenses(current => [...current, ...newExpenses])
        return newExpenses
      } catch (error) {
        console.error('Failed to bulk create expenses:', error)
        throw error
      }
    },
    [setExpenses]
  )

  const bulkUpdateExpenses = useCallback(
    async (updates: { id: string; updates: Partial<Expense> }[]) => {
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
          current.map(e => updatedExpenses.find(u => u.id === e.id) ?? e)
        )
        return updatedExpenses
      } catch (error) {
        console.error('Failed to bulk update expenses:', error)
        throw error
      }
    },
    [setExpenses]
  )

  return { bulkCreateExpenses, bulkUpdateExpenses }
}
