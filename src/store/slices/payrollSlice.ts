import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PayrollRun {
  id: string
  periodStart: string
  periodEnd: string
  status: string
  totalWorkers: number
  totalAmount: number
  processedDate?: string
  paymentDate: string
}

interface PayrollState {
  payrollRuns: PayrollRun[]
  loading: boolean
}

const initialState: PayrollState = {
  payrollRuns: [],
  loading: false,
}

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    setPayrollRuns: (state, action: PayloadAction<PayrollRun[]>) => {
      state.payrollRuns = action.payload
    },
    addPayrollRun: (state, action: PayloadAction<PayrollRun>) => {
      state.payrollRuns.push(action.payload)
    },
    updatePayrollRun: (state, action: PayloadAction<PayrollRun>) => {
      const index = state.payrollRuns.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.payrollRuns[index] = action.payload
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setPayrollRuns, addPayrollRun, updatePayrollRun, setLoading } = payrollSlice.actions
export default payrollSlice.reducer
