export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))
}

export function trapFocus(container: HTMLElement) {
  const focusableElements = getFocusableElements(container)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

export class FocusManager {
  private previousFocus: HTMLElement | null = null

  save() {
    this.previousFocus = document.activeElement as HTMLElement
  }

  restore() {
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus()
      this.previousFocus = null
    }
  }

  clear() {
    this.previousFocus = null
  }
}

export function createSkipLink(
  targetId: string,
  text: string = 'Skip to main content'
) {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className =
    'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 ' +
    'focus:z-50 focus:bg-primary focus:text-primary-foreground ' +
    'focus:px-4 focus:py-2 focus:rounded-md'

  skipLink.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.setAttribute('tabindex', '-1')
      target.focus()
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), {
        once: true,
      })
    }
  })

  return skipLink
}
