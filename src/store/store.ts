import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import timesheetsReducer from './slices/timesheetsSlice'
import invoicesReducer from './slices/invoicesSlice'
import payrollReducer from './slices/payrollSlice'
import complianceReducer from './slices/complianceSlice'
import expensesReducer from './slices/expensesSlice'
import notificationsReducer from './slices/notificationsSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    timesheets: timesheetsReducer,
    invoices: invoicesReducer,
    payroll: payrollReducer,
    compliance: complianceReducer,
    expenses: expensesReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
