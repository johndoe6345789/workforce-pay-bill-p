export interface PerformanceMetrics {
  name: string
  duration: number
  startTime: number
  endTime: number
  memory?: {
    used: number
    total: number
  }
}

export interface PerformanceReport {
  totalMetrics: number
  averageDuration: number
  slowest: PerformanceMetrics | null
  fastest: PerformanceMetrics | null
  metrics: PerformanceMetrics[]
}
