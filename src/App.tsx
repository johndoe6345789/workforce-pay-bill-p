import { useSampleData } from '@/hooks/use-sample-data'
import { useNotifications } from '@/hooks/use-notifications'
import { useAppData } from '@/hooks/use-app-data'
import { useAppActions } from '@/hooks/use-app-actions'
import { useViewPreload } from '@/hooks/use-view-preload'
import { Sidebar } from '@/components/navigation'
import { NotificationCenter } from '@/components/NotificationCenter'
import { ViewRouter } from '@/components/ViewRouter'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import LoginScreen from '@/components/LoginScreen'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setCurrentView, setSearchQuery } from '@/store/slices/uiSlice'
import { setCurrentEntity } from '@/store/slices/authSlice'

export type View = 'dashboard' | 'timesheets' | 'billing' | 'payroll' | 'compliance' | 'expenses' | 'roadmap' | 'reports' | 'currency' | 'email-templates' | 'invoice-templates' | 'qr-scanner' | 'missing-timesheets' | 'purchase-orders' | 'onboarding' | 'audit-trail' | 'notification-rules' | 'batch-import' | 'rate-templates' | 'custom-reports' | 'holiday-pay' | 'contract-validation' | 'shift-patterns' | 'query-guide' | 'component-showcase' | 'business-logic-demo' | 'data-admin' | 'translation-demo'

function App() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const currentEntity = useAppSelector(state => state.auth.currentEntity)
  const currentView = useAppSelector(state => state.ui.currentView)
  const searchQuery = useAppSelector(state => state.ui.searchQuery)

  useSampleData()
  useViewPreload()
  
  const { notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications()
  
  const {
    timesheets,
    setTimesheets,
    invoices,
    setInvoices,
    payrollRuns,
    setPayrollRuns,
    workers,
    complianceDocs,
    setComplianceDocs,
    expenses,
    setExpenses,
    rateCards,
    metrics
  } = useAppData()

  const actions = useAppActions(
    timesheets,
    setTimesheets,
    invoices,
    setInvoices,
    setComplianceDocs,
    setExpenses,
    addNotification
  )

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        currentView={currentView}
        setCurrentView={(view) => dispatch(setCurrentView(view as View))}
        currentEntity={currentEntity}
        setCurrentEntity={(entity) => dispatch(setCurrentEntity(entity))}
        metrics={metrics}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card flex-shrink-0 z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <NotificationCenter 
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={deleteNotification}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ViewRouter
            currentView={currentView}
            searchQuery={searchQuery}
            setSearchQuery={(query) => dispatch(setSearchQuery(query))}
            metrics={metrics}
            timesheets={timesheets}
            invoices={invoices}
            payrollRuns={payrollRuns}
            workers={workers}
            complianceDocs={complianceDocs}
            expenses={expenses}
            rateCards={rateCards}
            setTimesheets={setTimesheets}
            setPayrollRuns={setPayrollRuns}
            actions={actions}
          />
        </div>
      </main>
    </div>
  )
}

export default App
