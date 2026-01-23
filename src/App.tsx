import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useNotifications } from '@/hooks/use-notifications'
import { useSampleData } from '@/hooks/use-sample-data'
import { toast } from 'sonner'
import { Sidebar } from '@/components/navigation'
import { NotificationCenter } from '@/components/NotificationCenter'
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
import type { 
  Timesheet, 
  Invoice, 
  PayrollRun, 
  Worker, 
  DashboardMetrics,
  ComplianceDocument,
  ComplianceStatus,
  Expense,
  ExpenseStatus,
  RateCard,
  InvoiceStatus,
  ShiftEntry
} from '@/lib/types'

export type View = 'dashboard' | 'timesheets' | 'billing' | 'payroll' | 'compliance' | 'expenses' | 'roadmap' | 'reports' | 'currency' | 'email-templates' | 'invoice-templates' | 'qr-scanner' | 'missing-timesheets' | 'purchase-orders' | 'onboarding' | 'audit-trail' | 'notification-rules' | 'batch-import' | 'rate-templates' | 'custom-reports' | 'holiday-pay' | 'contract-validation' | 'shift-patterns' | 'query-guide' | 'component-showcase' | 'business-logic-demo'

function App() {
  useSampleData()
  
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [currentEntity, setCurrentEntity] = useState('Main Agency')
  const [searchQuery, setSearchQuery] = useState('')
  const { notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications()
  
  const [timesheets = [], setTimesheets] = useKV<Timesheet[]>('timesheets', [])
  const [invoices = [], setInvoices] = useKV<Invoice[]>('invoices', [])
  const [payrollRuns = [], setPayrollRuns] = useKV<PayrollRun[]>('payroll-runs', [])
  const [workers = [], setWorkers] = useKV<Worker[]>('workers', [])
  const [complianceDocs = [], setComplianceDocs] = useKV<ComplianceDocument[]>('compliance-docs', [])
  const [expenses = [], setExpenses] = useKV<Expense[]>('expenses', [])
  const [rateCards = [], setRateCards] = useKV<RateCard[]>('rate-cards', [])

  const metrics: DashboardMetrics = {
    pendingTimesheets: timesheets.filter(t => t.status === 'pending').length,
    pendingApprovals: timesheets.filter(t => t.status === 'pending').length,
    overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
    complianceAlerts: complianceDocs.filter(d => d.status === 'expiring' || d.status === 'expired').length,
    monthlyRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    monthlyPayroll: payrollRuns.reduce((sum, pr) => sum + pr.totalAmount, 0),
    grossMargin: 0,
    activeWorkers: workers.filter(w => w.status === 'active').length,
    pendingExpenses: expenses.filter(e => e.status === 'pending').length
  }

  metrics.grossMargin = metrics.monthlyRevenue > 0 
    ? ((metrics.monthlyRevenue - metrics.monthlyPayroll) / metrics.monthlyRevenue) * 100 
    : 0

  const handleApproveTimesheet = (id: string) => {
    setTimesheets(current => {
      if (!current) return []
      return current.map(t => 
        t.id === id 
          ? { ...t, status: 'approved', approvedDate: new Date().toISOString() }
          : t
      )
    })
    const timesheet = timesheets.find(t => t.id === id)
    if (timesheet) {
      addNotification({
        type: 'timesheet',
        priority: 'medium',
        title: 'Timesheet Approved',
        message: `${timesheet.workerName}'s timesheet for ${new Date(timesheet.weekEnding).toLocaleDateString()} has been approved`,
        relatedId: id
      })
    }
    toast.success('Timesheet approved successfully')
  }

  const handleRejectTimesheet = (id: string) => {
    setTimesheets(current => {
      if (!current) return []
      return current.map(t => 
        t.id === id 
          ? { ...t, status: 'rejected' }
          : t
      )
    })
    const timesheet = timesheets.find(t => t.id === id)
    if (timesheet) {
      addNotification({
        type: 'timesheet',
        priority: 'medium',
        title: 'Timesheet Rejected',
        message: `${timesheet.workerName}'s timesheet for ${new Date(timesheet.weekEnding).toLocaleDateString()} has been rejected`,
        relatedId: id
      })
    }
    toast.error('Timesheet rejected')
  }

  const handleAdjustTimesheet = (timesheetId: string, adjustment: any) => {
    setTimesheets(current => {
      if (!current) return []
      return current.map(t => {
        if (t.id !== timesheetId) return t
        
        const newAdjustment = {
          id: `ADJ-${Date.now()}`,
          adjustmentDate: new Date().toISOString(),
          ...adjustment
        }
        
        return {
          ...t,
          hours: adjustment.newHours,
          rate: adjustment.newRate,
          amount: adjustment.newHours * adjustment.newRate,
          adjustments: [...(t.adjustments || []), newAdjustment]
        }
      })
    })
  }

  const handleCreateInvoice = (timesheetId: string) => {
    const timesheet = timesheets.find(t => t.id === timesheetId)
    if (!timesheet) return

    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(5, '0')}`,
      clientName: timesheet.clientName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: timesheet.amount,
      status: 'draft',
      currency: 'GBP'
    }

    setInvoices(current => [...(current || []), newInvoice])
    toast.success(`Invoice ${newInvoice.invoiceNumber} created`)
  }

  const handleCreateTimesheet = (data: {
    workerName: string
    clientName: string
    hours: number
    rate: number
    weekEnding: string
  }) => {
    const newTimesheet: Timesheet = {
      id: `TS-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: data.workerName,
      clientName: data.clientName,
      weekEnding: data.weekEnding,
      hours: data.hours,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      amount: data.hours * data.rate
    }

    setTimesheets(current => [...(current || []), newTimesheet])
    toast.success('Timesheet created successfully')
  }

  const handleCreateDetailedTimesheet = (data: {
    workerName: string
    clientName: string
    weekEnding: string
    shifts: ShiftEntry[]
    totalHours: number
    totalAmount: number
    baseRate: number
  }) => {
    const newTimesheet: Timesheet = {
      id: `TS-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: data.workerName,
      clientName: data.clientName,
      weekEnding: data.weekEnding,
      hours: data.totalHours,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      amount: data.totalAmount,
      rate: data.baseRate,
      shifts: data.shifts
    }

    setTimesheets(current => [...(current || []), newTimesheet])
    toast.success(`Detailed timesheet created with ${data.shifts.length} shifts`)
  }

  const handleBulkImport = (csvData: string) => {
    const lines = csvData.trim().split('\n')
    if (lines.length < 2) {
      toast.error('Invalid CSV format')
      return
    }

    const headers = lines[0].split(',').map(h => h.trim())
    const newTimesheets: Timesheet[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length !== headers.length) continue

      const workerName = values[headers.indexOf('workerName')] || values[0]
      const clientName = values[headers.indexOf('clientName')] || values[1]
      const hours = parseFloat(values[headers.indexOf('hours')] || values[2] || '0')
      const rate = parseFloat(values[headers.indexOf('rate')] || values[3] || '0')
      const weekEnding = values[headers.indexOf('weekEnding')] || values[4]

      if (workerName && clientName && hours > 0 && rate > 0) {
        newTimesheets.push({
          id: `TS-${Date.now()}-${i}`,
          workerId: `W-${Date.now()}-${i}`,
          workerName,
          clientName,
          weekEnding,
          hours,
          status: 'pending',
          submittedDate: new Date().toISOString(),
          amount: hours * rate
        })
      }
    }

    if (newTimesheets.length > 0) {
      setTimesheets(current => [...(current || []), ...newTimesheets])
      toast.success(`Imported ${newTimesheets.length} timesheets`)
    } else {
      toast.error('No valid timesheets found in CSV')
    }
  }

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(current => {
      if (!current) return []
      return current.map(inv =>
        inv.id === invoiceId
          ? { ...inv, status: 'sent' as InvoiceStatus }
          : inv
      )
    })
    toast.success('Invoice sent to client via email')
  }

  const handleUploadDocument = (data: {
    workerId: string
    workerName: string
    documentType: string
    expiryDate: string
  }) => {
    const expiryDateObj = new Date(data.expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.floor((expiryDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    let status: ComplianceStatus = 'valid'
    if (daysUntilExpiry < 0) status = 'expired'
    else if (daysUntilExpiry < 30) status = 'expiring'

    const newDoc: ComplianceDocument = {
      id: `DOC-${Date.now()}`,
      workerId: data.workerId,
      workerName: data.workerName,
      documentType: data.documentType,
      expiryDate: data.expiryDate,
      status,
      daysUntilExpiry
    }

    setComplianceDocs(current => [...(current || []), newDoc])
    
    if (status === 'expiring' || status === 'expired') {
      addNotification({
        type: 'compliance',
        priority: status === 'expired' ? 'urgent' : 'high',
        title: status === 'expired' ? 'Document Expired' : 'Document Expiring Soon',
        message: `${data.documentType} for ${data.workerName} ${status === 'expired' ? 'has expired' : `expires in ${daysUntilExpiry} days`}`,
        relatedId: newDoc.id
      })
    }
    
    toast.success('Document uploaded successfully')
  }

  const handleCreateExpense = (data: {
    workerName: string
    clientName: string
    date: string
    category: string
    description: string
    amount: number
    billable: boolean
  }) => {
    const newExpense: Expense = {
      id: `EXP-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: data.workerName,
      clientName: data.clientName,
      date: data.date,
      category: data.category,
      description: data.description,
      amount: data.amount,
      currency: 'GBP',
      status: 'pending',
      submittedDate: new Date().toISOString(),
      billable: data.billable
    }

    setExpenses(current => [...(current || []), newExpense])
    addNotification({
      type: 'expense',
      priority: 'low',
      title: 'New Expense Submitted',
      message: `${data.workerName} submitted a £${data.amount.toFixed(2)} expense`,
      relatedId: newExpense.id
    })
    toast.success('Expense created successfully')
  }

  const handleApproveExpense = (id: string) => {
    setExpenses(current => {
      if (!current) return []
      return current.map(e =>
        e.id === id
          ? { ...e, status: 'approved' as ExpenseStatus, approvedDate: new Date().toISOString() }
          : e
      )
    })
    toast.success('Expense approved')
  }

  const handleRejectExpense = (id: string) => {
    setExpenses(current => {
      if (!current) return []
      return current.map(e =>
        e.id === id
          ? { ...e, status: 'rejected' as ExpenseStatus }
          : e
      )
    })
    toast.error('Expense rejected')
  }

  const handleCreatePlacementInvoice = (invoice: Invoice) => {
    setInvoices(current => [...(current || []), invoice])
  }

  const handleCreateCreditNote = (creditNote: any, creditInvoice: Invoice) => {
    setInvoices(current => [...(current || []), creditInvoice])
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentEntity={currentEntity}
        setCurrentEntity={setCurrentEntity}
        metrics={metrics}
      />

      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex-1" />
            <NotificationCenter 
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {currentView === 'dashboard' && (
            <DashboardView metrics={metrics} />
          )}

          {currentView === 'timesheets' && (
            <TimesheetsView
              timesheets={timesheets}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onApprove={handleApproveTimesheet}
              onReject={handleRejectTimesheet}
              onCreateInvoice={handleCreateInvoice}
              onCreateTimesheet={handleCreateTimesheet}
              onCreateDetailedTimesheet={handleCreateDetailedTimesheet}
              onBulkImport={handleBulkImport}
              onAdjust={handleAdjustTimesheet}
            />
          )}

          {currentView === 'billing' && (
            <BillingView
              invoices={invoices}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSendInvoice={handleSendInvoice}
              onCreatePlacementInvoice={handleCreatePlacementInvoice}
              onCreateCreditNote={handleCreateCreditNote}
              rateCards={rateCards}
            />
          )}

          {currentView === 'payroll' && (
            <PayrollView 
              payrollRuns={payrollRuns}
              timesheets={timesheets}
              onPayrollComplete={(run) => {
                setPayrollRuns((current) => [...(current || []), run])
              }}
            />
          )}

          {currentView === 'expenses' && (
            <ExpensesView
              expenses={expenses}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onCreateExpense={handleCreateExpense}
              onApprove={handleApproveExpense}
              onReject={handleRejectExpense}
            />
          )}

          {currentView === 'compliance' && (
            <ComplianceView
              complianceDocs={complianceDocs}
              onUploadDocument={handleUploadDocument}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              invoices={invoices}
              payrollRuns={payrollRuns}
            />
          )}

          {currentView === 'missing-timesheets' && (
            <MissingTimesheetsReport
              workers={workers}
              timesheets={timesheets}
            />
          )}

          {currentView === 'currency' && (
            <CurrencyManagement />
          )}

          {currentView === 'qr-scanner' && (
            <QRTimesheetScanner
              onTimesheetScanned={(timesheet) => {
                const newTimesheet: Timesheet = {
                  ...timesheet,
                  id: `TS-${Date.now()}`,
                  status: 'pending',
                  submittedDate: new Date().toISOString()
                }
                setTimesheets(current => [...(current || []), newTimesheet])
              }}
            />
          )}

          {currentView === 'email-templates' && (
            <EmailTemplateManager />
          )}

          {currentView === 'invoice-templates' && (
            <InvoiceTemplateManager />
          )}

          {currentView === 'purchase-orders' && (
            <PurchaseOrderManager />
          )}

          {currentView === 'onboarding' && (
            <OnboardingWorkflowManager />
          )}

          {currentView === 'audit-trail' && (
            <AuditTrailViewer />
          )}

          {currentView === 'notification-rules' && (
            <NotificationRulesManager />
          )}

          {currentView === 'batch-import' && (
            <BatchImportManager
              onImportComplete={(data) => {
                toast.success(`Imported ${data.length} records`)
              }}
            />
          )}

          {currentView === 'rate-templates' && (
            <RateTemplateManager />
          )}

          {currentView === 'custom-reports' && (
            <CustomReportBuilder
              timesheets={timesheets}
              invoices={invoices}
              payrollRuns={payrollRuns}
              expenses={expenses}
            />
          )}

          {currentView === 'holiday-pay' && (
            <HolidayPayManager />
          )}

          {currentView === 'contract-validation' && (
            <ContractValidator
              timesheets={timesheets}
              rateCards={rateCards}
            />
          )}

          {currentView === 'shift-patterns' && (
            <ShiftPatternManager />
          )}

          {currentView === 'query-guide' && (
            <QueryLanguageGuide />
          )}

          {currentView === 'roadmap' && (
            <RoadmapView />
          )}

          {currentView === 'component-showcase' && (
            <ComponentShowcase />
          )}

          {currentView === 'business-logic-demo' && (
            <BusinessLogicDemo />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
