import type { PerformanceMetric, PerformanceStats } from './use-performance-monitor.types'

export const metrics: PerformanceMetric[] = []
const MAX_METRICS = 1000

export function recordMetric(
  name: string,
  value: number,
  type: PerformanceMetric['type'] = 'custom',
) {
  const metric: PerformanceMetric = {
    name,
    value,
    timestamp: Date.now(),
    type,
  }

  metrics.push(metric)

  if (metrics.length > MAX_METRICS) {
    metrics.shift()
  }

  if (import.meta.env.DEV && value > 1000) {
    console.warn(`⚠️ Performance warning: ${name} took ${value.toFixed(2)}ms`)
  }
}

export function getPerformanceStats(): PerformanceStats {
  const grouped: Record<string, number[]> = {}

  metrics.forEach(metric => {
    if (!grouped[metric.name]) {
      grouped[metric.name] = []
    }
    grouped[metric.name].push(metric.value)
  })

  const averages: Record<string, number> = {}
  const peaks: Record<string, number> = {}

  Object.entries(grouped).forEach(([name, values]) => {
    averages[name] = values.reduce((sum, v) => sum + v, 0) / values.length
    peaks[name] = Math.max(...values)
  })

  return { metrics, averages, peaks }
}

export function clearPerformanceMetrics() {
  metrics.length = 0
}

export function exportPerformanceReport(): string {
  const stats = getPerformanceStats()

  const report = {
    timestamp: new Date().toISOString(),
    totalMetrics: stats.metrics.length,
    summary: {
      averages: stats.averages,
      peaks: stats.peaks,
    },
    slowOperations: stats.metrics
      .filter(m => m.value > 500)
      .sort((a, b) => b.value - a.value)
      .slice(0, 20),
  }

  return JSON.stringify(report, null, 2)
}
