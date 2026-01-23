import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useNotifications } from '@/hooks/use-notifications'
import { 
  Clock, 
  Receipt, 
  CurrencyDollar, 
  ShieldCheck, 
  ChartBar,
  Buildings,
  CheckCircle,
  XCircle,
  ClockCounterClockwise,
  Plus,
  MagnifyingGlass,
  Funnel,
  Download,
  ArrowUp,
  ArrowDown,
  Warning,
  MapTrifold,
  UploadSimple,
  FileCsv,
  Envelope,
  X,
  CalendarBlank,
  Notepad,
  Bell,
  Camera,
  ChartLine,
  CurrencyCircleDollar,
  QrCode,
  Palette,
  UserPlus,
  Gear,
  FileText,
  CaretDown,
  CaretRight
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
import { TimesheetAdjustmentWizard } from '@/components/TimesheetAdjustmentWizard'
import { BatchImportManager } from '@/components/BatchImportManager'
import { OneClickPayroll } from '@/components/OneClickPayroll'
import { RateTemplateManager } from '@/components/RateTemplateManager'
import { CustomReportBuilder } from '@/components/CustomReportBuilder'
import { HolidayPayManager } from '@/components/HolidayPayManager'
import { PermanentPlacementInvoice } from '@/components/PermanentPlacementInvoice'
import { CreditNoteGenerator } from '@/components/CreditNoteGenerator'
import { ShiftPremiumCalculator } from '@/components/ShiftPremiumCalculator'
import { ContractValidator } from '@/components/ContractValidator'
import { DetailedTimesheetEntry } from '@/components/DetailedTimesheetEntry'
import { ShiftPatternManager } from '@/components/ShiftPatternManager'
import type { 
  Timesheet, 
  Invoice, 
  PayrollRun, 
  Worker, 
  DashboardMetrics,
  ComplianceDocument,
  TimesheetStatus,
  InvoiceStatus,
  ComplianceStatus,
  Expense,
  ExpenseStatus,
  RateCard,
  ShiftEntry
} from '@/lib/types'

type View = 'dashboard' | 'timesheets' | 'billing' | 'payroll' | 'compliance' | 'expenses' | 'roadmap' | 'reports' | 'currency' | 'email-templates' | 'invoice-templates' | 'qr-scanner' | 'missing-timesheets' | 'purchase-orders' | 'onboarding' | 'audit-trail' | 'notification-rules' | 'batch-import' | 'rate-templates' | 'custom-reports' | 'holiday-pay' | 'contract-validation' | 'shift-patterns'

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [currentEntity, setCurrentEntity] = useState('Main Agency')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['core']))
  const { notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications()
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }
  
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
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-semibold tracking-tight">WorkForce Pro</h1>
          <p className="text-xs text-muted-foreground mt-1">Back Office Platform</p>
        </div>

        <div className="p-4 border-b border-border">
          <Select value={currentEntity} onValueChange={setCurrentEntity}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Buildings size={16} weight="fill" className="text-primary" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Main Agency">Main Agency</SelectItem>
              <SelectItem value="North Division">North Division</SelectItem>
              <SelectItem value="South Division">South Division</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem
            icon={<ChartBar size={20} />}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
          
          <NavGroup
            id="core"
            label="Core Operations"
            expanded={expandedGroups.has('core')}
            onToggle={() => toggleGroup('core')}
          >
            <NavItem
              icon={<Clock size={20} />}
              label="Timesheets"
              active={currentView === 'timesheets'}
              onClick={() => setCurrentView('timesheets')}
              badge={metrics.pendingTimesheets}
            />
            <NavItem
              icon={<Receipt size={20} />}
              label="Billing"
              active={currentView === 'billing'}
              onClick={() => setCurrentView('billing')}
              badge={metrics.overdueInvoices}
            />
            <NavItem
              icon={<CurrencyDollar size={20} />}
              label="Payroll"
              active={currentView === 'payroll'}
              onClick={() => setCurrentView('payroll')}
            />
            <NavItem
              icon={<Notepad size={20} />}
              label="Expenses"
              active={currentView === 'expenses'}
              onClick={() => setCurrentView('expenses')}
              badge={metrics.pendingExpenses}
            />
            <NavItem
              icon={<ShieldCheck size={20} />}
              label="Compliance"
              active={currentView === 'compliance'}
              onClick={() => setCurrentView('compliance')}
              badge={metrics.complianceAlerts}
            />
          </NavGroup>

          <NavGroup
            id="reports"
            label="Reports & Analytics"
            expanded={expandedGroups.has('reports')}
            onToggle={() => toggleGroup('reports')}
          >
            <NavItem
              icon={<ChartLine size={20} />}
              label="Reports"
              active={currentView === 'reports'}
              onClick={() => setCurrentView('reports')}
            />
            <NavItem
              icon={<ChartBar size={20} />}
              label="Custom Reports"
              active={currentView === 'custom-reports'}
              onClick={() => setCurrentView('custom-reports')}
            />
            <NavItem
              icon={<ClockCounterClockwise size={20} />}
              label="Missing Timesheets"
              active={currentView === 'missing-timesheets'}
              onClick={() => setCurrentView('missing-timesheets')}
            />
          </NavGroup>

          <NavGroup
            id="configuration"
            label="Configuration"
            expanded={expandedGroups.has('configuration')}
            onToggle={() => toggleGroup('configuration')}
          >
            <NavItem
              icon={<CurrencyCircleDollar size={20} />}
              label="Currency"
              active={currentView === 'currency'}
              onClick={() => setCurrentView('currency')}
            />
            <NavItem
              icon={<CurrencyCircleDollar size={20} />}
              label="Rate Templates"
              active={currentView === 'rate-templates'}
              onClick={() => setCurrentView('rate-templates')}
            />
            <NavItem
              icon={<Clock size={20} />}
              label="Shift Patterns"
              active={currentView === 'shift-patterns'}
              onClick={() => setCurrentView('shift-patterns')}
            />
            <NavItem
              icon={<Envelope size={20} />}
              label="Email Templates"
              active={currentView === 'email-templates'}
              onClick={() => setCurrentView('email-templates')}
            />
            <NavItem
              icon={<Palette size={20} />}
              label="Invoice Templates"
              active={currentView === 'invoice-templates'}
              onClick={() => setCurrentView('invoice-templates')}
            />
            <NavItem
              icon={<Gear size={20} />}
              label="Notification Rules"
              active={currentView === 'notification-rules'}
              onClick={() => setCurrentView('notification-rules')}
            />
            <NavItem
              icon={<ShieldCheck size={20} />}
              label="Contract Validation"
              active={currentView === 'contract-validation'}
              onClick={() => setCurrentView('contract-validation')}
            />
          </NavGroup>

          <NavGroup
            id="tools"
            label="Tools & Utilities"
            expanded={expandedGroups.has('tools')}
            onToggle={() => toggleGroup('tools')}
          >
            <NavItem
              icon={<QrCode size={20} />}
              label="QR Scanner"
              active={currentView === 'qr-scanner'}
              onClick={() => setCurrentView('qr-scanner')}
            />
            <NavItem
              icon={<UploadSimple size={20} />}
              label="Batch Import"
              active={currentView === 'batch-import'}
              onClick={() => setCurrentView('batch-import')}
            />
            <NavItem
              icon={<FileText size={20} />}
              label="Purchase Orders"
              active={currentView === 'purchase-orders'}
              onClick={() => setCurrentView('purchase-orders')}
            />
            <NavItem
              icon={<UserPlus size={20} />}
              label="Onboarding"
              active={currentView === 'onboarding'}
              onClick={() => setCurrentView('onboarding')}
            />
            <NavItem
              icon={<CalendarBlank size={20} />}
              label="Holiday Pay"
              active={currentView === 'holiday-pay'}
              onClick={() => setCurrentView('holiday-pay')}
            />
            <NavItem
              icon={<ClockCounterClockwise size={20} />}
              label="Audit Trail"
              active={currentView === 'audit-trail'}
              onClick={() => setCurrentView('audit-trail')}
            />
          </NavGroup>

          <Separator className="my-2" />
          <NavItem
            icon={<MapTrifold size={20} />}
            label="Roadmap"
            active={currentView === 'roadmap'}
            onClick={() => setCurrentView('roadmap')}
          />
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@workforce.io</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-96">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={cn(
                              'p-3 rounded-lg mb-2 cursor-pointer hover:bg-muted/50 transition-colors',
                              !notif.read && 'bg-accent/10'
                            )}
                            onClick={() => markAsRead(notif.id)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-sm">{notif.title}</p>
                                  {!notif.read && (
                                    <div className="w-2 h-2 rounded-full bg-accent" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(notif.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notif.id)
                                }}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
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
            <>
              <PayrollView payrollRuns={payrollRuns} />
              <OneClickPayroll 
                timesheets={timesheets}
                onPayrollComplete={(run) => {
                  setPayrollRuns((current) => [...(current || []), run])
                }}
              />
            </>
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

          {currentView === 'roadmap' && (
            <RoadmapView />
          )}
        </div>
      </main>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  badge?: number
}

