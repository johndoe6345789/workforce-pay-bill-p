import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Expense {
  id: string
  workerId: string
  workerName: string
  category: string
  amount: number
  currency: string
  date: string
  status: string
  description: string
  receiptUrl?: string
  billable: boolean
}

interface ExpensesState {
  expenses: Expense[]
  loading: boolean
}

const initialState: ExpensesState = {
  expenses: [],
  loading: false,
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload)
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(e => e.id === action.payload.id)
      if (index !== -1) {
        state.expenses[index] = action.payload
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setExpenses, addExpense, updateExpense, deleteExpense, setLoading } = expensesSlice.actions
export default expensesSlice.reducer
