import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import type { View } from '@/App'
import type { Timesheet, Invoice, PayrollRun, Worker, ComplianceDocument, Expense, RateCard, DashboardMetrics, AppActions } from '@/lib/types'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'
import { ViewErrorFallback } from '@/components/view-router/ViewErrorFallback'
import {
  DashboardView, TimesheetsView, BillingView, PayrollView, ComplianceView, ExpensesView,
  ReportsView, CurrencyManagement, EmailTemplateManager, InvoiceTemplateManager,
  QRTimesheetScanner, MissingTimesheetsReport, PurchaseOrderTracking, OnboardingWorkflowManager,
  AuditTrailViewer, NotificationRulesManager, BatchImportManager, RateTemplateManager,
  CustomReportBuilder, HolidayPayManager, ContractValidator, ShiftPatternManager,
  QueryLanguageGuide, RoadmapView, ComponentShowcase, BusinessLogicDemo, DataAdminView,
  TranslationDemo, ProfileView, RolesPermissionsView, ApprovalWorkflowTemplateManager,
  ParallelApprovalDemo, ScheduledReportsManager,
} from '@/components/view-router/lazyViews'

interface ViewRouterProps {
  currentView: View
  searchQuery: string
  setSearchQuery: (query: string) => void
  metrics: DashboardMetrics
  timesheets: Timesheet[]
  workers: Worker[]
  complianceDocs: ComplianceDocument[]
  expenses: Expense[]
  rateCards: RateCard[]
  setTimesheets: (updater: (current: Timesheet[]) => Timesheet[]) => void
  actions: AppActions
}

function LoadingFallback() {
  return <div className="flex items-center justify-center h-full min-h-[400px]"><LoadingSpinner size="lg" /></div>
}

export function ViewRouter({ currentView, searchQuery, setSearchQuery, metrics, timesheets, workers, complianceDocs, expenses, rateCards, setTimesheets, actions }: ViewRouterProps) {
  const handleQRScan = (timesheet: Omit<Timesheet, 'id' | 'status' | 'submittedDate'>) => {
    setTimesheets(current => [...current, { ...timesheet, id: `TS-${Date.now()}`, status: 'pending', submittedDate: new Date().toISOString() }])
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView metrics={metrics} />
      case 'timesheets': return <TimesheetsView searchQuery={searchQuery} setSearchQuery={setSearchQuery} onCreateInvoice={actions.handleCreateInvoice} />
      case 'billing': return <BillingView searchQuery={searchQuery} setSearchQuery={setSearchQuery} rateCards={rateCards} />
      case 'payroll': return <PayrollView timesheets={timesheets} workers={workers} />
      case 'expenses': return <ExpensesView expenses={expenses} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onCreateExpense={actions.handleCreateExpense} onApprove={actions.handleApproveExpense} onReject={actions.handleRejectExpense} />
      case 'compliance': return <ComplianceView complianceDocs={complianceDocs} onUploadDocument={actions.handleUploadDocument} />
      case 'reports': return <ReportsView />
      case 'missing-timesheets': return <MissingTimesheetsReport workers={workers} timesheets={timesheets} />
      case 'currency': return <CurrencyManagement />
      case 'qr-scanner': return <QRTimesheetScanner onTimesheetScanned={handleQRScan as any} />
      case 'email-templates': return <EmailTemplateManager />
      case 'invoice-templates': return <InvoiceTemplateManager />
      case 'purchase-orders': return <PurchaseOrderTracking />
      case 'onboarding': return <OnboardingWorkflowManager />
      case 'audit-trail': return <AuditTrailViewer />
      case 'notification-rules': return <NotificationRulesManager />
      case 'batch-import': return <BatchImportManager onImportComplete={data => toast.success(`Imported ${data.length} records`)} />
      case 'rate-templates': return <RateTemplateManager />
      case 'custom-reports': return <CustomReportBuilder timesheets={timesheets} />
      case 'holiday-pay': return <HolidayPayManager />
      case 'contract-validation': return <ContractValidator timesheets={timesheets} rateCards={rateCards} />
      case 'shift-patterns': return <ShiftPatternManager />
      case 'query-guide': return <QueryLanguageGuide />
      case 'roadmap': return <RoadmapView />
      case 'component-showcase': return <ComponentShowcase />
      case 'business-logic-demo': return <BusinessLogicDemo />
      case 'data-admin': return <DataAdminView />
      case 'translation-demo': return <TranslationDemo />
      case 'profile': return <ProfileView />
      case 'roles-permissions': return <RolesPermissionsView />
      case 'workflow-templates': return <ApprovalWorkflowTemplateManager />
      case 'parallel-approval-demo': return <ParallelApprovalDemo />
      case 'scheduled-reports': return <ScheduledReportsManager />
      default: return <DashboardView metrics={metrics} />
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ViewErrorFallback} onReset={() => window.location.reload()} onError={error => { console.error('View render error:', error); toast.error('Failed to load view') }}>
      <Suspense fallback={<LoadingFallback />}>
        {renderView()}
      </Suspense>
    </ErrorBoundary>
  )
}
