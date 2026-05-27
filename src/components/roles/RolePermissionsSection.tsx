import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { Permission } from '@/hooks/use-permissions'

interface Props {
  modules: string[]
  allPermissions: Permission[]
  selectedPermissions: string[]
  onTogglePermission: (id: string) => void
  onToggleModule: (module: string) => void
  t: (key: string) => string
}

export function RolePermissionsSection({ modules, allPermissions, selectedPermissions, onTogglePermission, onToggleModule, t }: Props) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">{t('roles.permissionsTab')}</h4>
      {modules.map(module => {
        const modulePerms = allPermissions.filter(p => p.module === module)
        const selectedCount = modulePerms.filter(p => selectedPermissions.includes(p.id)).length
        return (
          <div key={module} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox checked={selectedCount === modulePerms.length} onCheckedChange={() => onToggleModule(module)} />
                <label className="font-medium capitalize cursor-pointer">{module}</label>
              </div>
              <Badge variant="outline">{selectedCount} / {modulePerms.length}</Badge>
            </div>
            <div className="grid gap-2 pl-6">
              {modulePerms.map(permission => (
                <div key={permission.id} className="flex items-start gap-2">
                  <Checkbox checked={selectedPermissions.includes(permission.id)} onCheckedChange={() => onTogglePermission(permission.id)} />
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
  )
}
