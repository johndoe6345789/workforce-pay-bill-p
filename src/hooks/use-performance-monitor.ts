import { useCallback, useEffect, useRef } from 'react'
import { recordMetric } from './use-performance-monitor.utils'

export { recordMetric, getPerformanceStats, clearPerformanceMetrics, exportPerformanceReport } from './use-performance-monitor.utils'
export type { PerformanceMetric, PerformanceStats } from './use-performance-monitor.types'

export function usePerformanceMonitor(componentName: string) {
  const renderCountRef = useRef(0)
  const mountTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    renderCountRef.current++
  })

  useEffect(() => {
    const mountTime = Date.now() - mountTimeRef.current
    recordMetric(`${componentName}:mount`, mountTime, 'render')

    return () => {
      const lifetimeMs = Date.now() - mountTimeRef.current
      recordMetric(`${componentName}:lifetime`, lifetimeMs, 'custom')
      recordMetric(`${componentName}:renders`, renderCountRef.current, 'custom')
    }
  }, [componentName])

  const measureInteraction = useCallback(
    (actionName: string, action: () => void | Promise<void>) => {
      const start = performance.now()
      const result = action()

      if (result instanceof Promise) {
        result.finally(() => {
          const duration = performance.now() - start
          recordMetric(`${componentName}:${actionName}`, duration, 'interaction')
        })
      } else {
        const duration = performance.now() - start
        recordMetric(`${componentName}:${actionName}`, duration, 'interaction')
      }

      return result
    },
    [componentName],
  )

  return { measureInteraction }
}
