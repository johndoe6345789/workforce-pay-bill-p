import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash, ToggleLeft, ToggleRight } from '@phosphor-icons/react'
import type { NotificationRule } from '@/hooks/useNotificationRulesManager'

interface Props {
  rule: NotificationRule
  onToggle: (id: string) => void
  onEdit: (rule: NotificationRule) => void
  onDelete: (id: string) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function NotificationRuleCard({ rule, onToggle, onEdit, onDelete, t }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => onToggle(rule.id)} className="p-0 h-auto">
                {rule.enabled
                  ? <ToggleRight size={32} className="text-success" weight="fill" />
                  : <ToggleLeft size={32} className="text-muted-foreground" weight="fill" />
                }
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{rule.name}</h3>
                  <Badge variant={rule.enabled ? 'success' : 'secondary'}>{rule.enabled ? t('statuses.active') : t('statuses.inactive')}</Badge>
                  <Badge variant="outline" className="capitalize">{t(`notificationRules.priorities.${rule.priority}`)}</Badge>
                </div>
                {rule.description && <p className="text-sm text-muted-foreground">{rule.description}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-muted-foreground">{t('notificationRules.trigger')}</p><p className="font-medium capitalize">{rule.triggerEvent.replace('-', ' ')}</p></div>
              <div><p className="text-muted-foreground">{t('notificationRules.channel')}</p><p className="font-medium capitalize">{rule.channel.replace('-', ' ')}</p></div>
              <div><p className="text-muted-foreground">{t('notificationRules.delay')}</p><p className="font-medium">{t('notificationRules.minLabel', { value: rule.delayMinutes || 0 })}</p></div>
              <div>
                <p className="text-muted-foreground">{t('notificationRules.recipients')}</p>
                <p className="font-medium">{rule.recipients.length ? t('notificationRules.recipientCount', { count: rule.recipients.length }) : t('notificationRules.allRecipients')}</p>
              </div>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">{t('notificationRules.viewMessageTemplate')}</summary>
              <p className="mt-2 p-3 bg-muted rounded-lg font-mono text-xs">{rule.messageTemplate}</p>
            </details>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={() => onEdit(rule)}><Pencil size={16} /></Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(rule.id)}><Trash size={16} /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
