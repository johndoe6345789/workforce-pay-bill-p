import { useEffect, RefObject } from 'react'

export function useSkipLink(targetRef: RefObject<HTMLElement | null>, linkText: string = 'Skip to main content') {
  useEffect(() => {
    if (!targetRef.current) return

    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.textContent = linkText
    skipLink.className = 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring'

    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      if (targetRef.current) {
        targetRef.current.setAttribute('tabindex', '-1')
        targetRef.current.focus()
        targetRef.current.addEventListener(
          'blur',
          () => targetRef.current?.removeAttribute('tabindex'),
          { once: true }
        )
      }
    }

    skipLink.addEventListener('click', handleClick)
    document.body.insertBefore(skipLink, document.body.firstChild)

    return () => {
      skipLink.removeEventListener('click', handleClick)
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink)
      }
    }
  }, [targetRef, linkText])
}
