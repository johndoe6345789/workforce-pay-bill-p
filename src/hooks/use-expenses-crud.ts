import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import { useExpensesWrite } from './use-expenses-write'
import { useExpensesBulk } from './use-expenses-bulk'
import type { Expense } from '@/lib/types'

export function useExpensesCrud() {
  const [expenses, setExpenses] = useIndexedDBState<Expense[]>(
    STORES.EXPENSES, []
  )

  const { createExpense, updateExpense, deleteExpense } =
    useExpensesWrite(setExpenses)
  const { bulkCreateExpenses, bulkUpdateExpenses } =
    useExpensesBulk(setExpenses)

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
      return await indexedDB.readByIndex<Expense>(
        STORES.EXPENSES, 'workerId', workerId
      )
    } catch (error) {
      console.error('Failed to get expenses by worker:', error)
      throw error
    }
  }, [])

  const getExpensesByStatus = useCallback(async (status: string) => {
    try {
      return await indexedDB.readByIndex<Expense>(
        STORES.EXPENSES, 'status', status
      )
    } catch (error) {
      console.error('Failed to get expenses by status:', error)
      throw error
    }
  }, [])

  return {
    expenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    getExpensesByWorker,
    getExpensesByStatus,
    bulkCreateExpenses,
    bulkUpdateExpenses,
  }
}
