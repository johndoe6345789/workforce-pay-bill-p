import type { View } from '@/types/view'

interface ShortcutDef {
  key: string
  ctrl?: boolean
  alt?: boolean
  description: string
  action: () => void
}

export function buildAppKeyboardShortcuts(
  handleViewChange: (view: View) => void,
  onShowShortcuts: () => void,
): ShortcutDef[] {
  return [
    { key: '?', ctrl: true, description: 'Show keyboard shortcuts', action: onShowShortcuts },
    { key: '1', alt: true, description: 'Go to Dashboard', action: () => handleViewChange('dashboard') },
    { key: '2', alt: true, description: 'Go to Timesheets', action: () => handleViewChange('timesheets') },
    { key: '3', alt: true, description: 'Go to Billing', action: () => handleViewChange('billing') },
    { key: '4', alt: true, description: 'Go to Payroll', action: () => handleViewChange('payroll') },
    { key: '5', alt: true, description: 'Go to Compliance', action: () => handleViewChange('compliance') },
  ]
}
