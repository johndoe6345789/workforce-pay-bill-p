import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
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
  MapTrifold
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
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { 
  Timesheet, 
  Invoice, 
  PayrollRun, 
  Worker, 
  DashboardMetrics,
  ComplianceDocument,
  TimesheetStatus,
  InvoiceStatus
} from '@/lib/types'

type View = 'dashboard' | 'timesheets' | 'billing' | 'payroll' | 'compliance' | 'reports' | 'roadmap'

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [currentEntity, setCurrentEntity] = useState('Main Agency')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [timesheets = [], setTimesheets] = useKV<Timesheet[]>('timesheets', [])
  const [invoices = [], setInvoices] = useKV<Invoice[]>('invoices', [])
  const [payrollRuns = [], setPayrollRuns] = useKV<PayrollRun[]>('payroll-runs', [])
  const [workers = [], setWorkers] = useKV<Worker[]>('workers', [])
  const [complianceDocs = [], setComplianceDocs] = useKV<ComplianceDocument[]>('compliance-docs', [])

  const metrics: DashboardMetrics = {
    pendingTimesheets: timesheets.filter(t => t.status === 'pending').length,
    pendingApprovals: timesheets.filter(t => t.status === 'pending').length,
    overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
    complianceAlerts: complianceDocs.filter(d => d.status === 'expiring' || d.status === 'expired').length,
    monthlyRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    monthlyPayroll: payrollRuns.reduce((sum, pr) => sum + pr.totalAmount, 0),
    grossMargin: 0,
    activeWorkers: workers.filter(w => w.status === 'active').length
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
    toast.error('Timesheet rejected')
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

        <nav className="flex-1 p-4 space-y-1">
          <NavItem
            icon={<ChartBar size={20} />}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
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
            icon={<ShieldCheck size={20} />}
            label="Compliance"
            active={currentView === 'compliance'}
            onClick={() => setCurrentView('compliance')}
            badge={metrics.complianceAlerts}
          />
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
            />
          )}

          {currentView === 'billing' && (
            <BillingView
              invoices={invoices}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {currentView === 'payroll' && (
            <PayrollView payrollRuns={payrollRuns} />
          )}

          {currentView === 'compliance' && (
            <ComplianceView complianceDocs={complianceDocs} />
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
        <MetricCard
          title="Active Workers"
          value={metrics.activeWorkers}
          icon={<CheckCircle size={20} className="text-success" />}
          trend={{ value: 8, direction: 'up' }}
          variant="success"
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
}

function TimesheetsView({ 
  timesheets, 
  searchQuery, 
  setSearchQuery, 
  onApprove, 
  onReject,
  onCreateInvoice 
}: TimesheetsViewProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | TimesheetStatus>('all')

  const filteredTimesheets = timesheets.filter(t => {
    const matchesSearch = t.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Timesheets</h2>
          <p className="text-muted-foreground mt-1">Manage and approve worker timesheets</p>
        </div>
        <Dialog>
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
                Enter timesheet details manually or import from external system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="worker">Worker</Label>
                <Input id="worker" placeholder="Select worker..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input id="client" placeholder="Select client..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours</Label>
                  <Input id="hours" type="number" placeholder="37.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate (£/hr)</Label>
                  <Input id="rate" type="number" placeholder="25.00" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Timesheet</Button>
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
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TimesheetCardProps {
  timesheet: Timesheet
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
}

function TimesheetCard({ timesheet, onApprove, onReject, onCreateInvoice }: TimesheetCardProps) {
  const statusConfig = {
    pending: { icon: ClockCounterClockwise, color: 'text-warning' },
    approved: { icon: CheckCircle, color: 'text-success' },
    rejected: { icon: XCircle, color: 'text-destructive' },
    processing: { icon: Clock, color: 'text-info' }
  }

  const StatusIcon = statusConfig[timesheet.status].icon

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
                    <p className="font-medium font-mono">{timesheet.hours}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium font-mono">£{timesheet.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Submitted {new Date(timesheet.submittedDate).toLocaleDateString()}
                  {timesheet.approvedDate && ` • Approved ${new Date(timesheet.approvedDate).toLocaleDateString()}`}
                </div>
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
}

function BillingView({ invoices, searchQuery, setSearchQuery }: BillingViewProps) {
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
        <Button>
          <Plus size={18} className="mr-2" />
          Create Invoice
        </Button>
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
}

function ComplianceView({ complianceDocs }: ComplianceViewProps) {
  const expiringDocs = complianceDocs.filter(d => d.status === 'expiring')
  const expiredDocs = complianceDocs.filter(d => d.status === 'expired')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Compliance Monitoring</h2>
          <p className="text-muted-foreground mt-1">Track worker documentation and certifications</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          Add Document
        </Button>
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
- 🔄 Agency-initiated timesheet creation
- 🔄 Bulk entry by administrators
- 📋 Mobile timesheet submission
- 📋 Batch import capabilities
- 📋 QR-coded paper timesheet scanning

### Basic Billing & Invoicing
- ✅ Invoice generation from timesheets
- ✅ Invoice status tracking
- ✅ Multi-currency support (GBP, USD, EUR)
- 🔄 Electronic invoice delivery
- 📋 Sales invoice templates
- 📋 Payment terms configuration
- 📋 Purchase order tracking

### Basic Payroll
- ✅ Payroll run tracking
- ✅ Worker payment calculations
- 📋 One-click payroll processing
- 📋 PAYE payroll integration
- 📋 Holiday pay calculations

### Dashboard & Core Reporting
- ✅ Executive dashboard with key metrics
- ✅ Pending approvals tracking
- ✅ Overdue invoice monitoring
- ✅ Revenue and margin visibility
- ✅ Activity feed

---

## Phase 2: Advanced Operations & Automation (Quarters 3-4) 🔄

### Expense Management
- 📋 Worker expense submission (web/mobile)
- 📋 Mobile expense capture with receipts
- 📋 Agency-created expense entries
- 📋 Approval workflows
- 📋 Integration with billing and payroll

### Timesheet Management - Advanced
- 📋 Multi-step approval routing
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
- 📋 Rate templates by role/client/placement
- 📋 Automatic shift premium calculations
- 📋 Overtime rate automation
- 📋 Time pattern validation
- 📋 AWR monitoring

---

## Phase 3: Compliance & Self-Service (Quarters 5-6) 📋

### Compliance Management - Enhanced
- ✅ Document tracking and monitoring
- ✅ Expiry alerts and notifications
- 🔄 Document upload and storage
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
- 🔄 Real-time gross margin reporting
- 🔄 Forecasting and predictive analytics
- 📋 Missing timesheet reports
- 📋 Custom report builder
- 📋 Client-level performance dashboards
- 📋 Placement-level profitability

### System Integrations
- 📋 ATS (Applicant Tracking System) integration
- 📋 CRM platform integration
- 📋 Accounting system integration (Xero, QuickBooks, Sage)
- 📋 RESTful API for third-party integrations
- 📋 Webhook support for real-time updates

### Global & Multi-Currency - Advanced
- 🔄 Multi-currency billing (expanded)
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
- 📋 Editable email templates
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
              {isCompleted && <span className="text-success">✅</span>}
              {isInProgress && <span className="text-warning">🔄</span>}
              {isPlanned && <span className="text-muted-foreground">📋</span>}
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
            <div className="text-3xl font-semibold">Phase 1</div>
            <p className="text-sm text-muted-foreground mt-1">Foundation & Core Pay/Bill</p>
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
            <p className="text-sm text-muted-foreground mt-1">Advanced Operations</p>
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
