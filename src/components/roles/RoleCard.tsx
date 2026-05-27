import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Key, Pencil, Copy } from '@phosphor-icons/react'
import { getColorClass, type RoleWithUsers } from '@/hooks/useRolesPermissionsView'

interface Props {
  role: RoleWithUsers
  canManageRoles: boolean
  onView: (r: RoleWithUsers) => void
  onEdit: (r: RoleWithUsers) => void
  onDuplicate: (r: RoleWithUsers) => void
  t: (key: string) => string
}

export function RoleCard({ role, canManageRoles, onView, onEdit, onDuplicate, t }: Props) {
  return (
    <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{role.name}</h3>
            <Badge className={getColorClass(role.color)}>{role.id}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{role.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users size={16} /><span>{role.userCount} {t('roles.users')}</span>
        <span className="mx-2">•</span>
        <Key size={16} /><span>{role.permissions.length} {t('roles.permissions')}</span>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(role)}>{t('roles.viewDetails')}</Button>
        {canManageRoles && (
          <>
            <Button variant="outline" size="sm" onClick={() => onEdit(role)}><Pencil size={16} /></Button>
            <Button variant="outline" size="sm" onClick={() => onDuplicate(role)}><Copy size={16} /></Button>
          </>
        )}
      </div>
    </Card>
  )
}
