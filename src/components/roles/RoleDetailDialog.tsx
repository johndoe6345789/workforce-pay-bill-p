import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, Key, Pencil } from '@phosphor-icons/react'
import { getColorClass, type RoleWithUsers } from '@/hooks/useRolesPermissionsView'
import type { Permission } from '@/hooks/use-permissions'

interface Props {
  role: RoleWithUsers | null
  open: boolean
  onOpenChange: (open: boolean) => void
  canManageRoles: boolean
  modules: string[]
  permissions: Permission[]
  currentUserRoleId?: string
  onEdit: () => void
  t: (key: string) => string
}

export function RoleDetailDialog({ role, open, onOpenChange, canManageRoles, modules, permissions, currentUserRoleId, onEdit, t }: Props) {
  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge className={getColorClass(role.color)}>{role.name}</Badge>
          </DialogTitle>
          <DialogDescription>{role.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2"><Users size={16} /><span>{role.userCount} {t('roles.usersAssigned')}</span></div>
              <div className="flex items-center gap-2"><Key size={16} /><span>{role.permissions.length} {t('roles.permissions')}</span></div>
            </div>
            {currentUserRoleId === role.id && (
              <Alert><AlertDescription>{t('roles.thisIsYourCurrentRole')}</AlertDescription></Alert>
            )}
            <div className="space-y-3">
              <h4 className="font-semibold">{t('roles.assignedPermissions')}</h4>
              {role.permissions.includes('*') ? (
                <Alert><AlertDescription className="font-semibold">✓ {t('roles.fullSystemAccess')}</AlertDescription></Alert>
              ) : (
                <div className="space-y-2">
                  {modules.map(module => {
                    const modulePerms = role.permissions.filter(p => p.startsWith(module + '.'))
                    if (!modulePerms.length) return null
                    return (
                      <div key={module} className="space-y-2">
                        <h5 className="font-medium text-sm capitalize text-muted-foreground">{module}</h5>
                        <div className="grid gap-2 pl-4">
                          {modulePerms.map(perm => (
                            <div key={perm} className="flex items-start gap-2 text-sm">
                              <Badge variant="outline" className="font-mono text-xs">{perm}</Badge>
                              <span className="text-muted-foreground">{permissions.find(p => p.id === perm)?.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.close')}</Button>
          {canManageRoles && <Button onClick={onEdit}><Pencil className="mr-2" />{t('roles.editRole')}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
