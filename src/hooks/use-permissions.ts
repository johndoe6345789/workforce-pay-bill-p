import { useMemo } from 'react'

export type Permission = 
  | 'timesheets.view'
  | 'timesheets.approve'
  | 'timesheets.create'
  | 'timesheets.edit'
  | 'invoices.view'
  | 'invoices.create'
  | 'invoices.send'
  | 'payroll.view'
  | 'payroll.process'
  | 'compliance.view'
  | 'compliance.upload'
  | 'expenses.view'
  | 'expenses.approve'
  | 'reports.view'
  | 'settings.manage'
  | 'users.manage'

export type Role = 'admin' | 'manager' | 'accountant' | 'viewer'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'timesheets.view', 'timesheets.approve', 'timesheets.create', 'timesheets.edit',
    'invoices.view', 'invoices.create', 'invoices.send',
    'payroll.view', 'payroll.process',
    'compliance.view', 'compliance.upload',
    'expenses.view', 'expenses.approve',
    'reports.view',
    'settings.manage', 'users.manage'
  ],
  manager: [
    'timesheets.view', 'timesheets.approve', 'timesheets.create',
    'invoices.view', 'invoices.create',
    'payroll.view',
    'compliance.view', 'compliance.upload',
    'expenses.view', 'expenses.approve',
    'reports.view'
  ],
  accountant: [
    'timesheets.view',
    'invoices.view', 'invoices.create', 'invoices.send',
    'payroll.view', 'payroll.process',
    'expenses.view', 'expenses.approve',
    'reports.view'
  ],
  viewer: [
    'timesheets.view',
    'invoices.view',
    'payroll.view',
    'compliance.view',
    'expenses.view',
    'reports.view'
  ]
}

export function usePermissions(userRole: Role = 'viewer') {
  const permissions = useMemo(() => {
    return new Set(ROLE_PERMISSIONS[userRole] || [])
  }, [userRole])

  const hasPermission = (permission: Permission): boolean => {
    return permissions.has(permission)
  }

  const hasAnyPermission = (...perms: Permission[]): boolean => {
    return perms.some(p => permissions.has(p))
  }

  const hasAllPermissions = (...perms: Permission[]): boolean => {
    return perms.every(p => permissions.has(p))
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: Array.from(permissions)
  }
}
