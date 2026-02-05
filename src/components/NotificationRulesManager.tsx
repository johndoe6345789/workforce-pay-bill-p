import { useState } from 'react'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { useTranslation } from '@/hooks/use-translation'
import { Bell, Plus, Pencil, Trash, ToggleLeft, ToggleRight } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { NotificationType, NotificationPriority } from '@/lib/types'

type NotificationChannel = 'in-app' | 'email' | 'both'
type TriggerEvent = 'timesheet-submitted' | 'timesheet-approved' | 'timesheet-rejected' | 
                    'invoice-generated' | 'invoice-overdue' | 'compliance-expiring' | 
                    'compliance-expired' | 'expense-submitted' | 'payroll-completed'

export interface NotificationRule {
  id: string
  name: string
  description?: string
  enabled: boolean
  triggerEvent: TriggerEvent
  notificationType: NotificationType
  priority: NotificationPriority
  channel: NotificationChannel
  recipients: string[]
  conditions?: {
    field: string
    operator: 'equals' | 'greater-than' | 'less-than' | 'contains'
    value: string
  }[]
  messageTemplate: string
  delayMinutes?: number
}

export function NotificationRulesManager() {
  const { t } = useTranslation()
  const [rules = [], setRules] = useIndexedDBState<NotificationRule[]>('notification-rules', [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null)
  const [formData, setFormData] = useState<Partial<NotificationRule>>({
    name: '',
    description: '',
    enabled: true,
    triggerEvent: 'timesheet-submitted',
    notificationType: 'timesheet',
    priority: 'medium',
    channel: 'both',
    recipients: [],
    messageTemplate: '',
    delayMinutes: 0
  })

  const handleCreate = () => {
    if (!formData.name || !formData.messageTemplate) {
      toast.error(t('notificationRules.fillAllFields'))
      return
    }

    const newRule: NotificationRule = {
      id: `NR-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      enabled: formData.enabled ?? true,
      triggerEvent: formData.triggerEvent!,
      notificationType: formData.notificationType!,
      priority: formData.priority!,
      channel: formData.channel!,
      recipients: formData.recipients || [],
      messageTemplate: formData.messageTemplate,
      delayMinutes: formData.delayMinutes
    }

    setRules(current => [...(current || []), newRule])
    toast.success(t('notificationRules.ruleCreated'))
    resetForm()
    setIsCreateOpen(false)
  }

  const handleUpdate = () => {
    if (!editingRule) return

    setRules(current => {
      if (!current) return []
      return current.map(rule => 
        rule.id === editingRule.id 
          ? { ...editingRule, ...formData }
          : rule
      )
    })
    toast.success(t('notificationRules.ruleUpdated'))
    setEditingRule(null)
    resetForm()
  }

  const handleToggle = (ruleId: string) => {
    setRules(current => {
      if (!current) return []
      return current.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    })
  }

  const handleDelete = (ruleId: string) => {
    setRules(current => {
      if (!current) return []
      return current.filter(rule => rule.id !== ruleId)
    })
    toast.success(t('notificationRules.ruleDeleted'))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      enabled: true,
      triggerEvent: 'timesheet-submitted',
      notificationType: 'timesheet',
      priority: 'medium',
      channel: 'both',
      recipients: [],
      messageTemplate: '',
      delayMinutes: 0
    })
  }

  const startEdit = (rule: NotificationRule) => {
    setEditingRule(rule)
    setFormData(rule)
  }

  const activeRules = rules.filter(r => r.enabled)
  const inactiveRules = rules.filter(r => !r.enabled)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('notificationRules.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('notificationRules.subtitle')}</p>
        </div>
        <Dialog open={isCreateOpen || !!editingRule} onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditingRule(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus size={18} className="mr-2" />
              {t('notificationRules.createRule')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRule ? t('notificationRules.createDialog.editTitle') : t('notificationRules.createDialog.title')}</DialogTitle>
              <DialogDescription>
                {t('notificationRules.createDialog.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name *</Label>
                <Input
                  id="rule-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Timesheet Approval Notification"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rule-desc">Description</Label>
                <Textarea
                  id="rule-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Notify managers when a new timesheet is submitted"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger-event">Trigger Event *</Label>
                  <Select 
                    value={formData.triggerEvent} 
                    onValueChange={(v: TriggerEvent) => setFormData({ ...formData, triggerEvent: v })}
                  >
                    <SelectTrigger id="trigger-event">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timesheet-submitted">Timesheet Submitted</SelectItem>
                      <SelectItem value="timesheet-approved">Timesheet Approved</SelectItem>
                      <SelectItem value="timesheet-rejected">Timesheet Rejected</SelectItem>
                      <SelectItem value="invoice-generated">Invoice Generated</SelectItem>
                      <SelectItem value="invoice-overdue">Invoice Overdue</SelectItem>
                      <SelectItem value="compliance-expiring">Compliance Expiring</SelectItem>
                      <SelectItem value="compliance-expired">Compliance Expired</SelectItem>
                      <SelectItem value="expense-submitted">Expense Submitted</SelectItem>
                      <SelectItem value="payroll-completed">Payroll Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(v: NotificationPriority) => setFormData({ ...formData, priority: v })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="channel">Channel *</Label>
                  <Select 
                    value={formData.channel} 
                    onValueChange={(v: NotificationChannel) => setFormData({ ...formData, channel: v })}
                  >
                    <SelectTrigger id="channel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-app">In-App Only</SelectItem>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="both">In-App & Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delay">Delay (minutes)</Label>
                  <Input
                    id="delay"
                    type="number"
                    min="0"
                    value={formData.delayMinutes}
                    onChange={(e) => setFormData({ ...formData, delayMinutes: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message-template">Message Template *</Label>
                <Textarea
                  id="message-template"
                  value={formData.messageTemplate}
                  onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
                  placeholder="New timesheet submitted by {workerName} for {clientName}"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Use placeholders like {'{workerName}'}, {'{clientName}'}, {'{amount}'}, etc.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="rule-enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
                <Label htmlFor="rule-enabled">Enable this rule</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsCreateOpen(false)
                setEditingRule(null)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button onClick={editingRule ? handleUpdate : handleCreate}>
                {editingRule ? 'Update' : 'Create'} Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{rules.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-success">{activeRules.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Inactive Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-muted-foreground">{inactiveRules.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {rules.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notification rules</h3>
            <p className="text-muted-foreground">Create your first rule to automate notifications</p>
          </Card>
        ) : (
          rules.map(rule => (
            <Card key={rule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle(rule.id)}
                        className="p-0 h-auto"
                      >
                        {rule.enabled ? (
                          <ToggleRight size={32} className="text-success" weight="fill" />
                        ) : (
                          <ToggleLeft size={32} className="text-muted-foreground" weight="fill" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{rule.name}</h3>
                          <Badge variant={rule.enabled ? 'success' : 'secondary'}>
                            {rule.enabled ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {rule.priority}
                          </Badge>
                        </div>
                        {rule.description && (
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Trigger</p>
                        <p className="font-medium capitalize">{rule.triggerEvent.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Channel</p>
                        <p className="font-medium capitalize">{rule.channel.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delay</p>
                        <p className="font-medium">{rule.delayMinutes || 0} min</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Recipients</p>
                        <p className="font-medium">{rule.recipients.length || 'All'}</p>
                      </div>
                    </div>

                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View message template
                      </summary>
                      <p className="mt-2 p-3 bg-muted rounded-lg font-mono text-xs">
                        {rule.messageTemplate}
                      </p>
                    </details>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => startEdit(rule)}>
                      <Pencil size={16} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(rule.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
