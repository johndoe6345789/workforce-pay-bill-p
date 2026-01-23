import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import rolesData from '@/data/roles-permissions.json'

export interface Permission {
  id: string
  module: string
  name: string
  description: string
}

export interface Role {
  id: string
  name: string
  description: string
  color: string
  permissions: string[]
}

export function usePermissions() {
  const user = useAppSelector(state => state.auth.user)
  
  const userPermissions = useMemo(() => {
    if (!user) return []
    
    if (user.permissions && user.permissions.length > 0) {
      return user.permissions
    }
    
    const userRole = rolesData.roles.find(role => 
      role.id === user.roleId || role.name === user.role
    )
    
    if (!userRole) return []
    
    return userRole.permissions
  }, [user])

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    if (userPermissions.includes('*')) return true
    
    if (userPermissions.includes(permission)) return true
    
    const [module, action] = permission.split('.')
    const wildcardPermission = `${module}.*`
    
    return userPermissions.includes(wildcardPermission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  const canAccess = (module: string, action?: string): boolean => {
    if (!action) {
      return hasPermission(`${module}.view`)
    }
    return hasPermission(`${module}.${action}`)
  }

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    roles: rolesData.roles as Role[],
    permissions: rolesData.permissions as Permission[]
  }
}
