interface PerformanceMetrics {
  name: string
  duration: number
  startTime: number
  endTime: number
  memory?: {
    used: number
    total: number
  }
}

interface PerformanceReport {
  totalMetrics: number
  averageDuration: number
  slowest: PerformanceMetrics | null
  fastest: PerformanceMetrics | null
  metrics: PerformanceMetrics[]
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics[]> = new Map()
  private activeTimers: Map<string, number> = new Map()

  start(label: string): void {
    this.activeTimers.set(label, performance.now())
  }

  end(label: string): PerformanceMetrics | null {
    const startTime = this.activeTimers.get(label)
    if (!startTime) {
      console.warn(`No active timer found for label: ${label}`)
      return null
    }

    const endTime = performance.now()
    const duration = endTime - startTime

    const metric: PerformanceMetrics = {
      name: label,
      duration,
      startTime,
      endTime,
    }

    if ('memory' in performance && (performance as any).memory) {
      const perfMemory = (performance as any).memory
      metric.memory = {
        used: perfMemory.usedJSHeapSize,
        total: perfMemory.totalJSHeapSize,
      }
    }

    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    this.metrics.get(label)!.push(metric)

    this.activeTimers.delete(label)

    return metric
  }

  measure<T>(label: string, fn: () => T): T {
    this.start(label)
    try {
      const result = fn()
      return result
    } finally {
      this.end(label)
    }
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    try {
      const result = await fn()
      return result
    } finally {
      this.end(label)
    }
  }

  getReport(label?: string): PerformanceReport {
    const metricsToAnalyze = label
      ? this.metrics.get(label) || []
      : Array.from(this.metrics.values()).flat()

    if (metricsToAnalyze.length === 0) {
      return {
        totalMetrics: 0,
        averageDuration: 0,
        slowest: null,
        fastest: null,
        metrics: [],
      }
    }

    const totalDuration = metricsToAnalyze.reduce((sum, m) => sum + m.duration, 0)
    const averageDuration = totalDuration / metricsToAnalyze.length

    const sorted = [...metricsToAnalyze].sort((a, b) => a.duration - b.duration)

    return {
      totalMetrics: metricsToAnalyze.length,
      averageDuration,
      slowest: sorted[sorted.length - 1],
      fastest: sorted[0],
      metrics: metricsToAnalyze,
    }
  }

  clear(label?: string): void {
    if (label) {
      this.metrics.delete(label)
      this.activeTimers.delete(label)
    } else {
      this.metrics.clear()
      this.activeTimers.clear()
    }
  }

  logReport(label?: string): void {
    const report = this.getReport(label)
    const prefix = label ? `[${label}]` : '[All Metrics]'

    console.group(`${prefix} Performance Report`)
    console.log(`Total Measurements: ${report.totalMetrics}`)
    console.log(`Average Duration: ${report.averageDuration.toFixed(2)}ms`)
    if (report.fastest) {
      console.log(`Fastest: ${report.fastest.duration.toFixed(2)}ms`)
    }
    if (report.slowest) {
      console.log(`Slowest: ${report.slowest.duration.toFixed(2)}ms`)
    }
    console.groupEnd()
  }

  getAllLabels(): string[] {
    return Array.from(this.metrics.keys())
  }
}

export const performanceMonitor = new PerformanceMonitor()

export function measurePerformance<T>(label: string, fn: () => T): T {
  return performanceMonitor.measure(label, fn)
}

export async function measurePerformanceAsync<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  return performanceMonitor.measureAsync(label, fn)
}
