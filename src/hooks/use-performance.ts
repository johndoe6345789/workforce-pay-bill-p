import { useEffect, useRef, useCallback } from 'react'
import { performanceMonitor } from '@/lib/performance-monitor'

export function usePerformanceMark(label: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    performanceMonitor.start(label)

    return () => {
      performanceMonitor.end(label)
    }
  }, [label, enabled])
}

export function usePerformanceMeasure() {
  const measure = useCallback(<T,>(label: string, fn: () => T): T => {
    return performanceMonitor.measure(label, fn)
  }, [])

  const measureAsync = useCallback(async <T,>(label: string, fn: () => Promise<T>): Promise<T> => {
    return performanceMonitor.measureAsync(label, fn)
  }, [])

  return { measure, measureAsync }
}

export function useRenderCount(componentName: string, log = false) {
  const renderCount = useRef(0)

  renderCount.current += 1

  useEffect(() => {
    if (log) {
      console.log(`[${componentName}] Render count: ${renderCount.current}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  return renderCount.current
}

export function useWhyDidYouUpdate(componentName: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any> | undefined>(undefined)

  const changedProps: Record<string, { from: any; to: any }> = {}

  if (previousProps.current) {
    const allKeys = Object.keys({ ...previousProps.current, ...props })

    allKeys.forEach((key) => {
      if (previousProps.current![key] !== props[key]) {
        changedProps[key] = {
          from: previousProps.current![key],
          to: props[key],
        }
      }
    })
  }

  useEffect(() => {
    if (Object.keys(changedProps).length > 0) {
      console.log(`[${componentName}] Props changed:`, changedProps)
    }

    previousProps.current = props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })
}

export function useComponentLoad(componentName: string) {
  useEffect(() => {
    const loadTime = performance.now()
    console.log(`[${componentName}] Loaded at ${loadTime.toFixed(2)}ms`)

    return () => {
      const unloadTime = performance.now()
      const lifespan = unloadTime - loadTime
      console.log(
        `[${componentName}] Unloaded after ${lifespan.toFixed(2)}ms (${(lifespan / 1000).toFixed(2)}s)`
      )
    }
  }, [componentName])
}
