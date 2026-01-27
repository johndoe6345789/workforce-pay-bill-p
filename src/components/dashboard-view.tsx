import { useState, useEffect } from 'react'
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
import { useDashboardConfig, type DashboardMetric, type DashboardCard, type DashboardActivity, type DashboardAction } from '@/hooks/use-dashboard-config'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LiveRefreshIndicator } from '@/components/LiveRefreshIndicator'

interface DashboardViewProps {
  metrics: DashboardMetrics
}

const iconMap: Record<string, React.ComponentType<any>> = {
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
}

export function DashboardView({ metrics }: DashboardViewProps) {
  const { t } = useTranslation()
  const { config, loading, error, getMetricsSection, getFinancialSection, getRecentActivities, getQuickActions } = useDashboardConfig()
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    setLastUpdated(new Date())
  }, [metrics])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="text-center text-destructive py-8">
        Failed to load dashboard configuration
      </div>
    )
  }

  const metricsSection = getMetricsSection()
  const financialSection = getFinancialSection()
  const activities = getRecentActivities(4)
  const actions = getQuickActions()

  const getMetricValue = (dataSource: string): number => {
    const path = dataSource.split('.')
    let value: any = { metrics }
    for (const key of path) {
      value = value?.[key]
    }
    return typeof value === 'number' ? value : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('dashboard.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <LiveRefreshIndicator 
          lastUpdated={lastUpdated}
          pollingInterval={2000}
        />
      </div>

      {metricsSection && (
        <div className={cn(
          'grid gap-4',
          `grid-cols-${metricsSection.columns.mobile}`,
          `md:grid-cols-${metricsSection.columns.tablet}`,
          `lg:grid-cols-${metricsSection.columns.desktop}`
        )}>
          {metricsSection.metrics?.map((metric) => (
            <MetricCardFromConfig 
              key={metric.id} 
              metric={metric} 
              value={getMetricValue(metric.dataSource)}
            />
          ))}
        </div>
      )}

      {financialSection && (
        <div className={cn(
          'grid gap-4',
          `grid-cols-${financialSection.columns.mobile}`,
          `md:grid-cols-${financialSection.columns.tablet}`,
          `lg:grid-cols-${financialSection.columns.desktop}`
        )}>
          {financialSection.cards?.map((card) => (
            <FinancialCardFromConfig 
              key={card.id} 
              card={card} 
              value={getMetricValue(card.dataSource || '')}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>{t('dashboard.recentActivityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <ActivityItemFromConfig key={activity.id} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>{t('dashboard.quickActionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {actions.map((action) => (
              <QuickActionFromConfig key={action.id} action={action} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardFromConfigProps {
  metric: DashboardMetric
  value: number
}

function MetricCardFromConfig({ metric, value }: MetricCardFromConfigProps) {
  const { t } = useTranslation()
  const IconComponent = iconMap[metric.icon]
  
  const borderColors = {
    default: 'border-border',
    success: 'border-success/20',
    warning: 'border-warning/20',
    error: 'border-destructive/20'
  }

  return (
    <Card className={cn('border-l-4', borderColors[metric.variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {t(metric.titleKey)}
        </CardTitle>
        {IconComponent && <IconComponent size={20} className={metric.iconColor} />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {metric.trend?.enabled && (
          <div className={cn(
            'flex items-center gap-1 mt-1 text-xs',
            metric.trend.direction === 'up' ? 'text-success' : 'text-muted-foreground'
          )}>
            {metric.trend.direction === 'up' ? (
              <ArrowUp size={14} weight="bold" />
            ) : (
              <ArrowDown size={14} weight="bold" />
            )}
            <span>{t(metric.trend.textKey, metric.trend.textParams)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FinancialCardFromConfigProps {
  card: DashboardCard
  value: number
}

function FinancialCardFromConfig({ card, value }: FinancialCardFromConfigProps) {
  const { t } = useTranslation()
  
  const formatValue = () => {
    if (card.format === 'currency') {
      return `${card.currencySymbol || ''}${value.toLocaleString()}`
    } else if (card.format === 'percentage') {
      return `${value.toFixed(card.decimals || 0)}%`
    }
    return value.toLocaleString()
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">{t(card.titleKey)}</CardTitle>
        {card.descriptionKey && <CardDescription>{t(card.descriptionKey)}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold font-mono">
          {formatValue()}
        </div>
        {card.trend?.enabled && (
          <div className={cn('flex items-center gap-1 mt-2 text-sm', card.trend.color)}>
            {card.trend.direction === 'up' ? (
              <ArrowUp size={16} weight="bold" />
            ) : (
              <ArrowDown size={16} weight="bold" />
            )}
            <span>{t(card.trend.textKey, card.trend.textParams)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ActivityItemFromConfigProps {
  activity: DashboardActivity
}

function ActivityItemFromConfig({ activity }: ActivityItemFromConfigProps) {
  const { t } = useTranslation()
  const IconComponent = iconMap[activity.icon]

  const description = activity.description || 
    (activity.descriptionKey ? t(activity.descriptionKey, activity.descriptionParams) : '')

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        {IconComponent && <IconComponent size={18} className={activity.iconColor} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{t(activity.titleKey)}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {t(activity.timeKey, activity.timeParams)}
      </span>
    </div>
  )
}

interface QuickActionFromConfigProps {
  action: DashboardAction
}

function QuickActionFromConfig({ action }: QuickActionFromConfigProps) {
  const { t } = useTranslation()
  const IconComponent = iconMap[action.icon]

  return (
    <Button className="w-full justify-start" variant="outline">
      {IconComponent && <IconComponent size={18} className="mr-2" />}
      {t(action.labelKey)}
    </Button>
  )
}
