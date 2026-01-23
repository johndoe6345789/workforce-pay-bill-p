import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  Receipt, 
  CurrencyDollar, 
  ClockCounterClockwise,
  CheckCircle,
  Warning,
  Notepad,
  Download,
  ArrowUp,
  ArrowDown
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { DashboardMetrics } from '@/lib/types'

interface DashboardViewProps {
  metrics: DashboardMetrics
}

export function DashboardView({ metrics }: DashboardViewProps) {
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
              £{(metrics.monthlyRevenue || 0).toLocaleString()}
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
              £{(metrics.monthlyPayroll || 0).toLocaleString()}
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
              {(metrics.grossMargin || 0).toFixed(1)}%
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
