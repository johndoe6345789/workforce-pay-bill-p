import { useState, useEffect } from 'react'
import dashboardConfig from '@/data/dashboard.json'

export interface DashboardMetric {
  id: string
  titleKey: string
  dataSource: string
  icon: string
  iconColor: string
  variant: 'default' | 'success' | 'warning' | 'error'
  trend?: {
    enabled: boolean
    direction: 'up' | 'down'
    value: number
    textKey: string
    textParams?: Record<string, string>
  }
}

export interface DashboardCard {
  id: string
  type?: string
  titleKey: string
  descriptionKey?: string
  dataSource?: string
  format?: 'currency' | 'percentage' | 'number'
  currencySymbol?: string
  decimals?: number
  trend?: {
    enabled: boolean
    direction: 'up' | 'down'
    value: number
    textKey: string
    textParams?: Record<string, string>
    color: string
  }
  actions?: DashboardAction[]
}

export interface DashboardActivity {
  id: string
  icon: string
  iconColor: string
  titleKey: string
  description?: string
  descriptionKey?: string
  descriptionParams?: Record<string, string>
  timeKey: string
  timeParams?: Record<string, string>
  timestamp: string
}

export interface DashboardAction {
  id: string
  labelKey: string
  icon: string
  action: string
  target: string
}

export interface DashboardSection {
  id: string
  type: string
  columns: {
    mobile: number
    tablet: number
    desktop: number
  }
  metrics?: DashboardMetric[]
  cards?: DashboardCard[]
  actions?: DashboardAction[]
}

export interface DashboardConfig {
  layout: {
    sections: DashboardSection[]
  }
  recentActivities: DashboardActivity[]
}

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      setConfig(dashboardConfig as DashboardConfig)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load dashboard config'))
      setLoading(false)
    }
  }, [])

  const getMetricsSection = () => {
    return config?.layout.sections.find(s => s.type === 'metrics-grid')
  }

  const getFinancialSection = () => {
    return config?.layout.sections.find(s => s.type === 'cards-grid')
  }

  const getActivitySection = () => {
    return config?.layout.sections.find(s => s.type === 'two-column-cards')
  }

  const getRecentActivities = (maxItems?: number) => {
    if (!config?.recentActivities) return []
    return maxItems 
      ? config.recentActivities.slice(0, maxItems)
      : config.recentActivities
  }

  const getQuickActions = () => {
    const activitySection = getActivitySection()
    const actionsCard = activitySection?.cards?.find(c => c.type === 'action-list')
    return actionsCard?.actions || []
  }

  return {
    config,
    loading,
    error,
    getMetricsSection,
    getFinancialSection,
    getActivitySection,
    getRecentActivities,
    getQuickActions
  }
}
