import type { PerformanceMetrics, PerformanceReport } from './performance-monitor.types'

type PerfMemory = { usedJSHeapSize: number; totalJSHeapSize: number }

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics[]> = new Map()
  private activeTimers: Map<string, number> = new Map()

  start(label: string): void {
    this.activeTimers.set(label, performance.now())
  }

  end(label: string): PerformanceMetrics | null {
    const startTime = this.activeTimers.get(label)
    if (!startTime) { console.warn(`No active timer found for label: ${label}`); return null }
    const endTime = performance.now()
    const metric: PerformanceMetrics = { name: label, duration: endTime - startTime, startTime, endTime }
    if ('memory' in performance && (performance as unknown as Record<string, unknown>).memory) {
      const mem = (performance as unknown as Record<string, PerfMemory>).memory
      metric.memory = { used: mem.usedJSHeapSize, total: mem.totalJSHeapSize }
    }
    if (!this.metrics.has(label)) this.metrics.set(label, [])
    this.metrics.get(label)!.push(metric)
    this.activeTimers.delete(label)
    return metric
  }

  measure<T>(label: string, fn: () => T): T {
    this.start(label)
    try { return fn() } finally { this.end(label) }
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    try { return await fn() } finally { this.end(label) }
  }

  getReport(label?: string): PerformanceReport {
    const all = label ? this.metrics.get(label) ?? [] : Array.from(this.metrics.values()).flat()
    if (all.length === 0) {
      return { totalMetrics: 0, averageDuration: 0, slowest: null, fastest: null, metrics: [] }
    }
    const averageDuration = all.reduce((s, m) => s + m.duration, 0) / all.length
    const sorted = [...all].sort((a, b) => a.duration - b.duration)
    return {
      totalMetrics: all.length,
      averageDuration,
      slowest: sorted[sorted.length - 1],
      fastest: sorted[0],
      metrics: all,
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
    const r = this.getReport(label)
    const prefix = label ? `[${label}]` : '[All Metrics]'
    console.group(`${prefix} Performance Report`)
    console.log(`Total Measurements: ${r.totalMetrics}`)
    console.log(`Average Duration: ${r.averageDuration.toFixed(2)}ms`)
    if (r.fastest) console.log(`Fastest: ${r.fastest.duration.toFixed(2)}ms`)
    if (r.slowest) console.log(`Slowest: ${r.slowest.duration.toFixed(2)}ms`)
    console.groupEnd()
  }

  getAllLabels(): string[] {
    return Array.from(this.metrics.keys())
  }
}
