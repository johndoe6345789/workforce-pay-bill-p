export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  WIDE: 1536,
} as const

export const STATUS_COLORS = {
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
  draft: 'secondary',
  processing: 'info',
} as const

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const

export const ROUTES = {
  DASHBOARD: 'dashboard',
  TIMESHEETS: 'timesheets',
  BILLING: 'billing',
  PAYROLL: 'payroll',
  COMPLIANCE: 'compliance',
  EXPENSES: 'expenses',
  REPORTS: 'reports',
  PROFILE: 'profile',
} as const

export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  APPROVE: 'approve',
  EXPORT: 'export',
} as const

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CAD: 'CAD',
  AUD: 'AUD',
} as const

export const LOCALES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  FRENCH: 'fr',
} as const
