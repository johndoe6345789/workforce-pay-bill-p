import { 
  ClockCounterClockwise, 
  Notepad, 
  Receipt, 
  Warning,
  ArrowUp,
  Clock,
  CurrencyDollar,
  Download,
  CheckCircle
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/metric-card'
import { ActivityLog } from '@/components/ui/activity-log'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { PageHeader } from '@/components/ui/page-header'
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

  return (
    <Stack spacing={6}>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your workforce operations"
      />

      <Grid cols={4} gap={4} responsive>
        <MetricCard
          label="Pending Approvals"
          value={metrics.pendingApprovals}
          icon={<ClockCounterClockwise size={20} />}
          change={{ value: 12, trend: 'up' }}
        />
        <MetricCard
          label="Pending Expenses"
          value={metrics.pendingExpenses}
          icon={<Notepad size={20} />}
        />
        <MetricCard
          label="Overdue Invoices"
          value={metrics.overdueInvoices}
          icon={<Receipt size={20} />}
          change={{ value: 5, trend: 'down' }}
        />
        <MetricCard
          label="Compliance Alerts"
          value={metrics.complianceAlerts}
          icon={<Warning size={20} />}
        />
      </Grid>

      <Grid cols={3} gap={4} responsive>
        <Card>
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

        <Card>
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

        <Card>
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
      </Grid>

      <Grid cols={2} gap={4} responsive>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest timesheet and billing events</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityLog entries={activityEntries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks and workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack spacing={2}>
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
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Stack>
  )
}
