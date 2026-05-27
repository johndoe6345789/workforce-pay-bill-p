import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Key, MagnifyingGlass } from '@phosphor-icons/react'
import { RoleCard } from '@/components/roles/RoleCard'
import { RoleDetailDialog } from '@/components/roles/RoleDetailDialog'
import { RoleFormDialog } from '@/components/roles/RoleFormDialog'
import { PermissionsTabContent } from '@/components/roles/PermissionsTabContent'
import { useRolesPermissionsView } from '@/hooks/useRolesPermissionsView'

export function RolesPermissionsView() {
  const vm = useRolesPermissionsView()

  return (
    <div className="space-y-6">
      <PageHeader
        title={vm.t('roles.title')}
        description={vm.t('roles.subtitle')}
        actions={vm.canManageRoles ? (
          <Button onClick={() => vm.setIsCreateDialogOpen(true)}>
            <Plus className="mr-2" />{vm.t('roles.createRole')}
          </Button>
        ) : undefined}
      />

      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles"><Users className="mr-2" />{vm.t('roles.rolesTab')}</TabsTrigger>
          <TabsTrigger value="permissions"><Key className="mr-2" />{vm.t('roles.permissionsTab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input placeholder={vm.t('roles.searchRoles')} value={vm.searchQuery} onChange={e => vm.setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vm.filteredRoles.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                canManageRoles={vm.canManageRoles}
                onView={vm.setSelectedRole}
                onEdit={r => { vm.setSelectedRole(r); vm.setIsEditDialogOpen(true) }}
                onDuplicate={r => { vm.setSelectedRole(r); vm.setIsCreateDialogOpen(true) }}
                t={vm.t}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTabContent
            filteredPermissions={vm.filteredPermissions}
            modules={vm.modules}
            searchQuery={vm.searchQuery}
            setSearchQuery={vm.setSearchQuery}
            filterModule={vm.filterModule}
            setFilterModule={vm.setFilterModule}
            t={vm.t}
          />
        </TabsContent>
      </Tabs>

      <RoleDetailDialog
        role={vm.selectedRole}
        open={!!vm.selectedRole && !vm.isEditDialogOpen}
        onOpenChange={open => { if (!open) vm.setSelectedRole(null) }}
        canManageRoles={vm.canManageRoles}
        modules={vm.modules}
        permissions={vm.permissions}
        currentUserRoleId={vm.currentUser?.roleId}
        onEdit={() => vm.setIsEditDialogOpen(true)}
        t={vm.t}
      />

      <RoleFormDialog role={vm.selectedRole} open={vm.isCreateDialogOpen} onOpenChange={vm.setIsCreateDialogOpen} onSave={() => { vm.setIsCreateDialogOpen(false); vm.setSelectedRole(null) }} />
      <RoleFormDialog role={vm.selectedRole} open={vm.isEditDialogOpen} onOpenChange={vm.setIsEditDialogOpen} onSave={() => { vm.setIsEditDialogOpen(false); vm.setSelectedRole(null) }} />
    </div>
  )
}
