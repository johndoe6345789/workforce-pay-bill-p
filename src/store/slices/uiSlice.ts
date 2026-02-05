import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type View = 'dashboard' | 'timesheets' | 'billing' | 'payroll' | 'compliance' | 'expenses' | 'roadmap' | 'reports' | 'currency' | 'email-templates' | 'invoice-templates' | 'qr-scanner' | 'missing-timesheets' | 'purchase-orders' | 'onboarding' | 'audit-trail' | 'notification-rules' | 'batch-import' | 'rate-templates' | 'custom-reports' | 'holiday-pay' | 'contract-validation' | 'shift-patterns' | 'query-guide' | 'component-showcase' | 'business-logic-demo' | 'data-admin' | 'translation-demo' | 'profile' | 'roles-permissions' | 'workflow-templates' | 'parallel-approval-demo' | 'scheduled-reports'

type Locale = 'en' | 'es' | 'fr'

interface UIState {
  currentView: View
  searchQuery: string
  sidebarCollapsed: boolean
  locale: Locale
  translationsReady: boolean
}

const initialState: UIState = {
  currentView: 'dashboard',
  searchQuery: '',
  sidebarCollapsed: false,
  locale: 'en',
  translationsReady: false,
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
    setTranslationsReady: (state, action: PayloadAction<boolean>) => {
      state.translationsReady = action.payload
    },
  },
})

export const { setCurrentView, setSearchQuery, toggleSidebar, setLocale, setTranslationsReady } = uiSlice.actions
export default uiSlice.reducer
