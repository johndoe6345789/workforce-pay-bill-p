import { useRef, useCallback } from 'react'

export function useOptimisticTimers() {
  const rollbackTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const setTimer = useCallback(
    (id: string, callback: () => void, ms: number) => {
      const timer = setTimeout(callback, ms)
      rollbackTimers.current.set(id, timer)
      return timer
    },
    [],
  )

  const clearTimer = useCallback((id: string) => {
    const timer = rollbackTimers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      rollbackTimers.current.delete(id)
    }
  }, [])

  const clearAllTimers = useCallback(() => {
    rollbackTimers.current.forEach(timer => clearTimeout(timer))
    rollbackTimers.current.clear()
  }, [])

  return { setTimer, clearTimer, clearAllTimers }
}
