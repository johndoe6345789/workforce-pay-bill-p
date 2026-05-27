export function isValidPermission(permission: unknown): permission is string {
  if (typeof permission !== 'string') return false

  const validPermissions = [
    'view:dashboard',
    'view:timesheets',
    'create:timesheets',
    'approve:timesheets',
    'view:billing',
    'create:invoices',
    'view:payroll',
    'process:payroll',
    'view:compliance',
    'manage:compliance',
    'view:expenses',
    'approve:expenses',
    'view:reports',
    'export:reports',
    'manage:users',
    'manage:settings',
    'view:audit-trail',
    'manage:permissions',
  ]

  return validPermissions.includes(permission)
}

export function isValidRole(role: unknown): role is string {
  if (typeof role !== 'string') return false

  const validRoles = [
    'super-admin',
    'admin',
    'manager',
    'accountant',
    'hr',
    'worker',
    'client',
  ]

  return validRoles.includes(role)
}

export function isValidStatus<T extends string>(
  value: unknown,
  validStatuses: readonly T[]
): value is T {
  return typeof value === 'string' && (validStatuses as readonly string[]).includes(value)
}

export function isArrayOf<T>(
  arr: unknown,
  typeGuard: (item: unknown) => item is T
): arr is T[] {
  return Array.isArray(arr) && arr.every(typeGuard)
}

export function isRecordOf<T>(
  obj: unknown,
  valueGuard: (value: unknown) => value is T
): obj is Record<string, T> {
  if (!obj || typeof obj !== 'object') return false

  return Object.values(obj).every(valueGuard)
}

export function hasProperty<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return obj !== null && typeof obj === 'object' && key in obj
}

export function hasProperties<K extends string>(
  obj: unknown,
  keys: K[]
): obj is Record<K, unknown> {
  return obj !== null && typeof obj === 'object' && keys.every(key => key in obj)
}
