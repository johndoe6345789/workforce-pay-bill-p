export function createAriaLiveRegion() {
  const region = document.createElement('div')
  region.setAttribute('role', 'status')
  region.setAttribute('aria-live', 'polite')
  region.setAttribute('aria-atomic', 'true')
  region.className = 'sr-only'
  document.body.appendChild(region)
  return region
}

export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
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

export function isAccessibilityFeatureEnabled(
  feature: 'reduceMotion' | 'highContrast' | 'screenReader'
): boolean {
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
