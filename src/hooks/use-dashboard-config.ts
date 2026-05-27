import { useState, useEffect } from 'react'
import dashboardConfig from '@/data/dashboard.json'
import type { DashboardConfig } from './use-dashboard-config.types'
import {
  getMetricsSection,
  getFinancialSection,
  getActivitySection,
  getRecentActivities,
  getQuickActions,
} from './use-dashboard-selectors'

export type {
  DashboardMetric,
  DashboardCard,
  DashboardActivity,
  DashboardAction,
  DashboardSection,
  DashboardConfig,
} from './use-dashboard-config.types'

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      setConfig(dashboardConfig as DashboardConfig)
      setLoading(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to load dashboard config')
      )
      setLoading(false)
    }
  }, [])

  return {
    config,
    loading,
    error,
    getMetricsSection: () => getMetricsSection(config),
    getFinancialSection: () => getFinancialSection(config),
    getActivitySection: () => getActivitySection(config),
    getRecentActivities: (maxItems?: number) =>
      getRecentActivities(config, maxItems),
    getQuickActions: () => getQuickActions(config),
  }
}
