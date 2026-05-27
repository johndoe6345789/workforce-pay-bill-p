import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { ICON_MAP } from './dashboardIconMap'
import type { DashboardMetric } from '@/hooks/use-dashboard-config'

const BORDER_COLORS: Record<string, string> = {
  default: 'border-border',
  success: 'border-success/20',
  warning: 'border-warning/20',
  error: 'border-destructive/20',
}

interface Props { metric: DashboardMetric; value: number }

export function MetricCard({ metric, value }: Props) {
  const { t } = useTranslation()
  const Icon = ICON_MAP[metric.icon]
  return (
    <Card className={cn('border-l-4', BORDER_COLORS[metric.variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{t(metric.titleKey)}</CardTitle>
        {Icon && <Icon size={20} className={metric.iconColor} />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {metric.trend?.enabled && (
          <div className={cn('flex items-center gap-1 mt-1 text-xs', metric.trend.direction === 'up' ? 'text-success' : 'text-muted-foreground')}>
            {metric.trend.direction === 'up' ? <ArrowUp size={14} weight="bold" /> : <ArrowDown size={14} weight="bold" />}
            <span>{t(metric.trend.textKey, metric.trend.textParams)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