function NavItem({ icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        active 
          ? 'bg-accent text-accent-foreground' 
          : 'text-foreground hover:bg-muted'
      )}
    >
      <span className={active ? 'text-accent-foreground' : 'text-muted-foreground'}>
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
          {badge}
        </Badge>
      )}
    </button>
  )
}

interface NavGroupProps {
  id: string
  label: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function NavGroup({ label, expanded, onToggle, children }: NavGroupProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      >
        {expanded ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
        <span className="flex-1 text-left">{label}</span>
      </button>
      {expanded && (
        <div className="space-y-1 pl-2">
          {children}
        </div>
      )}
    </div>
  )
}

interface DashboardViewProps {
  metrics: DashboardMetrics
}

function DashboardView({ metrics }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Real-time overview of your workforce operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Approvals"
          value={metrics.pendingApprovals}
          icon={<ClockCounterClockwise size={20} className="text-warning" />}
          trend={{ value: 12, direction: 'up' }}
          variant="warning"
        />
        <MetricCard
          title="Pending Expenses"
          value={metrics.pendingExpenses}
          icon={<Notepad size={20} className="text-info" />}
          variant="default"
        />
        <MetricCard
          title="Overdue Invoices"
          value={metrics.overdueInvoices}
          icon={<Receipt size={20} className="text-destructive" />}
          trend={{ value: 5, direction: 'down' }}
          variant="error"
        />
        <MetricCard
          title="Compliance Alerts"
          value={metrics.complianceAlerts}
          icon={<Warning size={20} className="text-warning" />}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
            <CardDescription>Total invoiced this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              £{metrics.monthlyRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <ArrowUp size={16} weight="bold" />
              <span>12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Payroll</CardTitle>
            <CardDescription>Total payroll costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              £{metrics.monthlyPayroll.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <ArrowUp size={16} weight="bold" />
              <span>8.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Gross Margin</CardTitle>
            <CardDescription>Revenue minus payroll</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              {metrics.grossMargin.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <ArrowUp size={16} weight="bold" />
              <span>3.2% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest timesheet and billing events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                icon={<CheckCircle size={18} className="text-success" />}
                title="Timesheet approved"
                description="John Smith - Week ending 15 Jan 2025"
                time="5 minutes ago"
              />
              <ActivityItem
                icon={<Receipt size={18} className="text-info" />}
                title="Invoice generated"
                description="INV-00234 - Acme Corp - £2,450"
                time="12 minutes ago"
              />
              <ActivityItem
                icon={<CheckCircle size={18} className="text-success" />}
                title="Payroll completed"
                description="Weekly run - 45 workers - £28,900"
                time="1 hour ago"
              />
              <ActivityItem
                icon={<Warning size={18} className="text-warning" />}
                title="Document expiring soon"
                description="DBS check for Sarah Johnson - 14 days"
                time="2 hours ago"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks and workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Clock size={18} className="mr-2" />
              Create Timesheet
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Receipt size={18} className="mr-2" />
              Generate Invoice
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CurrencyDollar size={18} className="mr-2" />
              Run Payroll
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download size={18} className="mr-2" />
              Export Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  icon: React.ReactNode
  trend?: { value: number; direction: 'up' | 'down' }
  variant?: 'default' | 'success' | 'warning' | 'error'
}

function MetricCard({ title, value, icon, trend, variant = 'default' }: MetricCardProps) {
  const borderColors = {
    default: 'border-border',
    success: 'border-success/20',
    warning: 'border-warning/20',
    error: 'border-destructive/20'
  }

  return (
    <Card className={cn('border-l-4', borderColors[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 mt-1 text-xs',
            trend.direction === 'up' ? 'text-success' : 'text-muted-foreground'
          )}>
            {trend.direction === 'up' ? (
              <ArrowUp size={14} weight="bold" />
            ) : (
              <ArrowDown size={14} weight="bold" />
            )}
            <span>{trend.value}% vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ActivityItemProps {
  icon: React.ReactNode
  title: string
  description: string
  time: string
}

function ActivityItem({ icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  )
}

interface TimesheetsViewProps {
  timesheets: Timesheet[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
  onCreateTimesheet: (data: {
    workerName: string
    clientName: string
    hours: number
    rate: number
    weekEnding: string
  }) => void
  onCreateDetailedTimesheet: (data: {
    workerName: string
    clientName: string
    weekEnding: string
    shifts: ShiftEntry[]
    totalHours: number
    totalAmount: number
    baseRate: number
  }) => void
  onBulkImport: (csvData: string) => void
  onAdjust: (timesheetId: string, adjustment: any) => void
}

function TimesheetsView({ 
  timesheets, 
  searchQuery, 
  setSearchQuery, 
  onApprove, 
  onReject,
  onCreateInvoice,
  onCreateTimesheet,
  onCreateDetailedTimesheet,
  onBulkImport,
  onAdjust
}: TimesheetsViewProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | TimesheetStatus>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null)
  const [formData, setFormData] = useState({
    workerName: '',
    clientName: '',
    hours: '',
    rate: '',
    weekEnding: ''
  })
  const [csvData, setCsvData] = useState('')

  const filteredTimesheets = timesheets.filter(t => {
    const matchesSearch = t.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmitCreate = () => {
    if (!formData.workerName || !formData.clientName || !formData.hours || !formData.rate || !formData.weekEnding) {
      toast.error('Please fill in all fields')
      return
    }

    onCreateTimesheet({
      workerName: formData.workerName,
      clientName: formData.clientName,
      hours: parseFloat(formData.hours),
      rate: parseFloat(formData.rate),
      weekEnding: formData.weekEnding
    })

    setFormData({
      workerName: '',
      clientName: '',
      hours: '',
      rate: '',
      weekEnding: ''
    })
    setIsCreateDialogOpen(false)
  }

  const handleSubmitBulkImport = () => {
    if (!csvData.trim()) {
      toast.error('Please paste CSV data')
      return
    }

    onBulkImport(csvData)
    setCsvData('')
    setIsBulkImportOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Timesheets</h2>
          <p className="text-muted-foreground mt-1">Manage and approve worker timesheets</p>
        </div>
        <div className="flex gap-2">
          <DetailedTimesheetEntry onSubmit={onCreateDetailedTimesheet} />
          <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileCsv size={18} className="mr-2" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Import Timesheets</DialogTitle>
                <DialogDescription>
                  Paste CSV data with columns: workerName, clientName, hours, rate, weekEnding
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="workerName,clientName,hours,rate,weekEnding&#10;John Smith,Acme Corp,40,25.50,2025-01-17&#10;Jane Doe,Tech Ltd,37.5,30.00,2025-01-17"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsBulkImportOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitBulkImport}>Import Timesheets</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Create Timesheet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Timesheet</DialogTitle>
                <DialogDescription>
                  Enter timesheet details manually
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="worker">Worker Name</Label>
                  <Input
                    id="worker"
                    placeholder="Enter worker name"
                    value={formData.workerName}
                    onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    placeholder="Enter client name"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekEnding">Week Ending</Label>
                  <Input
                    id="weekEnding"
                    type="date"
                    value={formData.weekEnding}
                    onChange={(e) => setFormData({ ...formData, weekEnding: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      placeholder="37.5"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate (£/hr)</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      placeholder="25.00"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitCreate}>Create Timesheet</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder="Search by worker or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Funnel size={16} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({timesheets.filter(t => t.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({timesheets.filter(t => t.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({timesheets.filter(t => t.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredTimesheets
            .filter(t => t.status === 'pending')
            .map(timesheet => (
              <TimesheetCard
                key={timesheet.id}
                timesheet={timesheet}
                onApprove={onApprove}
                onReject={onReject}
                onCreateInvoice={onCreateInvoice}
                onAdjust={setSelectedTimesheet}
              />
            ))}
          {filteredTimesheets.filter(t => t.status === 'pending').length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending timesheets to review</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredTimesheets
            .filter(t => t.status === 'approved')
            .map(timesheet => (
              <TimesheetCard
                key={timesheet.id}
                timesheet={timesheet}
                onApprove={onApprove}
                onReject={onReject}
                onCreateInvoice={onCreateInvoice}
                onAdjust={setSelectedTimesheet}
              />
            ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredTimesheets
            .filter(t => t.status === 'rejected')
            .map(timesheet => (
              <TimesheetCard
                key={timesheet.id}
                timesheet={timesheet}
                onApprove={onApprove}
                onReject={onReject}
                onCreateInvoice={onCreateInvoice}
                onAdjust={setSelectedTimesheet}
              />
            ))}
        </TabsContent>
      </Tabs>

      {selectedTimesheet && (
        <TimesheetAdjustmentWizard
          timesheet={selectedTimesheet}
          open={selectedTimesheet !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedTimesheet(null)
          }}
          onAdjust={onAdjust}
        />
      )}
    </div>
  )
}

interface TimesheetCardProps {
  timesheet: Timesheet
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
  onAdjust?: (timesheet: Timesheet) => void
}

function TimesheetCard({ timesheet, onApprove, onReject, onCreateInvoice, onAdjust }: TimesheetCardProps) {
  const [showShifts, setShowShifts] = useState(false)
  
  const statusConfig = {
    pending: { icon: ClockCounterClockwise, color: 'text-warning' },
    approved: { icon: CheckCircle, color: 'text-success' },
    rejected: { icon: XCircle, color: 'text-destructive' },
    processing: { icon: Clock, color: 'text-info' }
  }

  const StatusIcon = statusConfig[timesheet.status].icon

  const getShiftBadgeColor = (shiftType: string) => {
    switch (shiftType) {
      case 'night': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'evening': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'weekend': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'holiday': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'overtime': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'early-morning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const hasShifts = timesheet.shifts && timesheet.shifts.length > 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-4">
              <StatusIcon 
                size={24} 
                weight="fill" 
                className={statusConfig[timesheet.status].color}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{timesheet.workerName}</h3>
                  <Badge variant={timesheet.status === 'approved' ? 'success' : timesheet.status === 'rejected' ? 'destructive' : 'warning'}>
                    {timesheet.status}
                  </Badge>
                  {hasShifts && (
                    <Badge variant="outline" className="text-xs">
                      {timesheet.shifts!.length} shifts
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{timesheet.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Week Ending</p>
                    <p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hours</p>
                    <p className="font-medium font-mono">{timesheet.hours.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium font-mono">£{timesheet.amount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Submitted {new Date(timesheet.submittedDate).toLocaleDateString()}
                  {timesheet.approvedDate && ` • Approved ${new Date(timesheet.approvedDate).toLocaleDateString()}`}
                </div>

                {hasShifts && (
                  <div className="mt-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowShifts(!showShifts)}
                      className="h-8 px-2 text-xs"
                    >
                      {showShifts ? 'Hide' : 'Show'} Shift Details
                      <CaretDown size={14} className={cn('ml-1 transition-transform', showShifts && 'rotate-180')} />
                    </Button>
                    
                    {showShifts && (
                      <div className="mt-3 space-y-2 pl-4 border-l-2 border-accent/30">
                        {timesheet.shifts!.map((shift) => (
                          <div key={shift.id} className="flex items-center justify-between text-xs bg-muted/30 rounded p-2">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">
                                {new Date(shift.date).toLocaleDateString('en-GB', { 
                                  weekday: 'short', 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </span>
                              <Badge className={getShiftBadgeColor(shift.shiftType)}>
                                {shift.shiftType}
                              </Badge>
                              <span className="font-mono text-muted-foreground">
                                {shift.startTime} - {shift.endTime}
                              </span>
                              {shift.rateMultiplier > 1.0 && (
                                <Badge variant="outline" className="text-xs">
                                  {shift.rateMultiplier}x
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono">{shift.hours.toFixed(2)}h</span>
                              <span className="font-mono font-semibold">£{shift.amount.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            {timesheet.status === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onApprove(timesheet.id)}
                  style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onReject(timesheet.id)}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </Button>
              </>
            )}
            {(timesheet.status === 'approved' || timesheet.status === 'pending') && onAdjust && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAdjust(timesheet)}
              >
                <ClockCounterClockwise size={16} className="mr-2" />
                Adjust
              </Button>
            )}
            {timesheet.status === 'approved' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onCreateInvoice(timesheet.id)}
              >
                <Receipt size={16} className="mr-2" />
                Create Invoice
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface BillingViewProps {
  invoices: Invoice[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSendInvoice: (invoiceId: string) => void
  onCreatePlacementInvoice: (invoice: Invoice) => void
  onCreateCreditNote: (creditNote: any, creditInvoice: Invoice) => void
  rateCards: RateCard[]
}

function BillingView({ invoices, searchQuery, setSearchQuery, onSendInvoice, onCreatePlacementInvoice, onCreateCreditNote, rateCards }: BillingViewProps) {
  const filteredInvoices = invoices.filter(i =>
    i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Billing & Invoicing</h2>
          <p className="text-muted-foreground mt-1">Manage invoices and track payments</p>
        </div>
        <div className="flex gap-2">
          <PermanentPlacementInvoice onCreateInvoice={onCreatePlacementInvoice} />
          <CreditNoteGenerator invoices={invoices} onCreateCreditNote={onCreateCreditNote} />
          <Button>
            <Plus size={18} className="mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder="Search by invoice number or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      <div className="space-y-3">
        {filteredInvoices.map(invoice => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Receipt size={20} className="text-primary" />
                    <h3 className="font-semibold text-lg font-mono">{invoice.invoiceNumber}</h3>
                    <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'destructive' : 'warning'}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{invoice.clientName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issue Date</p>
                      <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold font-mono text-lg">
                        {invoice.currency === 'GBP' ? '£' : '$'}{invoice.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Currency</p>
                      <p className="font-medium font-mono">{invoice.currency}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {invoice.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => onSendInvoice(invoice.id)}
                    >
                      <Envelope size={16} className="mr-2" />
                      Send
                    </Button>
                  )}
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">
                    <Download size={16} className="mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredInvoices.length === 0 && (
          <Card className="p-12 text-center">
            <Receipt size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-muted-foreground">Create your first invoice or adjust your search</p>
          </Card>
        )}
      </div>
    </div>
  )
}

interface PayrollViewProps {
  payrollRuns: PayrollRun[]
}

function PayrollView({ payrollRuns }: PayrollViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Payroll Processing</h2>
          <p className="text-muted-foreground mt-1">Manage payroll runs and worker payments</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          Run Payroll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Next Pay Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">22 Jan 2025</div>
            <p className="text-sm text-muted-foreground mt-1">Weekly run in 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">12 timesheets</div>
            <p className="text-sm text-muted-foreground mt-1">Must be approved for payroll</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Last Run Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">£28,900</div>
            <p className="text-sm text-muted-foreground mt-1">45 workers paid</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {payrollRuns.map(run => (
          <Card key={run.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <CurrencyDollar size={20} weight="fill" className="text-primary" />
                    <h3 className="font-semibold text-lg">Payroll Run</h3>
                    <Badge variant={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'destructive' : 'warning'}>
                      {run.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Period Ending</p>
                      <p className="font-medium">{new Date(run.periodEnding).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Workers</p>
                      <p className="font-medium">{run.workersCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-semibold font-mono text-lg">£{run.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Processed</p>
                      <p className="font-medium">
                        {run.processedDate ? new Date(run.processedDate).toLocaleDateString() : 'Not yet'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">View Details</Button>
                  {run.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      <Download size={16} className="mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {payrollRuns.length === 0 && (
          <Card className="p-12 text-center">
            <CurrencyDollar size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payroll runs yet</h3>
            <p className="text-muted-foreground">Create your first payroll run to get started</p>
          </Card>
        )}
      </div>
    </div>
  )
}

interface ComplianceViewProps {
  complianceDocs: ComplianceDocument[]
  onUploadDocument: (data: {
    workerId: string
    workerName: string
    documentType: string
    expiryDate: string
  }) => void
}

function ComplianceView({ complianceDocs, onUploadDocument }: ComplianceViewProps) {
  const expiringDocs = complianceDocs.filter(d => d.status === 'expiring')
  const expiredDocs = complianceDocs.filter(d => d.status === 'expired')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    workerId: '',
    workerName: '',
    documentType: '',
    expiryDate: ''
  })

  const handleSubmitUpload = () => {
    if (!uploadFormData.workerName || !uploadFormData.documentType || !uploadFormData.expiryDate) {
      toast.error('Please fill in all fields')
      return
    }

    onUploadDocument({
      workerId: uploadFormData.workerId || `W-${Date.now()}`,
      workerName: uploadFormData.workerName,
      documentType: uploadFormData.documentType,
      expiryDate: uploadFormData.expiryDate
    })

    setUploadFormData({
      workerId: '',
      workerName: '',
      documentType: '',
      expiryDate: ''
    })
    setIsUploadOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Compliance Monitoring</h2>
          <p className="text-muted-foreground mt-1">Track worker documentation and certifications</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <UploadSimple size={18} className="mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Compliance Document</DialogTitle>
              <DialogDescription>
                Add a new document for a worker
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workerName">Worker Name</Label>
                <Input
                  id="workerName"
                  placeholder="Enter worker name"
                  value={uploadFormData.workerName}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, workerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select
                  value={uploadFormData.documentType}
                  onValueChange={(value) => setUploadFormData({ ...uploadFormData, documentType: value })}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DBS Check">DBS Check</SelectItem>
                    <SelectItem value="Right to Work">Right to Work</SelectItem>
                    <SelectItem value="Professional License">Professional License</SelectItem>
                    <SelectItem value="First Aid Certificate">First Aid Certificate</SelectItem>
                    <SelectItem value="Driving License">Driving License</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={uploadFormData.expiryDate}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, expiryDate: e.target.value })}
                />
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <UploadSimple size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitUpload}>Upload Document</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Warning size={18} className="text-warning" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{expiringDocs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Documents expiring within 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <XCircle size={18} className="text-destructive" />
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{expiredDocs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Workers blocked from engagement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expiring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expiring">
            Expiring Soon ({expiringDocs.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({expiredDocs.length})
          </TabsTrigger>
          <TabsTrigger value="valid">
            Valid ({complianceDocs.filter(d => d.status === 'valid').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expiring" className="space-y-3">
          {expiringDocs.map(doc => (
            <ComplianceCard key={doc.id} document={doc} />
          ))}
          {expiringDocs.length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-success mb-4" />
              <h3 className="text-lg font-semibold mb-2">All documents current</h3>
              <p className="text-muted-foreground">No documents expiring in the next 30 days</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-3">
          {expiredDocs.map(doc => (
            <ComplianceCard key={doc.id} document={doc} />
          ))}
        </TabsContent>

        <TabsContent value="valid" className="space-y-3">
          {complianceDocs.filter(d => d.status === 'valid').map(doc => (
            <ComplianceCard key={doc.id} document={doc} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ComplianceCardProps {
  document: ComplianceDocument
}

function ComplianceCard({ document }: ComplianceCardProps) {
  const statusConfig = {
    valid: { icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
    expiring: { icon: Warning, color: 'text-warning', bgColor: 'bg-warning/10' },
    expired: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' }
  }

  const StatusIcon = statusConfig[document.status].icon

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', statusConfig[document.status].bgColor)}>
                <StatusIcon size={20} weight="fill" className={statusConfig[document.status].color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">{document.workerName}</h3>
                  <Badge variant={document.status === 'valid' ? 'success' : document.status === 'expiring' ? 'warning' : 'destructive'}>
                    {document.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Document Type</p>
                    <p className="font-medium">{document.documentType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Days Until Expiry</p>
                    <p className={cn(
                      'font-medium font-mono',
                      document.daysUntilExpiry < 0 ? 'text-destructive' : 
                      document.daysUntilExpiry < 30 ? 'text-warning' : 'text-success'
                    )}>
                      {document.daysUntilExpiry < 0 ? 'Expired' : `${document.daysUntilExpiry} days`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline">View</Button>
            <Button size="sm">Upload New</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ExpensesViewProps {
  expenses: Expense[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onCreateExpense: (data: {
    workerName: string
    clientName: string
    date: string
    category: string
    description: string
    amount: number
    billable: boolean
  }) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

function ExpensesView({
  expenses,
  searchQuery,
  setSearchQuery,
  onCreateExpense,
  onApprove,
  onReject
}: ExpensesViewProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | ExpenseStatus>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    workerName: '',
    clientName: '',
    date: '',
    category: '',
    description: '',
    amount: '',
    billable: true
  })

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmitCreate = () => {
    if (!formData.workerName || !formData.clientName || !formData.date || !formData.category || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    onCreateExpense({
      workerName: formData.workerName,
      clientName: formData.clientName,
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      billable: formData.billable
    })

    setFormData({
      workerName: '',
      clientName: '',
      date: '',
      category: '',
      description: '',
      amount: '',
      billable: true
    })
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Expense Management</h2>
          <p className="text-muted-foreground mt-1">Manage worker expenses and reimbursements</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" />
              Create Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Expense</DialogTitle>
              <DialogDescription>
                Enter expense details for worker reimbursement or client billing
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="exp-worker">Worker Name</Label>
                <Input
                  id="exp-worker"
                  placeholder="Enter worker name"
                  value={formData.workerName}
                  onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-client">Client Name</Label>
                <Input
                  id="exp-client"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-date">Expense Date</Label>
                <Input
                  id="exp-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="exp-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Accommodation">Accommodation</SelectItem>
                    <SelectItem value="Meals">Meals</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="exp-description">Description</Label>
                <Textarea
                  id="exp-description"
                  placeholder="Describe the expense"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-amount">Amount (£)</Label>
                <Input
                  id="exp-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.billable}
                    onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Billable to client</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitCreate}>Create Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Funnel size={16} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({expenses.filter(e => e.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({expenses.filter(e => e.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({expenses.filter(e => e.status === 'rejected').length})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid ({expenses.filter(e => e.status === 'paid').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredExpenses
            .filter(e => e.status === 'pending')
            .map(expense => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          {filteredExpenses.filter(e => e.status === 'pending').length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending expenses to review</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredExpenses
            .filter(e => e.status === 'approved')
            .map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredExpenses
            .filter(e => e.status === 'rejected')
            .map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          {filteredExpenses
            .filter(e => e.status === 'paid')
            .map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ExpenseCardProps {
  expense: Expense
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

function ExpenseCard({ expense, onApprove, onReject }: ExpenseCardProps) {
  const statusConfig = {
    pending: { icon: ClockCounterClockwise, color: 'text-warning' },
    approved: { icon: CheckCircle, color: 'text-success' },
    rejected: { icon: XCircle, color: 'text-destructive' },
    paid: { icon: CheckCircle, color: 'text-success' }
  }

  const StatusIcon = statusConfig[expense.status].icon

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-4">
              <StatusIcon 
                size={24} 
                weight="fill" 
                className={statusConfig[expense.status].color}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{expense.workerName}</h3>
                  <Badge variant={expense.status === 'approved' || expense.status === 'paid' ? 'success' : expense.status === 'rejected' ? 'destructive' : 'warning'}>
                    {expense.status}
                  </Badge>
                  {expense.billable && (
                    <Badge variant="outline">Billable</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{expense.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{expense.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-semibold font-mono text-lg">£{expense.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Currency</p>
                    <p className="font-medium font-mono">{expense.currency}</p>
                  </div>
                </div>
                {expense.description && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {expense.description}
                  </div>
                )}
                <div className="mt-2 text-sm text-muted-foreground">
                  Submitted {new Date(expense.submittedDate).toLocaleDateString()}
                  size="sm" 
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            {expense.status === 'pending' && onApprove && onReject && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onApprove(expense.id)}
                  style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onReject(expense.id)}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </Button>
              </>
            )}
            {expense.receiptUrl && (
              <Button size="sm" variant="outline">
                <Camera size={16} className="mr-2" />
                View Receipt
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RoadmapView() {
  const roadmapContent = `# WorkForce Pro - Development Roadmap

## Phase 1: Foundation & Core Pay/Bill (Quarters 1-2) ✅

### Core Platform Infrastructure
- ✅ Multi-tenancy architecture
- ✅ Entity and division management
- ✅ User authentication and role-based access control
- ✅ Cloud-hosted SaaS deployment
- ✅ Basic security and data access controls

### Timesheet Management - Basic
- ✅ Online web portal timesheet entry
- ✅ Timesheet approval workflows
- ✅ Status tracking (pending/approved/rejected)
- ✅ Agency-initiated timesheet creation
- ✅ Bulk entry by administrators
- ✅ Mobile timesheet submission
- 📋 Batch import capabilities
- ✅ QR-coded paper timesheet scanning

### Basic Billing & Invoicing
- ✅ Invoice generation from timesheets
- ✅ Invoice status tracking
- ✅ Multi-currency support (GBP, USD, EUR)
- ✅ Electronic invoice delivery
- ✅ Sales invoice templates
- ✅ Payment terms configuration
- 📋 Purchase order tracking

### Basic Payroll
- ✅ Payroll run tracking
- ✅ Worker payment calculations
- ✅ One-click payroll processing
- 📋 PAYE payroll integration
- ✅ Holiday pay calculations

### Dashboard & Core Reporting
- ✅ Executive dashboard with key metrics
- ✅ Pending approvals tracking
- ✅ Overdue invoice monitoring
- ✅ Revenue and margin visibility
- ✅ Activity feed

---

## Phase 2: Advanced Operations & Automation (Quarters 3-4) 🔄

### Expense Management
- ✅ Worker expense submission (web portal)
- ✅ Agency-created expense entries
- ✅ Expense approval workflows
- ✅ Integration with billing and payroll
- ✅ Reimbursable vs billable expense tracking
- 📋 Mobile expense capture with receipt photos

### Notifications & Workflow Automation
- ✅ In-system alert notifications
- ✅ Real-time notification center
- ✅ Notification history and tracking
- ✅ Event-driven processing updates
- ✅ Email notification templates
- 📋 Configurable notification rules
- 📋 Automated follow-up reminders

### Timesheet Management - Advanced
- ✅ Multi-step approval routing
- 📋 Time and rate adjustment wizard
- 📋 Automated credit generation
- 📋 Re-invoicing workflows
- 📋 Full audit trail

### Advanced Billing
- 📋 Permanent placement invoices
- 📋 Contractor self-billing
- 📋 Bespoke invoice templates
- 📋 Client self-billing support
- 📋 Withholding tax handling

### Contract, Rate & Rule Enforcement
- ✅ Rate templates by role/client/placement
- 📋 Automatic shift premium calculations
- 📋 Overtime rate automation
- 📋 Time pattern validation
- 📋 AWR monitoring

---

## Phase 3: Compliance & Self-Service (Quarters 5-6) 📋

### Compliance Management - Enhanced
- ✅ Document tracking and monitoring
- ✅ Expiry alerts and notifications
- ✅ Document upload and storage
- 📋 Digital onboarding workflows
- 📋 Automated contract pack generation
- 📋 Compliance enforcement rules
- 📋 Statutory reporting support

### Self-Service Portals
- 📋 Branded worker portal
- 📋 Branded client portal
- 📋 Real-time timesheet visibility
- 📋 Invoice and payment status
- 📋 Paperless document access
- 📋 Mobile-responsive design

### Advanced Payroll Processing
- 📋 CIS processing
- 📋 Agency staff payroll
- 📋 Multiple employment models
- 📋 International payroll preparation
- 📋 Holiday pay automation

---

## Phase 4: Analytics & Integrations (Quarters 7-8) 📋

### Advanced Reporting & Analytics
- ✅ Real-time gross margin reporting
- ✅ Forecasting and predictive analytics
- ✅ Missing timesheet reports
- ✅ Custom report builder
- 📋 Client-level performance dashboards
- 📋 Placement-level profitability

### System Integrations
- 📋 ATS (Applicant Tracking System) integration
- 📋 CRM platform integration
- 📋 Accounting system integration (Xero, QuickBooks, Sage)
- 📋 RESTful API for third-party integrations
- 📋 Webhook support for real-time updates

### Global & Multi-Currency - Advanced
- ✅ Multi-currency billing (expanded)
- 📋 International sales tax handling
- 📋 Withholding tax automation
- 📋 Cross-border margin calculation

---

## Phase 5: Enterprise & Scale (Quarters 9-10) 📋

### Multi-Tenancy - Advanced
- 📋 Franchise management capabilities
- 📋 Agency group consolidation
- 📋 Cross-entity reporting
- 📋 Delegated administration controls

### Configuration & Customisation
- 📋 Custom system labels
- 📋 Agency-defined security roles
- ✅ Editable email templates
- 📋 White-label capabilities
- 📋 Custom workflow builders

### Performance & Scale
- 📋 High-volume processing optimization
- 📋 Batch processing improvements
- 📋 Performance monitoring dashboards
- 📋 Load balancing and scaling

---

## Phase 6: Innovation & AI (Quarters 11-12) 📋

### Intelligent Automation
- 📋 AI-powered timesheet anomaly detection
- 📋 Predictive compliance alerts
- 📋 Smart invoice matching
- 📋 Automated expense categorization
- 📋 Machine learning for margin optimization

### Advanced Analytics
- 📋 Business intelligence dashboards
- 📋 Trend analysis and insights
- 📋 Benchmarking and KPI tracking
- 📋 Predictive workforce planning

### Mobile Excellence
- 📋 Native mobile apps (iOS/Android)
- 📋 Offline capability
- 📋 Biometric authentication
- 📋 Push notifications
- 📋 Geolocation-based features

---

## Legend
- ✅ **Completed** - Feature is implemented and live
- 🔄 **In Progress** - Currently under development
- 📋 **Planned** - Scheduled for future development

---

## Success Metrics

### Operational Efficiency
- 80% reduction in timesheet processing time
- 95% straight-through invoice processing
- 90% reduction in compliance breach incidents

### User Adoption
- 85%+ worker portal adoption
- 75%+ client portal adoption
- <5% support ticket rate per user

### Financial Impact
- 99.5% billing accuracy
- <2% margin leakage
- 30% reduction in administrative overhead`

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let inList = false
    let listItems: React.ReactNode[] = []

    const flushList = (index: number) => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="space-y-2 mb-4 pl-6">
            {listItems}
          </ul>
        )
        listItems = []
        inList = false
      }
    }

    lines.forEach((line, i) => {
      if (line.startsWith('# ')) {
        flushList(i)
        elements.push(
          <h1 key={i} className="text-3xl font-semibold tracking-tight mb-4 mt-6">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        flushList(i)
        const text = line.substring(3)
        const hasIcon = text.includes('✅') || text.includes('🔄') || text.includes('📋')
        elements.push(
          <h2 key={i} className="text-2xl font-semibold tracking-tight mb-3 mt-6 flex items-center gap-2">
            {text}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        flushList(i)
        elements.push(
          <h3 key={i} className="text-lg font-semibold mb-2 mt-4">
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith('- ')) {
        if (!inList) {
          inList = true
        }
        const text = line.substring(2)
        const isCompleted = text.startsWith('✅')
        const isInProgress = text.startsWith('🔄')
        const isPlanned = text.startsWith('📋')
        
        listItems.push(
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5">
              {isInProgress && <span className="text-warning">🔄</span>}
            </span>
              {!isCompleted && !isInProgress && !isPlanned && <span className="text-muted-foreground">•</span>}
            </span>
            <span className={cn(
              isCompleted && 'text-foreground',
              isInProgress && 'text-foreground font-medium',
              isPlanned && 'text-muted-foreground'
            )}>
              {text.replace(/^[✅🔄📋]\s*/, '')}
            </span>
          </li>
        )
      } else if (line.startsWith('---')) {
        flushList(i)
        elements.push(<hr key={i} className="my-6 border-border" />)
      } else if (line.trim() !== '') {
        flushList(i)
        elements.push(
          <p key={i} className="text-sm text-muted-foreground mb-3">
            {line}
          </p>
        )
      }
    })

    flushList(lines.length)
    return elements
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Product Roadmap</h2>
          <p className="text-muted-foreground mt-1">Development phases and feature timeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-success/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle size={18} className="text-success" weight="fill" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">Phase 1-2 + Features</div>
            <p className="text-sm text-muted-foreground mt-1">Core platform with advanced features</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ClockCounterClockwise size={18} className="text-warning" weight="fill" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">Phase 2</div>
            <p className="text-sm text-muted-foreground mt-1">Advanced Operations & Automation</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-accent/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <MapTrifold size={18} className="text-accent" weight="fill" />
              Total Phases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">6</div>
            <p className="text-sm text-muted-foreground mt-1">2 years timeline</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 prose prose-sm max-w-none">
          {parseMarkdown(roadmapContent)}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Warning size={20} className="text-warning" />
            Release Cadence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Major Releases</p>
              <p className="font-medium">Quarterly</p>
            </div>
            <div>
              <p className="text-muted-foreground">Minor Updates</p>
              <p className="font-medium">Monthly</p>
            </div>
            <div>
              <p className="text-muted-foreground">Patches</p>
              <p className="font-medium">Weekly</p>
            </div>
            <div>
              <p className="text-muted-foreground">Hotfixes</p>
              <p className="font-medium">As needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
