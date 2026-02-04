import { useCallback, useEffect, useRef } from 'react'

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  type: 'render' | 'network' | 'interaction' | 'custom'
}

interface PerformanceStats {
  metrics: PerformanceMetric[]
  averages: Record<string, number>
  peaks: Record<string, number>
}

const metrics: PerformanceMetric[] = []
const MAX_METRICS = 1000

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

  const measureInteraction = useCallback((actionName: string, action: () => void | Promise<void>) => {
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
  }, [componentName])

  return { measureInteraction }
}

export function recordMetric(name: string, value: number, type: PerformanceMetric['type'] = 'custom') {
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

  return {
    metrics,
    averages,
    peaks,
  }
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
