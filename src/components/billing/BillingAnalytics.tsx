import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'

interface AgingData {
  current: number
  days30: number
  days60: number
  days90: number
  over90: number
}

interface Props {
  totalRevenue: number
  draftCount: number
  overdueCount: number
  agingData: AgingData
  t: (key: string, params?: Record<string, unknown>) => string
}

export function BillingAnalytics({ totalRevenue, draftCount, overdueCount, agingData, t }: Props) {
  const outstanding = agingData.current + agingData.days30 + agingData.days60 + agingData.days90 + agingData.over90

  return (
    <Stack spacing={4}>
      <Grid cols={4} gap={4} responsive>
        <MetricCard label={t('billing.totalRevenue')} value={`£${totalRevenue.toLocaleString()}`} />
        <MetricCard label={t('billing.draftInvoices')} value={draftCount} />
        <MetricCard label={t('billing.overdueInvoices')} value={overdueCount} description={overdueCount > 0 ? t('billing.actionNeeded') : t('billing.allCurrent')} />
        <MetricCard label={t('billing.outstanding')} value={`£${outstanding.toLocaleString()}`} />
      </Grid>
      <Card>
        <CardHeader><CardTitle className="text-sm">{t('billing.invoiceAgingAnalysis')}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div><div className="text-xs text-muted-foreground mb-1">{t('billing.current')}</div><div className="font-semibold font-mono">£{agingData.current.toLocaleString()}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">{t('billing.days30')}</div><div className="font-semibold font-mono">£{agingData.days30.toLocaleString()}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">{t('billing.days60')}</div><div className="font-semibold font-mono text-warning">£{agingData.days60.toLocaleString()}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">{t('billing.days90')}</div><div className="font-semibold font-mono text-warning">£{agingData.days90.toLocaleString()}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">{t('billing.over90')}</div><div className="font-semibold font-mono text-destructive">£{agingData.over90.toLocaleString()}</div></div>
          </div>
        </CardContent>
      </Card>
    </Stack>
  )
}
