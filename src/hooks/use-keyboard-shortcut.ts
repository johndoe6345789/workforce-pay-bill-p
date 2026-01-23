import { useEffect } from 'react'

type KeyboardShortcut = {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
}

export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  callback: (event: KeyboardEvent) => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matches =
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        (!shortcut.ctrl || event.ctrlKey) &&
        (!shortcut.shift || event.shiftKey) &&
        (!shortcut.alt || event.altKey) &&
        (!shortcut.meta || event.metaKey)

      if (matches) {
        event.preventDefault()
        callback(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcut, callback])
}
