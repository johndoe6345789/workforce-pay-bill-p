import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendUp, TrendDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface Props {
  totalRevenue: number
  totalCosts: number
  totalMargin: number
  avgMarginPercentage: number
  monthOverMonthChange: number
  t: (key: string) => string
}

export function ReportsMetricsGrid({ totalRevenue, totalCosts, totalMargin, avgMarginPercentage, monthOverMonthChange, t }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-l-4 border-success/20">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t('reports.totalRevenueYTD')}</CardTitle></CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold font-mono">£{totalRevenue.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-success"><TrendUp size={14} weight="bold" /><span>{t('reports.yearToDate')}</span></div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-warning/20">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t('reports.totalCostsYTD')}</CardTitle></CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold font-mono">£{totalCosts.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><TrendUp size={14} weight="bold" /><span>{t('reports.yearToDate')}</span></div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-accent/20">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t('reports.grossMarginYTD')}</CardTitle></CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold font-mono">£{totalMargin.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-accent"><span className="font-medium">{avgMarginPercentage.toFixed(1)}%</span></div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-primary/20">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t('reports.momChange')}</CardTitle></CardHeader>
        <CardContent>
          <div className={cn('text-2xl font-semibold font-mono', monthOverMonthChange >= 0 ? 'text-success' : 'text-destructive')}>
            {monthOverMonthChange >= 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            {monthOverMonthChange >= 0
              ? <TrendUp size={14} weight="bold" className="text-success" />
              : <TrendDown size={14} weight="bold" className="text-destructive" />}
            <span>{t('reports.vsLastMonth')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
