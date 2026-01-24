import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type View = 'dashboard' | 'timesheets' | 'billing' | 'payroll' | 'compliance' | 'expenses' | 'roadmap' | 'reports' | 'currency' | 'email-templates' | 'invoice-templates' | 'qr-scanner' | 'missing-timesheets' | 'purchase-orders' | 'onboarding' | 'audit-trail' | 'notification-rules' | 'batch-import' | 'rate-templates' | 'custom-reports' | 'holiday-pay' | 'contract-validation' | 'shift-patterns' | 'query-guide' | 'component-showcase' | 'business-logic-demo' | 'data-admin' | 'translation-demo' | 'profile' | 'roles-permissions' | 'workflow-templates' | 'parallel-approval-demo'

type Locale = 'en' | 'es' | 'fr'

interface UIState {
  currentView: View
  searchQuery: string
  sidebarCollapsed: boolean
  locale: Locale
}

const initialState: UIState = {
  currentView: 'dashboard',
  searchQuery: '',
  sidebarCollapsed: false,
  locale: 'en',
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
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload
    },
  },
})

export const { setCurrentView, setSearchQuery, toggleSidebar, setLocale } = uiSlice.actions
export default uiSlice.reducer
