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

export function createAriaLiveRegion() {
  const region = document.createElement('div')
  region.setAttribute('role', 'status')
  region.setAttribute('aria-live', 'polite')
  region.setAttribute('aria-atomic', 'true')
  region.className = 'sr-only'
  document.body.appendChild(region)
  return region
}

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const region = document.createElement('div')
  region.setAttribute('role', priority === 'assertive' ? 'alert' : 'status')
  region.setAttribute('aria-live', priority)
  region.setAttribute('aria-atomic', 'true')
  region.className = 'sr-only'
  region.textContent = message
  
  document.body.appendChild(region)
  
  setTimeout(() => {
    document.body.removeChild(region)
  }, 1000)
}

export function getAccessibleName(element: HTMLElement): string {
  return (
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent ||
    ''
  ).trim()
}

export function setAriaHidden(element: HTMLElement, hidden: boolean) {
  if (hidden) {
    element.setAttribute('aria-hidden', 'true')
    element.setAttribute('inert', '')
  } else {
    element.removeAttribute('aria-hidden')
    element.removeAttribute('inert')
  }
}

export function createSkipLink(targetId: string, text: string = 'Skip to main content') {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className = 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md'
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.setAttribute('tabindex', '-1')
      target.focus()
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
    }
  })
  
  return skipLink
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

export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0]
    const [r, g, b] = rgb.map((val) => {
      const normalized = val / 255
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

export function isAccessibilityFeatureEnabled(feature: 'reduceMotion' | 'highContrast' | 'screenReader'): boolean {
  if (typeof window === 'undefined') return false

  switch (feature) {
    case 'reduceMotion':
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    case 'highContrast':
      return window.matchMedia('(prefers-contrast: high)').matches
    case 'screenReader':
      return !!document.querySelector('[aria-live]')
    default:
      return false
  }
}
