import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type View = 'dashboard' | 'timesheets' | 'billing' | 'payroll' | 'compliance' | 'expenses' | 'roadmap' | 'reports' | 'currency' | 'email-templates' | 'invoice-templates' | 'qr-scanner' | 'missing-timesheets' | 'purchase-orders' | 'onboarding' | 'audit-trail' | 'notification-rules' | 'batch-import' | 'rate-templates' | 'custom-reports' | 'holiday-pay' | 'contract-validation' | 'shift-patterns' | 'query-guide' | 'component-showcase' | 'business-logic-demo' | 'data-admin' | 'translation-demo'

interface UIState {
  currentView: View
  searchQuery: string
  sidebarCollapsed: boolean
}

const initialState: UIState = {
  currentView: 'dashboard',
  searchQuery: '',
  sidebarCollapsed: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<View>) => {
      state.currentView = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
  },
})

export const { setCurrentView, setSearchQuery, toggleSidebar } = uiSlice.actions
export default uiSlice.reducer
