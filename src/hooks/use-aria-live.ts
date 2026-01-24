import { useEffect, useRef } from 'react'

export function useAriaLive() {
  const liveRegionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const region = document.createElement('div')
    region.setAttribute('role', 'status')
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    document.body.appendChild(region)
    liveRegionRef.current = region

    return () => {
      if (liveRegionRef.current) {
        document.body.removeChild(liveRegionRef.current)
      }
    }
  }, [])

  const announce = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = ''
        }
      }, 1000)
    }
  }

  return announce
}
