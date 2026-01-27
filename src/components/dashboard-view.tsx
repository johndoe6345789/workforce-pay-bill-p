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
import { useTranslation } from '@/hooks/use-translation'

interface DashboardViewProps {
  metrics: DashboardMetrics
}

export function DashboardView({ metrics }: DashboardViewProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">{t('dashboard.title')}</h2>
        <p className="text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('dashboard.pendingApprovals')}
          value={metrics.pendingApprovals}
          icon={<ClockCounterClockwise size={20} className="text-warning" />}
          trend={{ value: 12, direction: 'up' }}
          trendText={t('dashboard.vsLastWeek', { value: '12' })}
          variant="warning"
        />
        <MetricCard
          title={t('dashboard.pendingExpenses')}
          value={metrics.pendingExpenses}
          icon={<Notepad size={20} className="text-info" />}
          variant="default"
        />
        <MetricCard
          title={t('dashboard.overdueInvoices')}
          value={metrics.overdueInvoices}
          icon={<Receipt size={20} className="text-destructive" />}
          trend={{ value: 5, direction: 'down' }}
          trendText={t('dashboard.vsLastWeek', { value: '5' })}
          variant="error"
        />
        <MetricCard
          title={t('dashboard.complianceAlerts')}
          value={metrics.complianceAlerts}
          icon={<Warning size={20} className="text-warning" />}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.monthlyRevenue')}</CardTitle>
            <CardDescription>{t('dashboard.monthlyRevenueDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              £{(metrics.monthlyRevenue || 0).toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <ArrowUp size={16} weight="bold" />
              <span>{t('dashboard.vsLastMonth', { value: '12.5' })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.monthlyPayroll')}</CardTitle>
            <CardDescription>{t('dashboard.monthlyPayrollDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              £{(metrics.monthlyPayroll || 0).toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <ArrowUp size={16} weight="bold" />
              <span>{t('dashboard.vsLastMonth', { value: '8.3' })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.grossMargin')}</CardTitle>
            <CardDescription>{t('dashboard.grossMarginDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              {(metrics.grossMargin || 0).toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <ArrowUp size={16} weight="bold" />
              <span>{t('dashboard.vsLastMonth', { value: '3.2' })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>{t('dashboard.recentActivityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                icon={<CheckCircle size={18} className="text-success" />}
                title={t('dashboard.timesheetApproved')}
                description="John Smith - Week ending 15 Jan 2025"
                time={t('dashboard.minutesAgo', { value: '5' })}
              />
              <ActivityItem
                icon={<Receipt size={18} className="text-info" />}
                title={t('dashboard.invoiceGenerated')}
                description="INV-00234 - Acme Corp - £2,450"
                time={t('dashboard.minutesAgo', { value: '12' })}
              />
              <ActivityItem
                icon={<CheckCircle size={18} className="text-success" />}
                title={t('dashboard.payrollCompleted')}
                description="Weekly run - 45 workers - £28,900"
                time={t('dashboard.hourAgo', { value: '1' })}
              />
              <ActivityItem
                icon={<Warning size={18} className="text-warning" />}
                title={t('dashboard.documentExpiringSoon')}
                description={`DBS check for Sarah Johnson - ${t('dashboard.days', { value: '14' })}`}
                time={t('dashboard.hoursAgo', { value: '2' })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>{t('dashboard.quickActionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Clock size={18} className="mr-2" />
              {t('dashboard.createTimesheet')}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Receipt size={18} className="mr-2" />
              {t('dashboard.generateInvoice')}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CurrencyDollar size={18} className="mr-2" />
              {t('dashboard.runPayroll')}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download size={18} className="mr-2" />
              {t('dashboard.exportReports')}
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
  trendText?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}

function MetricCard({ title, value, icon, trend, trendText, variant = 'default' }: MetricCardProps) {
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
            <span>{trendText || `${trend.value}% vs last week`}</span>
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
