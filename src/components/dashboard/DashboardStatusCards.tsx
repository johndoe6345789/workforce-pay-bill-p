import { Clock, Receipt, Warning, Users, TrendUp, CurrencyDollar } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { Progress } from '@/components/ui/progress'
import type { DashboardMetrics } from '@/lib/types'

const QUICK_ACTIONS = [
  { Icon: Clock, labelKey: 'dashboard.createTimesheet' },
  { Icon: Receipt, labelKey: 'dashboard.generateInvoice' },
  { Icon: CurrencyDollar, labelKey: 'dashboard.runPayroll' },
] as const

interface Props {
  metrics: DashboardMetrics
  completionRate: number
  t: (key: string, params?: Record<string, unknown>) => string
}

export function DashboardStatusCards({ metrics, completionRate, t }: Props) {
  return (
    <Grid cols={3} gap={4} responsive>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2"><Users size={18} className="text-primary" />{t('metrics.activeWorkers')}</CardTitle>
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
          <CardTitle className="text-base font-medium flex items-center gap-2"><TrendUp size={18} className="text-success" />{t('dashboard.upcomingDeadlines')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack spacing={3}>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{t('navigation.timesheets')}</span><span className="text-sm font-semibold">{metrics.pendingTimesheets} {t('statuses.pending').toLowerCase()}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{t('navigation.billing')}</span><span className="text-sm font-semibold">{metrics.overdueInvoices} {t('statuses.overdue').toLowerCase()}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{t('navigation.compliance')}</span><span className="text-sm font-semibold">{metrics.complianceAlerts} {t('notifications.title').toLowerCase()}</span></div>
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
            {QUICK_ACTIONS.map(({ Icon, labelKey }) => (
              <Button key={labelKey} className="w-full justify-start h-9" variant="outline" size="sm">
                <Icon size={16} className="mr-2" />{t(labelKey)}
              </Button>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  )
}
