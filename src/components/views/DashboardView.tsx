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
import { useTranslation } from '@/hooks/use-translation'
import type { DashboardMetrics } from '@/lib/types'

interface DashboardViewProps {
  metrics: DashboardMetrics
}

export function DashboardView({ metrics }: DashboardViewProps) {
  const { t } = useTranslation()
  const activityEntries = [
    {
      id: '1',
      action: t('dashboard.timesheetApproved'),
      description: 'John Smith - Week ending 15 Jan 2025',
      timestamp: t('dashboard.minutesAgo', { value: 5 }),
      icon: <CheckCircle size={18} className="text-success" />
    },
    {
      id: '2',
      action: t('dashboard.invoiceGenerated'),
      description: 'INV-00234 - Acme Corp - £2,450',
      timestamp: t('dashboard.minutesAgo', { value: 12 }),
      icon: <Receipt size={18} className="text-info" />
    },
    {
      id: '3',
      action: t('dashboard.payrollCompleted'),
      description: 'Weekly run - 45 workers - £28,900',
      timestamp: t('dashboard.hourAgo', { value: 1 }),
      icon: <CheckCircle size={18} className="text-success" />
    },
    {
      id: '4',
      action: t('dashboard.documentExpiringSoon'),
      description: t('dashboard.documentExpiringSoonDescription', { name: 'Sarah Johnson', days: 14 }),
      timestamp: t('dashboard.hoursAgo', { value: 2 }),
      icon: <Warning size={18} className="text-warning" />
    }
  ]

  const completionRate = metrics.pendingApprovals > 0 
    ? ((metrics.activeWorkers - metrics.pendingApprovals) / metrics.activeWorkers) * 100
    : 100

  return (
    <Stack spacing={6}>
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.subtitle')}
        actions={
          <Stack direction="horizontal" spacing={2}>
            <Button variant="outline">
              <CalendarBlank size={18} className="mr-2" />
              {t('dashboard.thisWeek')}
            </Button>
            <Button variant="outline">
              <Download size={18} className="mr-2" />
              {t('common.export')}
            </Button>
          </Stack>
        }
      />

      <Grid cols={4} gap={4} responsive>
        <MetricCard
          label={t('dashboard.pendingApprovals')}
          value={metrics.pendingApprovals}
          icon={<ClockCounterClockwise size={24} />}
          change={{ value: 12, trend: 'up' }}
          description={t('dashboard.requiresAttention')}
        />
        <MetricCard
          label={t('dashboard.pendingExpenses')}
          value={metrics.pendingExpenses}
          icon={<Notepad size={24} />}
          description={t('dashboard.awaitingReview')}
        />
        <MetricCard
          label={t('dashboard.overdueInvoices')}
          value={metrics.overdueInvoices}
          icon={<Receipt size={24} />}
          change={{ value: 5, trend: 'down' }}
          description={t('dashboard.pastDueDate')}
        />
        <MetricCard
          label={t('dashboard.complianceAlerts')}
          value={metrics.complianceAlerts}
          icon={<Warning size={24} />}
          description={t('dashboard.actionRequired')}
        />
      </Grid>

      <Grid cols={3} gap={4} responsive>
        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">{t('dashboard.monthlyRevenue')}</CardTitle>
              <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                <ArrowUp size={12} weight="bold" className="mr-1" />
                12.5%
              </Badge>
            </div>
            <CardDescription>{t('dashboard.monthlyRevenueDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight font-mono text-success">
              £{metrics.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('dashboard.vsLastMonth', { value: 12.5 })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">{t('dashboard.monthlyPayroll')}</CardTitle>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                <ArrowUp size={12} weight="bold" className="mr-1" />
                8.3%
              </Badge>
            </div>
            <CardDescription>{t('dashboard.monthlyPayrollDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight font-mono text-primary">
              £{metrics.monthlyPayroll.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('dashboard.vsLastMonth', { value: 8.3 })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">{t('dashboard.grossMargin')}</CardTitle>
              <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10">
                <ArrowUp size={12} weight="bold" className="mr-1" />
                3.2%
              </Badge>
            </div>
            <CardDescription>{t('dashboard.grossMarginDescription')}</CardDescription>
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
              {t('metrics.activeWorkers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeWorkers}</div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('timesheets.approvalRate')}</span>
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
              {t('dashboard.weekOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing={3}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('navigation.timesheets')}</span>
                <span className="text-sm font-semibold">{t('dashboard.pendingCount', { count: metrics.pendingTimesheets })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('navigation.billing')}</span>
                <span className="text-sm font-semibold">{t('dashboard.overdueCount', { count: metrics.overdueInvoices })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('navigation.compliance')}</span>
                <span className="text-sm font-semibold">{t('dashboard.alertsCount', { count: metrics.complianceAlerts })}</span>
              </div>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('dashboard.quickActions')}</CardTitle>
            <CardDescription className="text-xs">{t('dashboard.quickActionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack spacing={2}>
              <Button className="w-full justify-start h-9" variant="outline" size="sm">
                <Clock size={16} className="mr-2" />
                {t('dashboard.createTimesheet')}
              </Button>
              <Button className="w-full justify-start h-9" variant="outline" size="sm">
                <Receipt size={16} className="mr-2" />
                {t('dashboard.generateInvoice')}
              </Button>
              <Button className="w-full justify-start h-9" variant="outline" size="sm">
                <CurrencyDollar size={16} className="mr-2" />
                {t('dashboard.runPayroll')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription>{t('dashboard.recentActivityDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityLog entries={activityEntries} />
        </CardContent>
      </Card>
    </Stack>
  )
}
