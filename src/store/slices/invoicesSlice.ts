import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Invoice {
  id: string
  clientName: string
  amount: number
  vat: number
  total: number
  status: string
  dueDate: string
  invoiceDate: string
  paidDate?: string
  currency: string
  timesheetIds: string[]
}

interface InvoicesState {
  invoices: Invoice[]
  loading: boolean
}

const initialState: InvoicesState = {
  invoices: [],
  loading: false,
}

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.push(action.payload)
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.invoices.findIndex(i => i.id === action.payload.id)
      if (index !== -1) {
        state.invoices[index] = action.payload
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(i => i.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setInvoices, addInvoice, updateInvoice, deleteInvoice, setLoading } = invoicesSlice.actions
export default invoicesSlice.reducer
