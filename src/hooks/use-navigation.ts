import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setCurrentView } from '@/store/slices/uiSlice'

type View = 'dashboard' | 'timesheets' | 'billing' | 'payroll' | 'compliance' | 'expenses' | 'roadmap' | 'reports' | 'currency' | 'email-templates' | 'invoice-templates' | 'qr-scanner' | 'missing-timesheets' | 'purchase-orders' | 'onboarding' | 'audit-trail' | 'notification-rules' | 'batch-import' | 'rate-templates' | 'custom-reports' | 'holiday-pay' | 'contract-validation' | 'shift-patterns' | 'query-guide' | 'component-showcase' | 'business-logic-demo' | 'data-admin' | 'translation-demo'

export function useNavigation() {
  const dispatch = useAppDispatch()
  const { currentView, searchQuery } = useAppSelector(state => state.ui)

  const navigateTo = (view: View) => {
    dispatch(setCurrentView(view))
  }

  return {
    currentView,
    searchQuery,
    navigateTo,
  }
}
