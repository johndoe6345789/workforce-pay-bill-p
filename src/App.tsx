import { useRef, useState, useCallback } from 'react'
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
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setCurrentView, setSearchQuery } from '@/store/slices/uiSlice'
import { setCurrentEntity } from '@/store/slices/authSlice'
import { AppLayout } from '@/components/AppLayout'
import { buildAppKeyboardShortcuts } from '@/lib/app-keyboard-shortcuts'
import LoginScreen from '@/components/LoginScreen'
import type { View } from '@/types/view'

export type { View } from '@/types/view'

function App() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const currentEntity = useAppSelector(state => state.auth.currentEntity)
  const currentView = useAppSelector(state => state.ui.currentView)
  const searchQuery = useAppSelector(state => state.ui.searchQuery)
  const translationsReady = useAppSelector(state => state.ui.translationsReady)
  const isDevelopment = import.meta.env.DEV
  const mainContentRef = useRef<HTMLElement>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const announce = useAnnounce()

  useSampleData()
  useSampleWorkflowTemplates()
  useViewPreload()
  const { isPreloading } = useLocaleInit()
  useSkipLink(mainContentRef, 'Skip to main content')
  const { destroySession } = useSessionStorage()
  const { preferences: timeoutPreferences } = useSessionTimeoutPreferences()
  const { isWarningShown, timeRemaining, extendSession, config: timeoutConfig } = useSessionTimeout({
    timeoutMinutes: timeoutPreferences?.timeoutMinutes ?? 30,
    warningMinutes: timeoutPreferences?.warningMinutes ?? 5,
    checkIntervalSeconds: 30,
  })
  const { notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications()
  const { timesheets, setTimesheets, invoices, setInvoices, payrollRuns, setPayrollRuns,
    workers, complianceDocs, setComplianceDocs, expenses, setExpenses, rateCards, metrics,
  } = useAppData({ liveRefresh: true, pollingInterval: 2000 })
  const actions = useAppActions(timesheets, setTimesheets, invoices, setInvoices,
    setComplianceDocs, setExpenses, addNotification)

  const handleViewChange = useCallback((view: View) => {
    dispatch(setCurrentView(view))
    announce(`Navigated to ${view}`, 'polite')
  }, [dispatch, announce])

  useKeyboardShortcuts(
    buildAppKeyboardShortcuts(handleViewChange, () => setShowShortcuts(true)),
    isAuthenticated,
  )

  if (!isAuthenticated) return <LoginScreen />
  if (isPreloading || !translationsReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading application...</p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout
      currentView={currentView} searchQuery={searchQuery}
      setSearchQuery={(q) => dispatch(setSearchQuery(q))}
      metrics={metrics} timesheets={timesheets} workers={workers}
      complianceDocs={complianceDocs} expenses={expenses} rateCards={rateCards}
      setTimesheets={setTimesheets} actions={actions}
      currentEntity={currentEntity}
      setCurrentEntity={(entity) => dispatch(setCurrentEntity(entity))}
      notifications={notifications} unreadCount={unreadCount}
      onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} onDelete={deleteNotification}
      isDevelopment={isDevelopment} mainContentRef={mainContentRef}
      onViewChange={handleViewChange} showShortcuts={showShortcuts} setShowShortcuts={setShowShortcuts}
      isWarningShown={isWarningShown} timeRemaining={timeRemaining}
      warningMinutes={timeoutConfig.warningMinutes}
      onExtend={extendSession} onLogout={destroySession}
    />
  )
}

export default App
