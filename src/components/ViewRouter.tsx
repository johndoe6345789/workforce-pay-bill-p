import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import type { View } from '@/App'
import type { 
  Timesheet, 
  Invoice, 
  PayrollRun, 
  Worker, 
  ComplianceDocument,
  Expense,
  RateCard,
  DashboardMetrics,
  AppActions
} from '@/lib/types'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ArrowCounterClockwise, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'

const DashboardView = lazy(() => import('@/components/views').then(m => ({ default: m.DashboardView })))
const TimesheetsView = lazy(() => import('@/components/views').then(m => ({ default: m.TimesheetsView })))
const BillingView = lazy(() => import('@/components/views').then(m => ({ default: m.BillingView })))
const PayrollView = lazy(() => import('@/components/views').then(m => ({ default: m.PayrollView })))
const ComplianceView = lazy(() => import('@/components/views').then(m => ({ default: m.ComplianceView })))
const ExpensesView = lazy(() => import('@/components/views').then(m => ({ default: m.ExpensesView })))
const ReportsView = lazy(() => import('@/components/ReportsView').then(m => ({ default: m.ReportsView })))
const CurrencyManagement = lazy(() => import('@/components/CurrencyManagement').then(m => ({ default: m.CurrencyManagement })))
const EmailTemplateManager = lazy(() => import('@/components/EmailTemplateManager').then(m => ({ default: m.EmailTemplateManager })))
const InvoiceTemplateManager = lazy(() => import('@/components/InvoiceTemplateManager').then(m => ({ default: m.InvoiceTemplateManager })))
const QRTimesheetScanner = lazy(() => import('@/components/QRTimesheetScanner').then(m => ({ default: m.QRTimesheetScanner })))
const MissingTimesheetsReport = lazy(() => import('@/components/MissingTimesheetsReport').then(m => ({ default: m.MissingTimesheetsReport })))
const PurchaseOrderTracking = lazy(() => import('@/components/PurchaseOrderTracking').then(m => ({ default: m.PurchaseOrderTracking })))
const OnboardingWorkflowManager = lazy(() => import('@/components/OnboardingWorkflowManager').then(m => ({ default: m.OnboardingWorkflowManager })))
const AuditTrailViewer = lazy(() => import('@/components/AuditTrailViewer').then(m => ({ default: m.AuditTrailViewer })))
const NotificationRulesManager = lazy(() => import('@/components/NotificationRulesManager').then(m => ({ default: m.NotificationRulesManager })))
const BatchImportManager = lazy(() => import('@/components/BatchImportManager').then(m => ({ default: m.BatchImportManager })))
const RateTemplateManager = lazy(() => import('@/components/RateTemplateManager').then(m => ({ default: m.RateTemplateManager })))
const CustomReportBuilder = lazy(() => import('@/components/CustomReportBuilder').then(m => ({ default: m.CustomReportBuilder })))
const HolidayPayManager = lazy(() => import('@/components/HolidayPayManager').then(m => ({ default: m.HolidayPayManager })))
const ContractValidator = lazy(() => import('@/components/ContractValidator').then(m => ({ default: m.ContractValidator })))
const ShiftPatternManager = lazy(() => import('@/components/ShiftPatternManager').then(m => ({ default: m.ShiftPatternManager })))
const QueryLanguageGuide = lazy(() => import('@/components/QueryLanguageGuide').then(m => ({ default: m.QueryLanguageGuide })))
const RoadmapView = lazy(() => import('@/components/roadmap-view').then(m => ({ default: m.RoadmapView })))
const ComponentShowcase = lazy(() => import('@/components/ComponentShowcase').then(m => ({ default: m.ComponentShowcase })))
const BusinessLogicDemo = lazy(() => import('@/components/BusinessLogicDemo').then(m => ({ default: m.BusinessLogicDemo })))
const DataAdminView = lazy(() => import('@/components/views/data-admin-view').then(m => ({ default: m.DataAdminView })))
const TranslationDemo = lazy(() => import('@/components/TranslationDemo').then(m => ({ default: m.TranslationDemo })))
const ProfileView = lazy(() => import('@/components/views/profile-view').then(m => ({ default: m.ProfileView })))
const RolesPermissionsView = lazy(() => import('@/components/views/roles-permissions-view').then(m => ({ default: m.RolesPermissionsView })))
const ApprovalWorkflowTemplateManager = lazy(() => import('@/components/ApprovalWorkflowTemplateManager').then(m => ({ default: m.ApprovalWorkflowTemplateManager })))
const ParallelApprovalDemo = lazy(() => import('@/components/ParallelApprovalDemo').then(m => ({ default: m.ParallelApprovalDemo })))

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
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-6">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <Warning size={20} />
          <AlertTitle>View Load Error</AlertTitle>
          <AlertDescription>
            Failed to load this view. This might be due to a temporary issue.
          </AlertDescription>
        </Alert>
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <p className="text-sm font-mono text-muted-foreground">{error.message}</p>
        </div>
        <Button onClick={resetErrorBoundary} className="w-full">
          <ArrowCounterClockwise size={18} className="mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  )
}

