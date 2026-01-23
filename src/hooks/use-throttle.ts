import { useCallback, useEffect, useRef } from 'react'

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef(Date.now())

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastRan.current >= delay) {
        callback(...args)
        lastRan.current = now
      }
    },
    [callback, delay]
  ) as T
}
