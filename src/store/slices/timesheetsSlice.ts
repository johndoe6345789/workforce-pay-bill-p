import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Shift {
  date: string
  start: string
  end: string
  hours: number
  type: string
}

export interface Timesheet {
  id: string
  workerId: string
  workerName: string
  clientName: string
  weekEnding: string
  totalHours: number
  regularHours: number
  overtimeHours: number
  status: string
  rate: number
  total: number
  submittedDate: string
  approvedDate?: string
  shifts: Shift[]
}

interface TimesheetsState {
  timesheets: Timesheet[]
  loading: boolean
}

const initialState: TimesheetsState = {
  timesheets: [],
  loading: false,
}

const timesheetsSlice = createSlice({
  name: 'timesheets',
  initialState,
  reducers: {
    setTimesheets: (state, action: PayloadAction<Timesheet[]>) => {
      state.timesheets = action.payload
    },
    addTimesheet: (state, action: PayloadAction<Timesheet>) => {
      state.timesheets.push(action.payload)
    },
    updateTimesheet: (state, action: PayloadAction<Timesheet>) => {
      const index = state.timesheets.findIndex(t => t.id === action.payload.id)
      if (index !== -1) {
        state.timesheets[index] = action.payload
      }
    },
    deleteTimesheet: (state, action: PayloadAction<string>) => {
      state.timesheets = state.timesheets.filter(t => t.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setTimesheets, addTimesheet, updateTimesheet, deleteTimesheet, setLoading } = timesheetsSlice.actions
export default timesheetsSlice.reducer
