import { useEffect, useRef } from 'react'
import { trapFocus } from '@/lib/accessibility'

export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const cleanup = trapFocus(containerRef.current)
    return cleanup
  }, [enabled])

  return containerRef
}
