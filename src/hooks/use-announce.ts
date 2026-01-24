import { useEffect } from 'react'
import { announceToScreenReader } from '@/lib/accessibility'

export function useAnnounce() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority)
  }

  return announce
}
