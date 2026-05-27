import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from '@phosphor-icons/react'
import { extractVariables } from '@/hooks/useEmailTemplateManager'
import type { EmailFormData } from '@/hooks/useEmailTemplateManager'
import type { NotificationType } from '@/lib/types'

interface Props {
  mode: 'create' | 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: EmailFormData
  setFormData: (data: EmailFormData) => void
  onSubmit: () => void
  onCancel: () => void
  t: (key: string) => string
}

const TYPE_OPTIONS: { value: NotificationType; label: string }[] = [
  { value: 'timesheet', label: 'Timesheet' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'expense', label: 'Expense' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'system', label: 'System' },
]

export function EmailTemplateFormDialog({ mode, open, onOpenChange, formData, setFormData, onSubmit, onCancel, t }: Props) {
  const patch = (updates: Partial<EmailFormData>) => setFormData({ ...formData, ...updates })
  const isCreate = mode === 'create'
  const detectedVars = extractVariables(formData.subject + ' ' + formData.body)

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onCancel(); else onOpenChange(true) }}>
      {isCreate && (
        <DialogTrigger asChild>
          <Button><Plus size={18} className="mr-2" />{t('emailTemplates.createTemplate')}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? t('emailTemplates.createTemplate') : 'Edit Email Template'}</DialogTitle>
          <DialogDescription>{isCreate ? t('emailTemplates.subtitle') : 'Update the email notification template'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tmpl-name">{t('emailTemplates.templateName')}</Label>
            <Input id="tmpl-name" placeholder={isCreate ? t('emailTemplates.templateNamePlaceholder') : undefined} value={formData.name} onChange={e => patch({ name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmpl-type">{t('emailTemplates.templateType')}</Label>
            <Select value={formData.type} onValueChange={value => patch({ type: value as NotificationType })}>
              <SelectTrigger id="tmpl-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmpl-subject">Email Subject</Label>
            <Input id="tmpl-subject" placeholder={isCreate ? 'Use {{variableName}} for dynamic content' : undefined} value={formData.subject} onChange={e => patch({ subject: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmpl-body">Email Body</Label>
            <Textarea id="tmpl-body" placeholder={isCreate ? 'Use {{variableName}} for dynamic content' : undefined} value={formData.body} onChange={e => patch({ body: e.target.value })} rows={8} />
            <p className="text-xs text-muted-foreground">Detected variables: {detectedVars.join(', ') || 'None'}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!formData.name || !formData.subject || !formData.body}>
            {isCreate ? 'Create Template' : 'Update Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
