import type {
  DashboardConfig,
  DashboardSection,
  DashboardActivity,
  DashboardAction,
} from './use-dashboard-config.types'

export function getMetricsSection(
  config: DashboardConfig | null
): DashboardSection | undefined {
  return config?.layout.sections.find((s) => s.type === 'metrics-grid')
}

export function getFinancialSection(
  config: DashboardConfig | null
): DashboardSection | undefined {
  return config?.layout.sections.find((s) => s.type === 'cards-grid')
}

export function getActivitySection(
  config: DashboardConfig | null
): DashboardSection | undefined {
  return config?.layout.sections.find((s) => s.type === 'two-column-cards')
}

export function getRecentActivities(
  config: DashboardConfig | null,
  maxItems?: number
): DashboardActivity[] {
  if (!config?.recentActivities) return []
  return maxItems
    ? config.recentActivities.slice(0, maxItems)
    : config.recentActivities
}

export function getQuickActions(
  config: DashboardConfig | null
): DashboardAction[] {
  const activitySection = getActivitySection(config)
  const actionsCard = activitySection?.cards?.find(
    (c) => c.type === 'action-list'
  )
  return actionsCard?.actions ?? []
}
