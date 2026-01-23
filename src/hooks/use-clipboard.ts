import { useState, useCallback } from 'react'

export interface UseClipboardOptions {
  timeout?: number
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000 } = options
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setError(null)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return true
    } catch (err) {
      setError(err as Error)
      setIsCopied(false)
      return false
    }
  }, [timeout])

  const reset = useCallback(() => {
    setIsCopied(false)
    setError(null)
  }, [])

  return {
    isCopied,
    error,
    copy,
    reset
  }
}
