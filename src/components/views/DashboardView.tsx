import { 
  ClockCounterClockwise, 
  Notepad, 
  Receipt, 
  Warning,
  ArrowUp,
  ArrowDown,
  Clock,
  CurrencyDollar,
  Download,
  CheckCircle,
  Users,
  TrendUp,
  CalendarBlank
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/metric-card'
import { ActivityLog } from '@/components/ui/activity-log'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { PageHeader } from '@/components/ui/page-header'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { DashboardMetrics } from '@/lib/types'

interface DashboardViewProps {
  metrics: DashboardMetrics
}

export function DashboardView({ metrics }: DashboardViewProps) {
  const activityEntries = [
    {
      id: '1',
      action: 'approved',
      description: 'John Smith - Week ending 15 Jan 2025',
      timestamp: '5 minutes ago',
      icon: <CheckCircle size={18} className="text-success" />
    },
    {
      id: '2',
      action: 'generated invoice',
      description: 'INV-00234 - Acme Corp - £2,450',
      timestamp: '12 minutes ago',
      icon: <Receipt size={18} className="text-info" />
    },
    {
      id: '3',
      action: 'completed payroll',
      description: 'Weekly run - 45 workers - £28,900',
      timestamp: '1 hour ago',
      icon: <CheckCircle size={18} className="text-success" />
    },
    {
      id: '4',
      action: 'expiring document',
      description: 'DBS check for Sarah Johnson - 14 days',
      timestamp: '2 hours ago',
      icon: <Warning size={18} className="text-warning" />
    }
  ]

  const completionRate = metrics.pendingApprovals > 0 
    ? ((metrics.activeWorkers - metrics.pendingApprovals) / metrics.activeWorkers) * 100
    : 100

  return (
    <Stack spacing={6}>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your workforce operations"
        actions={
          <Stack direction="horizontal" spacing={2}>
            <Button variant="outline">
              <CalendarBlank size={18} className="mr-2" />
              This Week
            </Button>
            <Button variant="outline">
              <Download size={18} className="mr-2" />
              Export
            </Button>
          </Stack>
        }
      />

      <Grid cols={4} gap={4} responsive>
        <MetricCard
          label="Pending Approvals"
          value={metrics.pendingApprovals}
          icon={<ClockCounterClockwise size={24} />}
          change={{ value: 12, trend: 'up' }}
          description="Requires attention"
        />
        <MetricCard
          label="Pending Expenses"
          value={metrics.pendingExpenses}
          icon={<Notepad size={24} />}
          description="Awaiting review"
        />
        <MetricCard
          label="Overdue Invoices"
          value={metrics.overdueInvoices}
          icon={<Receipt size={24} />}
          change={{ value: 5, trend: 'down' }}
          description="Past due date"
        />
        <MetricCard
          label="Compliance Alerts"
          value={metrics.complianceAlerts}
          icon={<Warning size={24} />}
          description="Action required"
        />
      </Grid>

      <Grid cols={3} gap={4} responsive>
        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Monthly Revenue</CardTitle>
              <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                <ArrowUp size={12} weight="bold" className="mr-1" />
                12.5%
              </Badge>
            </div>
            <CardDescription>Total invoiced this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight font-mono text-success">
              £{metrics.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              vs. £{(metrics.monthlyRevenue / 1.125).toFixed(0).toLocaleString()} last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Monthly Payroll</CardTitle>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                <ArrowUp size={12} weight="bold" className="mr-1" />
                8.3%
              </Badge>
            </div>
            <CardDescription>Total payroll costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight font-mono text-primary">
              £{metrics.monthlyPayroll.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              vs. £{(metrics.monthlyPayroll / 1.083).toFixed(0).toLocaleString()} last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Gross Margin</CardTitle>
              <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10">
                <ArrowUp size={12} weight="bold" className="mr-1" />
                3.2%
              </Badge>
            </div>
            <CardDescription>Revenue minus payroll</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight font-mono text-accent">
              {metrics.grossMargin.toFixed(1)}%
            </div>
            <Progress value={metrics.grossMargin} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </Grid>

      <Grid cols={3} gap={4} responsive>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Users size={18} className="text-primary" />
              Active Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeWorkers}</div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Timesheet completion</span>
                <span className="font-semibold">{completionRate.toFixed(0)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendUp size={18} className="text-success" />
              Week Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing={3}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Timesheets</span>
                <span className="text-sm font-semibold">{metrics.pendingTimesheets} pending</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Invoices</span>
                <span className="text-sm font-semibold">{metrics.overdueInvoices} overdue</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Compliance</span>
                <span className="text-sm font-semibold">{metrics.complianceAlerts} alerts</span>
              </div>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
            <CardDescription className="text-xs">Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack spacing={2}>
              <Button className="w-full justify-start h-9" variant="outline" size="sm">
                <Clock size={16} className="mr-2" />
                Create Timesheet
              </Button>
              <Button className="w-full justify-start h-9" variant="outline" size="sm">
                <Receipt size={16} className="mr-2" />
                Generate Invoice
              </Button>
              <Button className="w-full justify-start h-9" variant="outline" size="sm">
                <CurrencyDollar size={16} className="mr-2" />
                Run Payroll
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Latest timesheet and billing events</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityLog entries={activityEntries} />
        </CardContent>
      </Card>
    </Stack>
  )
}
