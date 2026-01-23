import { useState, useCallback, useEffect } from 'react'

export interface UseClipboardOptions {
  timeout?: number
}

export interface UseClipboardResult {
  copied: boolean
  copy: (text: string) => Promise<boolean>
  reset: () => void
}

export function useClipboardCopy(options: UseClipboardOptions = {}): UseClipboardResult {
  const { timeout = 2000 } = options
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, timeout)
      return () => clearTimeout(timer)
    }
  }, [copied, timeout])

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      setCopied(false)
      return false
    }
  }, [])

  const reset = useCallback(() => {
    setCopied(false)
  }, [])

  return { copied, copy, reset }
}
