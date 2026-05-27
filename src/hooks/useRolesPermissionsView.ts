import { useState } from 'react'
import { usePermissions, type Role } from '@/hooks/use-permissions'
import { useTranslation } from '@/hooks/use-translation'
import { useAppSelector } from '@/store/hooks'

export interface RoleWithUsers extends Role { userCount?: number }

const COLOR_MAP: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  info: 'bg-info text-info-foreground',
  muted: 'bg-muted text-muted-foreground',
}

export function getColorClass(color: string) {
  return COLOR_MAP[color] ?? COLOR_MAP.muted
}

export function useRolesPermissionsView() {
  const { t } = useTranslation()
  const { roles, permissions, hasPermission } = usePermissions()
  const currentUser = useAppSelector(state => state.auth.user)

  const [selectedRole, setSelectedRole] = useState<RoleWithUsers | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterModule, setFilterModule] = useState('all')

  const canManageRoles = hasPermission('settings.edit') || hasPermission('users.edit')

  const rolesWithUsers: RoleWithUsers[] = roles.map(role => ({ ...role, userCount: Math.floor(Math.random() * 50) }))
  const filteredRoles = rolesWithUsers.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const modules = Array.from(new Set(permissions.map(p => p.module)))
  const filteredPermissions = filterModule === 'all' ? permissions : permissions.filter(p => p.module === filterModule)

  return {
    t, permissions, modules, currentUser,
    selectedRole, setSelectedRole,
    isCreateDialogOpen, setIsCreateDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    searchQuery, setSearchQuery,
    filterModule, setFilterModule,
    canManageRoles, rolesWithUsers, filteredRoles, filteredPermissions,
  }
}
