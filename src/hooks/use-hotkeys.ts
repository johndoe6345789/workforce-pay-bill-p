import { useEffect, useCallback } from 'react'

export interface HotkeyConfig {
  keys: string
  callback: (event: KeyboardEvent) => void
  description?: string
  preventDefault?: boolean
  enabled?: boolean
}

export function useHotkeys(configs: HotkeyConfig[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    configs.forEach(({ keys, callback, preventDefault = true, enabled = true }) => {
      if (!enabled) return

      const parts = keys.toLowerCase().split('+')
      const key = parts[parts.length - 1]
      const requiresCtrl = parts.includes('ctrl') || parts.includes('control')
      const requiresShift = parts.includes('shift')
      const requiresAlt = parts.includes('alt')
      const requiresMeta = parts.includes('meta') || parts.includes('cmd')

      const keyMatches = event.key.toLowerCase() === key
      const ctrlMatches = requiresCtrl ? event.ctrlKey || event.metaKey : true
      const shiftMatches = requiresShift ? event.shiftKey : true
      const altMatches = requiresAlt ? event.altKey : true
      const metaMatches = requiresMeta ? event.metaKey : true

      if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
        if (preventDefault) {
          event.preventDefault()
        }
        callback(event)
      }
    })
  }, [configs])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
