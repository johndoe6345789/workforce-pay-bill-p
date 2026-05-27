import { useRef } from 'react'
import type { View } from '@/types/view'
import { Sidebar } from '@/components/navigation'
import { NotificationCenter } from '@/components/NotificationCenter'
import { ViewRouter } from '@/components/ViewRouter'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { KeyboardShortcutsDialog } from '@/components/KeyboardShortcutsDialog'
import { SessionExpiryDialog } from '@/components/SessionExpiryDialog'
import { Badge } from '@/components/ui/badge'
import { Code } from '@phosphor-icons/react'
import type { Notification } from '@/lib/types'

interface AppLayoutProps {
  currentView: View
  searchQuery: string
  setSearchQuery: (q: string) => void
  metrics: unknown
  timesheets: unknown[]
  workers: unknown[]
  complianceDocs: unknown[]
  expenses: unknown[]
  rateCards: unknown[]
  setTimesheets: (ts: unknown[]) => void
  actions: unknown
  currentEntity: string
  setCurrentEntity: (entity: string) => void
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  isDevelopment: boolean
  mainContentRef: React.RefObject<HTMLElement>
  onViewChange: (view: View) => void
  showShortcuts: boolean
  setShowShortcuts: (v: boolean) => void
  isWarningShown: boolean
  timeRemaining: number
  warningMinutes: number
  onExtend: () => void
  onLogout: () => void
}

export function AppLayout({
  currentView, searchQuery, setSearchQuery, metrics, timesheets, workers,
  complianceDocs, expenses, rateCards, setTimesheets, actions, currentEntity,
  setCurrentEntity, notifications, unreadCount, onMarkAsRead, onMarkAllAsRead,
  onDelete, isDevelopment, mainContentRef, onViewChange, showShortcuts,
  setShowShortcuts, isWarningShown, timeRemaining, warningMinutes, onExtend, onLogout,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        currentView={currentView} setCurrentView={onViewChange}
        currentEntity={currentEntity} setCurrentEntity={setCurrentEntity}
        metrics={metrics}
      />
      <main ref={mainContentRef} id="main-content" className="flex-1 flex flex-col overflow-hidden" role="main" aria-label="Main content">
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
              <NotificationCenter notifications={notifications} unreadCount={unreadCount}
                onMarkAsRead={onMarkAsRead} onMarkAllAsRead={onMarkAllAsRead} onDelete={onDelete} />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ViewRouter currentView={currentView} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            metrics={metrics} timesheets={timesheets} workers={workers} complianceDocs={complianceDocs}
            expenses={expenses} rateCards={rateCards} setTimesheets={setTimesheets} actions={actions} />
        </div>
      </main>
      <KeyboardShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
      <SessionExpiryDialog open={isWarningShown} timeRemaining={timeRemaining}
        totalWarningTime={warningMinutes * 60} onExtend={onExtend} onLogout={onLogout} />
    </div>
  )
}
