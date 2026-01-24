import { useSampleData } from '@/hooks/use-sample-data'
import { useSampleWorkflowTemplates } from '@/hooks/use-sample-workflow-templates'
import { useNotifications } from '@/hooks/use-notifications'
import { useAppData } from '@/hooks/use-app-data'
import { useAppActions } from '@/hooks/use-app-actions'
import { useViewPreload } from '@/hooks/use-view-preload'
import { useLocaleInit } from '@/hooks/use-locale-init'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useSkipLink } from '@/hooks/use-skip-link'
import { useAnnounce } from '@/hooks/use-announce'
import { useSessionStorage } from '@/hooks/use-session-storage'
import { useSessionTimeout } from '@/hooks/use-session-timeout'
import { useSessionTimeoutPreferences } from '@/hooks/use-session-timeout-preferences'
import { Sidebar } from '@/components/navigation'
import { NotificationCenter } from '@/components/NotificationCenter'
import { ViewRouter } from '@/components/ViewRouter'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { KeyboardShortcutsDialog } from '@/components/KeyboardShortcutsDialog'
import { SessionExpiryDialog } from '@/components/SessionExpiryDialog'
import LoginScreen from '@/components/LoginScreen'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setCurrentView, setSearchQuery } from '@/store/slices/uiSlice'
import { setCurrentEntity } from '@/store/slices/authSlice'
import { Badge } from '@/components/ui/badge'
import { Code } from '@phosphor-icons/react'
import { useRef, useState } from 'react'

export type View = 'dashboard' | 'timesheets' | 'billing' | 'payroll' | 'compliance' | 'expenses' | 'roadmap' | 'reports' | 'currency' | 'email-templates' | 'invoice-templates' | 'qr-scanner' | 'missing-timesheets' | 'purchase-orders' | 'onboarding' | 'audit-trail' | 'notification-rules' | 'batch-import' | 'rate-templates' | 'custom-reports' | 'holiday-pay' | 'contract-validation' | 'shift-patterns' | 'query-guide' | 'component-showcase' | 'business-logic-demo' | 'data-admin' | 'translation-demo' | 'profile' | 'roles-permissions' | 'workflow-templates'

function App() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const currentEntity = useAppSelector(state => state.auth.currentEntity)
  const currentView = useAppSelector(state => state.ui.currentView)
  const searchQuery = useAppSelector(state => state.ui.searchQuery)
  const isDevelopment = import.meta.env.DEV
  const mainContentRef = useRef<HTMLElement>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const announce = useAnnounce()

  useSampleData()
  useSampleWorkflowTemplates()
  useViewPreload()
  useLocaleInit()
  useSkipLink(mainContentRef, 'Skip to main content')
  const { destroySession } = useSessionStorage()
  const { preferences: timeoutPreferences } = useSessionTimeoutPreferences()
  
  const { 
    isWarningShown, 
    timeRemaining, 
    extendSession, 
    config: timeoutConfig 
  } = useSessionTimeout({
    timeoutMinutes: timeoutPreferences?.timeoutMinutes ?? 30,
    warningMinutes: timeoutPreferences?.warningMinutes ?? 5,
    checkIntervalSeconds: 30,
  })
  
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

  const handleViewChange = (view: View) => {
    dispatch(setCurrentView(view))
    announce(`Navigated to ${view}`)
  }

  useKeyboardShortcuts([
    {
      key: '?',
      ctrl: true,
      description: 'Show keyboard shortcuts',
      action: () => setShowShortcuts(true)
    },
    {
      key: '1',
      alt: true,
      description: 'Go to Dashboard',
      action: () => handleViewChange('dashboard')
    },
    {
      key: '2',
      alt: true,
      description: 'Go to Timesheets',
      action: () => handleViewChange('timesheets')
    },
    {
      key: '3',
      alt: true,
      description: 'Go to Billing',
      action: () => handleViewChange('billing')
    },
    {
      key: '4',
      alt: true,
      description: 'Go to Payroll',
      action: () => handleViewChange('payroll')
    },
    {
      key: '5',
      alt: true,
      description: 'Go to Compliance',
      action: () => handleViewChange('compliance')
    },
  ], isAuthenticated)

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        currentView={currentView}
        setCurrentView={handleViewChange}
        currentEntity={currentEntity}
        setCurrentEntity={(entity) => dispatch(setCurrentEntity(entity))}
        metrics={metrics}
      />

      <main 
        ref={mainContentRef}
        id="main-content"
        className="flex-1 flex flex-col overflow-hidden"
        role="main"
        aria-label="Main content"
      >
        <div className="border-b border-border bg-card flex-shrink-0 z-10" role="banner">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex-1">
              {isDevelopment && (
                <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30 font-mono text-xs" role="status">
                  <Code className="mr-1.5" size={14} aria-hidden="true" />
                  Development Mode
                </Badge>
              )}
            </div>
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
            workers={workers}
            complianceDocs={complianceDocs}
            expenses={expenses}
            rateCards={rateCards}
            setTimesheets={setTimesheets}
            actions={actions}
          />
        </div>
      </main>

      <KeyboardShortcutsDialog 
        open={showShortcuts} 
        onOpenChange={setShowShortcuts}
      />

      <SessionExpiryDialog
        open={isWarningShown}
        timeRemaining={timeRemaining}
        totalWarningTime={timeoutConfig.warningMinutes * 60}
        onExtend={extendSession}
        onLogout={destroySession}
      />
    </div>
  )
}

export default App
