import { useState, useCallback } from 'react'

export function useCopyToClipboard(): [string | null, (text: string) => Promise<void>] {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
    }
  }, [])

  return [copiedText, copy]
}
