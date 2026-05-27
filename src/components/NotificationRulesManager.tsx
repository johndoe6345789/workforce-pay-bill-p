import { Bell } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NotificationRuleCard } from '@/components/notification-rules/NotificationRuleCard'
import { NotificationRuleFormDialog } from '@/components/notification-rules/NotificationRuleFormDialog'
import { useNotificationRulesManager } from '@/hooks/useNotificationRulesManager'

export function NotificationRulesManager() {
  const vm = useNotificationRulesManager()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('notificationRules.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('notificationRules.subtitle')}</p>
        </div>
        <NotificationRuleFormDialog
          open={vm.isCreateOpen || !!vm.editingRule}
          isEditing={!!vm.editingRule}
          formData={vm.formData}
          setFormData={vm.setFormData}
          onSubmit={vm.editingRule ? vm.handleUpdate : vm.handleCreate}
          onCancel={vm.closeDialog}
          onOpenCreate={() => vm.setIsCreateOpen(true)}
          t={vm.t}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('notificationRules.totalRules')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.rules.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('notificationRules.activeRules')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold text-success">{vm.activeCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('notificationRules.inactiveRules')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold text-muted-foreground">{vm.rules.length - vm.activeCount}</div></CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {!vm.rules.length ? (
          <Card className="p-12 text-center">
            <CardContent>
              <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{vm.t('notificationRules.noRules')}</h3>
              <p className="text-muted-foreground">{vm.t('notificationRules.noRulesDescription')}</p>
            </CardContent>
          </Card>
        ) : vm.rules.map(rule => (
          <NotificationRuleCard
            key={rule.id}
            rule={rule}
            onToggle={vm.handleToggle}
            onEdit={vm.startEdit}
            onDelete={vm.handleDelete}
            t={vm.t}
          />
        ))}
      </div>
    </div>
  )
}
