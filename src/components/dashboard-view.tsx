import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DashboardMetrics } from '@/lib/types'
import { useTranslation } from '@/hooks/use-translation'
import { useDashboardConfig } from '@/hooks/use-dashboard-config'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LiveRefreshIndicator } from '@/components/LiveRefreshIndicator'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { FinancialCard } from '@/components/dashboard/FinancialCard'
import { ActivityItem } from '@/components/dashboard/ActivityItem'
import { QuickAction } from '@/components/dashboard/QuickAction'

interface DashboardViewProps { metrics: DashboardMetrics }

export function DashboardView({ metrics }: DashboardViewProps) {
  const { t } = useTranslation()
  const { config, loading, error, getMetricsSection, getFinancialSection, getRecentActivities, getQuickActions } = useDashboardConfig()
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => { setLastUpdated(new Date()) }, [metrics])

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
  if (error || !config) return <div className="text-center text-destructive py-8">Failed to load dashboard configuration</div>

  const metricsSection = getMetricsSection()
  const financialSection = getFinancialSection()
  const activities = getRecentActivities(4)
  const actions = getQuickActions()

  const getMetricValue = (dataSource: string): number => {
    const path = dataSource.split('.')
    let value: any = { metrics }
    for (const key of path) value = value?.[key]
    return typeof value === 'number' ? value : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('dashboard.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <LiveRefreshIndicator lastUpdated={lastUpdated} pollingInterval={2000} />
      </div>

      {metricsSection && (
        <div className={cn('grid gap-4', `grid-cols-${metricsSection.columns.mobile}`, `md:grid-cols-${metricsSection.columns.tablet}`, `lg:grid-cols-${metricsSection.columns.desktop}`)}>
          {metricsSection.metrics?.map(metric => <MetricCard key={metric.id} metric={metric} value={getMetricValue(metric.dataSource)} />)}
        </div>
      )}

      {financialSection && (
        <div className={cn('grid gap-4', `grid-cols-${financialSection.columns.mobile}`, `md:grid-cols-${financialSection.columns.tablet}`, `lg:grid-cols-${financialSection.columns.desktop}`)}>
          {financialSection.cards?.map(card => <FinancialCard key={card.id} card={card} value={getMetricValue(card.dataSource || '')} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>{t('dashboard.recentActivityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">{activities.map(a => <ActivityItem key={a.id} activity={a} />)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>{t('dashboard.quickActionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">{actions.map(a => <QuickAction key={a.id} action={a} />)}</CardContent>
        </Card>
      </div>
    </div>
  )
}
