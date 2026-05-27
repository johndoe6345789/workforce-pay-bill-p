export interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  type: 'render' | 'network' | 'interaction' | 'custom'
}

export interface PerformanceStats {
  metrics: PerformanceMetric[]
  averages: Record<string, number>
  peaks: Record<string, number>
}
