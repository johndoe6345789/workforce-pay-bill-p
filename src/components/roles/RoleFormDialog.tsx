import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePermissions } from '@/hooks/use-permissions'
import { useTranslation } from '@/hooks/use-translation'
import type { RoleWithUsers } from '@/hooks/useRolesPermissionsView'

interface Props {
  role: RoleWithUsers | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function RoleFormDialog({ role, open, onOpenChange, onSave }: Props) {
  const { t } = useTranslation()
  const { permissions: allPermissions } = usePermissions()
  const modules = Array.from(new Set(allPermissions.map(p => p.module)))

  const [formData, setFormData] = useState({
    name: role?.name || '', description: role?.description || '',
    color: role?.color || 'muted', permissions: role?.permissions || [],
  })

  const patch = (updates: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...updates }))

  const togglePermission = (permissionId: string) => {
    patch({ permissions: formData.permissions.includes(permissionId)
      ? formData.permissions.filter(p => p !== permissionId)
      : [...formData.permissions, permissionId]
    })
  }

  const toggleModule = (module: string) => {
    const modulePerms = allPermissions.filter(p => p.module === module).map(p => p.id)
    const allSelected = modulePerms.every(p => formData.permissions.includes(p))
    patch({ permissions: allSelected
      ? formData.permissions.filter(p => !modulePerms.includes(p))
      : [...new Set([...formData.permissions, ...modulePerms])]
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{role ? t('roles.editRole') : t('roles.createNewRole')}</DialogTitle>
          <DialogDescription>{t('roles.defineRoleDetails')}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { label: t('roles.roleName'), key: 'name' as const, placeholder: t('roles.roleNamePlaceholder') },
                { label: t('roles.description'), key: 'description' as const, placeholder: t('roles.descriptionPlaceholder') },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium">{label}</label>
                  <Input value={formData[key]} onChange={e => patch({ [key]: e.target.value })} placeholder={placeholder} />
                </div>
              ))}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('roles.color')}</label>
                <select value={formData.color} onChange={e => patch({ color: e.target.value })} className="w-full px-4 py-2 border border-input rounded-md bg-background">
                  {['primary', 'secondary', 'accent', 'success', 'warning', 'info', 'muted'].map(c => (
                    <option key={c} value={c}>{t(`roles.${c}`)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">{t('roles.permissionsTab')}</h4>
              {modules.map(module => {
                const modulePerms = allPermissions.filter(p => p.module === module)
                const selectedCount = modulePerms.filter(p => formData.permissions.includes(p.id)).length
                return (
                  <div key={module} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={selectedCount === modulePerms.length} onCheckedChange={() => toggleModule(module)} />
                        <label className="font-medium capitalize cursor-pointer">{module}</label>
                      </div>
                      <Badge variant="outline">{selectedCount} / {modulePerms.length}</Badge>
                    </div>
                    <div className="grid gap-2 pl-6">
                      {modulePerms.map(permission => (
                        <div key={permission.id} className="flex items-start gap-2">
                          <Checkbox checked={formData.permissions.includes(permission.id)} onCheckedChange={() => togglePermission(permission.id)} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2"><code className="text-xs font-mono">{permission.id}</code></div>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
          <Button onClick={onSave}>{role ? t('roles.saveChanges') : t('roles.createRole')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
