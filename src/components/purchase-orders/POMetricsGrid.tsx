import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, CurrencyDollar, TrendUp, Warning } from '@phosphor-icons/react'

interface POMetrics {
  activeCount: number
  totalValue: number
  remainingValue: number
  averageUtilization: number
  expiringSoonCount: number
  expiredCount: number
}

interface Props {
  metrics: POMetrics
  totalPOs: number
}

const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function POMetricsGrid({ metrics, totalPOs }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CheckCircle size={16} weight="fill" className="text-success" />Active POs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.activeCount}</div>
          <p className="text-sm text-muted-foreground mt-1">{fmt(metrics.remainingValue)} remaining</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CurrencyDollar size={16} weight="fill" className="text-accent" />Total Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono">{fmt(metrics.totalValue)}</div>
          <p className="text-sm text-muted-foreground mt-1">Across {totalPOs} PO{totalPOs !== 1 ? 's' : ''}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendUp size={16} weight="fill" className="text-info" />Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.averageUtilization.toFixed(1)}%</div>
          <p className="text-sm text-muted-foreground mt-1">Average across active POs</p>
        </CardContent>
      </Card>
      <Card className={metrics.expiringSoonCount > 0 ? 'border-warning/50' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Warning size={16} weight="fill" className="text-warning" />Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.expiringSoonCount + metrics.expiredCount}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {metrics.expiringSoonCount} expiring, {metrics.expiredCount} expired
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
