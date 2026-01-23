import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { usePermissions, Role, Permission } from '@/hooks/use-permissions'
import { Plus, Shield, Users, Key, MagnifyingGlass, Pencil, Copy } from '@phosphor-icons/react'
import { Grid } from '@/components/ui/grid'
import { useAppSelector } from '@/store/hooks'

interface RoleWithUsers extends Role {
  userCount?: number
}

export function RolesPermissionsView() {
  const { roles, permissions, hasPermission } = usePermissions()
  const currentUser = useAppSelector(state => state.auth.user)
  
  const [selectedRole, setSelectedRole] = useState<RoleWithUsers | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterModule, setFilterModule] = useState<string>('all')

  const canManageRoles = hasPermission('settings.edit') || hasPermission('users.edit')
  
  const rolesWithUsers: RoleWithUsers[] = roles.map(role => ({
    ...role,
    userCount: Math.floor(Math.random() * 50)
  }))

  const filteredRoles = rolesWithUsers.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const modules = Array.from(new Set(permissions.map(p => p.module)))

  const filteredPermissions = filterModule === 'all' 
    ? permissions 
    : permissions.filter(p => p.module === filterModule)

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent text-accent-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      info: 'bg-info text-info-foreground',
      muted: 'bg-muted text-muted-foreground',
    }
    return colorMap[color] || colorMap.muted
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles and access permissions across the platform"
        actions={
          canManageRoles ? (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2" />
              Create Role
            </Button>
          ) : undefined
        }
      />

      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles">
            <Users className="mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Key className="mr-2" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{role.name}</h3>
                      <Badge className={getColorClass(role.color)}>
                        {role.id}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={16} />
                  <span>{role.userCount} users</span>
                  <span className="mx-2">•</span>
                  <Key size={16} />
                  <span>{role.permissions.length} permissions</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedRole(role)}
                  >
                    View Details
                  </Button>
                  {canManageRoles && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role)
                          setIsCreateDialogOpen(true)
                        }}
                      >
                        <Copy size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Modules</option>
              {modules.map(module => (
                <option key={module} value={module}>
                  {module.charAt(0).toUpperCase() + module.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <Card className="p-6">
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                {modules.map(module => {
                  const modulePermissions = filteredPermissions.filter(p => p.module === module)
                  if (modulePermissions.length === 0) return null

                  return (
                    <div key={module} className="space-y-3">
                      <h3 className="font-semibold text-lg capitalize border-b pb-2">
                        {module}
                      </h3>
                      <div className="grid gap-3">
                        {modulePermissions.map(permission => (
                          <div
                            key={permission.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                  {permission.id}
                                </code>
                                <span className="font-medium">{permission.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {permission.description}
                              </p>
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
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRole && !isEditDialogOpen} onOpenChange={(open) => !open && setSelectedRole(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge className={getColorClass(selectedRole?.color || 'muted')}>
                {selectedRole?.name}
              </Badge>
            </DialogTitle>
            <DialogDescription>{selectedRole?.description}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{selectedRole?.userCount} users assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Key size={16} />
                  <span>{selectedRole?.permissions.length} permissions</span>
                </div>
              </div>

              {currentUser?.roleId === selectedRole?.id && (
                <Alert>
                  <AlertDescription>
                    This is your current role
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold">Assigned Permissions</h4>
                {selectedRole?.permissions.includes('*') ? (
                  <Alert>
                    <AlertDescription className="font-semibold">
                      ✓ Full System Access (All Permissions)
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    {modules.map(module => {
                      const modulePerms = selectedRole?.permissions.filter(p => 
                        p.startsWith(module + '.')
                      ) || []
                      if (modulePerms.length === 0) return null

                      return (
                        <div key={module} className="space-y-2">
                          <h5 className="font-medium text-sm capitalize text-muted-foreground">
                            {module}
                          </h5>
                          <div className="grid gap-2 pl-4">
                            {modulePerms.map(perm => {
                              const permData = permissions.find(p => p.id === perm)
                              return (
                                <div key={perm} className="flex items-start gap-2 text-sm">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {perm}
                                  </Badge>
                                  <span className="text-muted-foreground">
                                    {permData?.name}
                                  </span>
                                </div>
                              )
                            })}
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
            <Button variant="outline" onClick={() => setSelectedRole(null)}>
              Close
            </Button>
            {canManageRoles && (
              <Button onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="mr-2" />
                Edit Role
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RoleFormDialog
        role={selectedRole}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={() => {
          setIsCreateDialogOpen(false)
          setSelectedRole(null)
        }}
      />

      <RoleFormDialog
        role={selectedRole}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={() => {
          setIsEditDialogOpen(false)
          setSelectedRole(null)
        }}
      />
    </div>
  )
}

interface RoleFormDialogProps {
  role: RoleWithUsers | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

function RoleFormDialog({ role, open, onOpenChange, onSave }: RoleFormDialogProps) {
  const { permissions: allPermissions } = usePermissions()
  const modules = Array.from(new Set(allPermissions.map(p => p.module)))
  
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    color: role?.color || 'muted',
    permissions: role?.permissions || []
  })

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const toggleModule = (module: string) => {
    const modulePerms = allPermissions
      .filter(p => p.module === module)
      .map(p => p.id)
    
    const allSelected = modulePerms.every(p => formData.permissions.includes(p))
    
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !modulePerms.includes(p))
        : [...new Set([...prev.permissions, ...modulePerms])]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          <DialogDescription>
            Define role details and assign permissions
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Finance Manager"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this role"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="accent">Accent</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                  <option value="muted">Muted</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Permissions</h4>
              {modules.map(module => {
                const modulePerms = allPermissions.filter(p => p.module === module)
                const selectedCount = modulePerms.filter(p => 
                  formData.permissions.includes(p.id)
                ).length

                return (
                  <div key={module} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedCount === modulePerms.length}
                          onCheckedChange={() => toggleModule(module)}
                        />
                        <label className="font-medium capitalize cursor-pointer">
                          {module}
                        </label>
                      </div>
                      <Badge variant="outline">
                        {selectedCount} / {modulePerms.length}
                      </Badge>
                    </div>
                    <div className="grid gap-2 pl-6">
                      {modulePerms.map(permission => (
                        <div key={permission.id} className="flex items-start gap-2">
                          <Checkbox
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono">{permission.id}</code>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {role ? 'Save Changes' : 'Create Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
