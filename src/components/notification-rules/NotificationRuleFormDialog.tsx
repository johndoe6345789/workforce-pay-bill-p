import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from '@phosphor-icons/react'
import type { NotificationRule, NotificationChannel } from '@/hooks/useNotificationRulesManager'
import { NotificationEventPriorityFields } from '@/components/notification-rules/NotificationEventPriorityFields'

interface Props {
  open: boolean
  isEditing: boolean
  formData: Partial<NotificationRule>
  setFormData: (data: Partial<NotificationRule>) => void
  onSubmit: () => void
  onCancel: () => void
  onOpenCreate: () => void
  t: (key: string) => string
}

export function NotificationRuleFormDialog({ open, isEditing, formData, setFormData, onSubmit, onCancel, onOpenCreate, t }: Props) {
  const patch = (updates: Partial<NotificationRule>) => setFormData({ ...formData, ...updates })

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onCancel() }}>
      <DialogTrigger asChild>
        <Button onClick={onOpenCreate}><Plus size={18} className="mr-2" />{t('notificationRules.createRule')}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('notificationRules.createDialog.editTitle') : t('notificationRules.createDialog.title')}</DialogTitle>
          <DialogDescription>{t('notificationRules.createDialog.description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
          <div className="space-y-2">
            <Label htmlFor="rule-name">{t('notificationRules.ruleNameLabel')}</Label>
            <Input id="rule-name" value={formData.name} onChange={e => patch({ name: e.target.value })} placeholder={t('notificationRules.ruleNamePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rule-desc">{t('notificationRules.descriptionLabel')}</Label>
            <Textarea id="rule-desc" value={formData.description} onChange={e => patch({ description: e.target.value })} placeholder={t('notificationRules.descriptionPlaceholder')} rows={2} />
          </div>
          <NotificationEventPriorityFields formData={formData} patch={patch} t={t} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="channel">{t('notificationRules.channelLabel')}</Label>
              <Select value={formData.channel} onValueChange={v => patch({ channel: v as NotificationChannel })}>
                <SelectTrigger id="channel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-app">{t('notificationRules.channels.inAppOnly')}</SelectItem>
                  <SelectItem value="email">{t('notificationRules.channels.emailOnly')}</SelectItem>
                  <SelectItem value="both">{t('notificationRules.channels.inAppAndEmail')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delay">{t('notificationRules.delayLabel')}</Label>
              <Input id="delay" type="number" min="0" value={formData.delayMinutes} onChange={e => patch({ delayMinutes: parseInt(e.target.value) || 0 })} placeholder={t('notificationRules.delayPlaceholder')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg-tmpl">{t('notificationRules.messageTemplateLabel')}</Label>
            <Textarea id="msg-tmpl" value={formData.messageTemplate} onChange={e => patch({ messageTemplate: e.target.value })} placeholder={t('notificationRules.messageTemplatePlaceholder')} rows={3} />
            <p className="text-xs text-muted-foreground">{t('notificationRules.messageTemplateHelper')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="rule-enabled" checked={formData.enabled} onCheckedChange={checked => patch({ enabled: checked })} />
            <Label htmlFor="rule-enabled">{t('notificationRules.enableThisRule')}</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
          <Button onClick={onSubmit}>{isEditing ? t('common.edit') : t('common.add')} {t('notificationRules.ruleName')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
