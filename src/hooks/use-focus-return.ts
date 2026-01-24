import { useEffect, useRef } from 'react'

export function useFocusReturn() {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }

  const restoreFocus = () => {
    if (previousFocusRef.current && previousFocusRef.current.focus) {
      previousFocusRef.current.focus()
    }
  }

  return { saveFocus, restoreFocus }
}
