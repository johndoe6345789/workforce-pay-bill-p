import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlass } from '@phosphor-icons/react'
import type { Permission } from '@/hooks/use-permissions'

interface Props {
  filteredPermissions: Permission[]
  modules: string[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  filterModule: string
  setFilterModule: (m: string) => void
  t: (key: string) => string
}

export function PermissionsTabContent({ filteredPermissions, modules, searchQuery, setSearchQuery, filterModule, setFilterModule, t }: Props) {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input placeholder={t('roles.searchPermissions')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="px-4 py-2 border border-input rounded-md bg-background">
          <option value="all">{t('roles.allModules')}</option>
          {modules.map(module => <option key={module} value={module}>{module.charAt(0).toUpperCase() + module.slice(1)}</option>)}
        </select>
      </div>
      <Card className="p-6">
        <ScrollArea className="h-[600px]">
          <div className="space-y-6">
            {modules.map(module => {
              const modulePermissions = filteredPermissions.filter(p => p.module === module)
              if (!modulePermissions.length) return null
              return (
                <div key={module} className="space-y-3">
                  <h3 className="font-semibold text-lg capitalize border-b pb-2">{module}</h3>
                  <div className="grid gap-3">
                    {modulePermissions.map(permission => (
                      <div key={permission.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{permission.id}</code>
                            <span className="font-medium">{permission.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
