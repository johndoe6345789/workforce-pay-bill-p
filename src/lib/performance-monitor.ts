export type { PerformanceMetrics, PerformanceReport } from './performance-monitor.types'
export { PerformanceMonitor } from './performance-monitor-class'
import { PerformanceMonitor } from './performance-monitor-class'

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
