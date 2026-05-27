import { useState } from 'react'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import type { NotificationType, NotificationPriority } from '@/lib/types'

export type NotificationChannel = 'in-app' | 'email' | 'both'
export type TriggerEvent =
  | 'timesheet-submitted' | 'timesheet-approved' | 'timesheet-rejected'
  | 'invoice-generated' | 'invoice-overdue' | 'compliance-expiring'
  | 'compliance-expired' | 'expense-submitted' | 'payroll-completed'

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
  conditions?: { field: string; operator: 'equals' | 'greater-than' | 'less-than' | 'contains'; value: string }[]
  messageTemplate: string
  delayMinutes?: number
}

export const DEFAULT_FORM: Partial<NotificationRule> = {
  name: '', description: '', enabled: true,
  triggerEvent: 'timesheet-submitted', notificationType: 'timesheet',
  priority: 'medium', channel: 'both', recipients: [],
  messageTemplate: '', delayMinutes: 0
}

export function useNotificationRulesManager() {
  const { t } = useTranslation()
  const [rules = [], setRules] = useIndexedDBState<NotificationRule[]>('notification-rules', [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null)
  const [formData, setFormData] = useState<Partial<NotificationRule>>(DEFAULT_FORM)

  const resetForm = () => setFormData(DEFAULT_FORM)

  const closeDialog = () => { setIsCreateOpen(false); setEditingRule(null); resetForm() }

  const handleCreate = () => {
    if (!formData.name || !formData.messageTemplate) { toast.error(t('notificationRules.fillAllFields')); return }
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
    closeDialog()
  }

  const handleUpdate = () => {
    if (!editingRule) return
    setRules(current => (current || []).map(r => r.id === editingRule.id ? { ...editingRule, ...formData } : r))
    toast.success(t('notificationRules.ruleUpdated'))
    closeDialog()
  }

  const handleToggle = (ruleId: string) => {
    setRules(current => (current || []).map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
  }

  const handleDelete = (ruleId: string) => {
    setRules(current => (current || []).filter(r => r.id !== ruleId))
    toast.success(t('notificationRules.ruleDeleted'))
  }

  const startEdit = (rule: NotificationRule) => { setEditingRule(rule); setFormData(rule) }

  const activeCount = rules.filter(r => r.enabled).length

  return {
    t, rules, activeCount,
    isCreateOpen, setIsCreateOpen,
    editingRule, formData, setFormData,
    resetForm, closeDialog,
    handleCreate, handleUpdate, handleToggle, handleDelete, startEdit,
  }
}
