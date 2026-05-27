import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { MetricCard } from '@/components/ui/metric-card'
import { Grid } from '@/components/ui/grid'
import { FileText, Clock, Warning, CurrencyDollar, CheckCircle, TrendUp } from '@phosphor-icons/react'

interface Props {
  totalCount: number
  pendingCount: number
  approvedCount: number
  totalHours: number
  totalValue: number
  approvalRate: number
  validationInvalid: number
  t: (key: string, params?: Record<string, unknown>) => string
}

export function TimesheetAnalytics({ totalCount, pendingCount, approvedCount, totalHours, totalValue, approvalRate, validationInvalid, t }: Props) {
  return (
    <>
      <Grid cols={4} gap={4} responsive>
        <MetricCard label={t('timesheets.totalTimesheets')} value={totalCount} icon={<FileText size={24} />} description={t('timesheets.pendingReview', { count: pendingCount })} />
        <MetricCard label={t('timesheets.totalHours')} value={`${totalHours.toFixed(1)}h`} icon={<Clock size={24} />} description={t('timesheets.thisPeriod')} />
        <MetricCard label={t('timesheets.validationIssues')} value={validationInvalid} icon={<Warning size={24} />} description={validationInvalid > 0 ? t('timesheets.errorsFound') : t('timesheets.allValid')} />
        <MetricCard label={t('timesheets.totalValue')} value={`£${totalValue.toLocaleString()}`} icon={<CurrencyDollar size={24} />} description={t('timesheets.pendingInvoicing')} />
      </Grid>

      <Grid cols={3} gap={4} responsive>
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">{t('timesheets.pending')}</CardTitle>
              <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">{pendingCount}</Badge>
            </div>
            <CardDescription className="text-xs">{t('timesheets.awaitingApproval')}</CardDescription>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-warning">{pendingCount}</div></CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">{t('timesheets.approved')}</CardTitle>
              <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                <CheckCircle size={12} weight="bold" className="mr-1" />{approvedCount}
              </Badge>
            </div>
            <CardDescription className="text-xs">{t('timesheets.readyForBilling')}</CardDescription>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-success">{approvedCount}</div></CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">{t('timesheets.approvalRate')}</CardTitle>
              <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10">
                <TrendUp size={12} weight="bold" className="mr-1" />{approvalRate.toFixed(0)}%
              </Badge>
            </div>
            <CardDescription className="text-xs">{t('timesheets.thisPeriod')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{approvalRate.toFixed(0)}%</div>
            <Progress value={approvalRate} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </Grid>

      <Separator />
    </>
  )
}
