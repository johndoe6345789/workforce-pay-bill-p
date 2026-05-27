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
