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
import { 
  DashboardView,
  TimesheetsView,
  BillingView,
  PayrollView,
  ComplianceView,
  ExpensesView
} from '@/components/views'
import { ReportsView } from '@/components/ReportsView'
import { CurrencyManagement } from '@/components/CurrencyManagement'
import { EmailTemplateManager } from '@/components/EmailTemplateManager'
import { InvoiceTemplateManager } from '@/components/InvoiceTemplateManager'
import { QRTimesheetScanner } from '@/components/QRTimesheetScanner'
import { MissingTimesheetsReport } from '@/components/MissingTimesheetsReport'
import { PurchaseOrderManager } from '@/components/PurchaseOrderManager'
import { OnboardingWorkflowManager } from '@/components/OnboardingWorkflowManager'
import { AuditTrailViewer } from '@/components/AuditTrailViewer'
import { NotificationRulesManager } from '@/components/NotificationRulesManager'
import { BatchImportManager } from '@/components/BatchImportManager'
import { RateTemplateManager } from '@/components/RateTemplateManager'
import { CustomReportBuilder } from '@/components/CustomReportBuilder'
import { HolidayPayManager } from '@/components/HolidayPayManager'
import { ContractValidator } from '@/components/ContractValidator'
import { ShiftPatternManager } from '@/components/ShiftPatternManager'
import { QueryLanguageGuide } from '@/components/QueryLanguageGuide'
import { RoadmapView } from '@/components/roadmap-view'
import { ComponentShowcase } from '@/components/ComponentShowcase'
import { BusinessLogicDemo } from '@/components/BusinessLogicDemo'
import { toast } from 'sonner'

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

    default:
      return <DashboardView metrics={metrics} />
  }
}
