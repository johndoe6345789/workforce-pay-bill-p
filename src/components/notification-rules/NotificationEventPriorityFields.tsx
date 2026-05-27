import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { NotificationRule, TriggerEvent } from '@/hooks/useNotificationRulesManager'
import type { NotificationPriority } from '@/lib/types'

const TRIGGER_EVENTS: TriggerEvent[] = [
  'timesheet-submitted', 'timesheet-approved', 'timesheet-rejected',
  'invoice-generated', 'invoice-overdue',
  'compliance-expiring', 'compliance-expired',
  'expense-submitted', 'payroll-completed',
]

interface Props {
  formData: Partial<NotificationRule>
  patch: (updates: Partial<NotificationRule>) => void
  t: (key: string) => string
}

export function NotificationEventPriorityFields({ formData, patch, t }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="trigger">{t('notificationRules.triggerEventLabel')}</Label>
        <Select value={formData.triggerEvent} onValueChange={v => patch({ triggerEvent: v as TriggerEvent })}>
          <SelectTrigger id="trigger"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TRIGGER_EVENTS.map(ev => (
              <SelectItem key={ev} value={ev}>{t(`notificationRules.events.${ev.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">{t('notificationRules.priorityLabel')}</Label>
        <Select value={formData.priority} onValueChange={v => patch({ priority: v as NotificationPriority })}>
          <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(['low', 'medium', 'high', 'urgent'] as NotificationPriority[]).map(p => (
              <SelectItem key={p} value={p}>{t(`notificationRules.priorities.${p}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