export function ViewRouter({
  currentView,
  searchQuery,
  setSearchQuery,
  metrics,
  timesheets,
  workers,
  complianceDocs,
  expenses,
  rateCards,
  setTimesheets,
  actions
}: ViewRouterProps) {
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView metrics={metrics} />

    case 'timesheets':
      return (
        <TimesheetsView
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreateInvoice={actions.handleCreateInvoice}
        />
      )

    case 'billing':
      return (
        <BillingView
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          rateCards={rateCards}
        />
      )

    case 'payroll':
      return (
        <PayrollView 
          timesheets={timesheets}
          workers={workers}
        />
      )

    case 'expenses':
      return (
        <ExpensesView
          expenses={expenses}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreateExpense={actions.handleCreateExpense}
          onApprove={actions.handleApproveExpense}
          onReject={actions.handleRejectExpense}
        />
      )

    case 'compliance':
      return (
        <ComplianceView
          complianceDocs={complianceDocs}
          onUploadDocument={actions.handleUploadDocument}
        />
      )

    case 'reports':
      return <ReportsView />

    case 'missing-timesheets':
      return (
        <MissingTimesheetsReport
          workers={workers}
          timesheets={timesheets}
        />
      )

    case 'currency':
      return <CurrencyManagement />

    case 'qr-scanner':
      return (
        <QRTimesheetScanner
          onTimesheetScanned={(timesheet) => {
            const newTimesheet: Timesheet = {
              ...timesheet,
              id: `TS-${Date.now()}`,
              status: 'pending',
              submittedDate: new Date().toISOString()
            }
            setTimesheets(current => [...current, newTimesheet])
          }}
        />
      )

    case 'email-templates':
      return <EmailTemplateManager />

    case 'invoice-templates':
      return <InvoiceTemplateManager />

    case 'purchase-orders':
      return <PurchaseOrderTracking />

    case 'onboarding':
      return <OnboardingWorkflowManager />

    case 'audit-trail':
      return <AuditTrailViewer />

    case 'notification-rules':
      return <NotificationRulesManager />

    case 'batch-import':
      return (
        <BatchImportManager
          onImportComplete={(data) => {
            toast.success(`Imported ${data.length} records`)
          }}
        />
      )

    case 'rate-templates':
      return <RateTemplateManager />

    case 'custom-reports':
      return (
        <CustomReportBuilder
          timesheets={timesheets}
        />
      )

    case 'holiday-pay':
      return <HolidayPayManager />

    case 'contract-validation':
      return (
        <ContractValidator
          timesheets={timesheets}
          rateCards={rateCards}
        />
      )

    case 'shift-patterns':
      return <ShiftPatternManager />

    case 'query-guide':
      return <QueryLanguageGuide />

    case 'roadmap':
      return <RoadmapView />

    case 'component-showcase':
      return <ComponentShowcase />

    case 'business-logic-demo':
      return <BusinessLogicDemo />

    case 'data-admin':
      return <DataAdminView />

    case 'translation-demo':
      return <TranslationDemo />

    case 'profile':
      return <ProfileView />

    case 'roles-permissions':
      return <RolesPermissionsView />

    case 'workflow-templates':
      return <ApprovalWorkflowTemplateManager />

    case 'parallel-approval-demo':
      return <ParallelApprovalDemo />

    default:
      return <DashboardView metrics={metrics} />
    }
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error) => {
        console.error('View render error:', error)
        toast.error('Failed to load view')
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        {renderView()}
      </Suspense>
    </ErrorBoundary>
  )
}
