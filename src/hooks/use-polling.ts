import { useEffect, useRef } from 'react'
import type { PollingOptions } from './use-polling.types'
import { usePollingEngine } from './use-polling-engine'

export type { PollingOptions } from './use-polling.types'

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: PollingOptions<T>
) {
  const { enabled = true } = options
  const isMountedRef = useRef(true)

  const engine = usePollingEngine(fetchFn, options)

  useEffect(() => {
    isMountedRef.current = true
    if (enabled && engine.isPolling) {
      void engine.refresh()
    }
    return () => {
      isMountedRef.current = false
      engine.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return engine
}
