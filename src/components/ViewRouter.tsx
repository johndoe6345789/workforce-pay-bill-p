import { lazy, Suspense } from 'react'
import type { View } from '@/App'
import type { 
  Timesheet, 
  Invoice, 
  PayrollRun, 
  Worker, 
  ComplianceDocument,
  Expense,
  RateCard,
  DashboardMetrics
} from '@/lib/types'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
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
const PurchaseOrderManager = lazy(() => import('@/components/PurchaseOrderManager').then(m => ({ default: m.PurchaseOrderManager })))
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

interface ViewRouterProps {
  currentView: View
  searchQuery: string
  setSearchQuery: (query: string) => void
  metrics: DashboardMetrics
  timesheets: Timesheet[]
  invoices: Invoice[]
  payrollRuns: PayrollRun[]
  workers: Worker[]
  complianceDocs: ComplianceDocument[]
  expenses: Expense[]
  rateCards: RateCard[]
  setTimesheets: (updater: (current: Timesheet[]) => Timesheet[]) => void
  setPayrollRuns: (updater: (current: PayrollRun[]) => PayrollRun[]) => void
  actions: any
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function ViewRouter({
  currentView,
  searchQuery,
  setSearchQuery,
  metrics,
  timesheets,
  invoices,
  payrollRuns,
  workers,
  complianceDocs,
  expenses,
  rateCards,
  setTimesheets,
  setPayrollRuns,
  actions
}: ViewRouterProps) {
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView metrics={metrics} />

    case 'timesheets':
      return (
        <TimesheetsView
          timesheets={timesheets}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onApprove={actions.handleApproveTimesheet}
          onReject={actions.handleRejectTimesheet}
          onCreateInvoice={actions.handleCreateInvoice}
          onCreateTimesheet={actions.handleCreateTimesheet}
          onCreateDetailedTimesheet={actions.handleCreateDetailedTimesheet}
          onBulkImport={actions.handleBulkImport}
          onAdjust={actions.handleAdjustTimesheet}
        />
      )

    case 'billing':
      return (
        <BillingView
          invoices={invoices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSendInvoice={actions.handleSendInvoice}
          onCreatePlacementInvoice={actions.handleCreatePlacementInvoice}
          onCreateCreditNote={actions.handleCreateCreditNote}
          rateCards={rateCards}
        />
      )

    case 'payroll':
      return (
        <PayrollView 
          payrollRuns={payrollRuns}
          timesheets={timesheets}
          onPayrollComplete={(run) => {
            setPayrollRuns((current) => [...current, run])
          }}
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
      return (
        <ReportsView
          invoices={invoices}
          payrollRuns={payrollRuns}
        />
      )

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
      return <PurchaseOrderManager />

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
          invoices={invoices}
          payrollRuns={payrollRuns}
          expenses={expenses}
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

    default:
      return <DashboardView metrics={metrics} />
    }
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderView()}
    </Suspense>
  )
}
