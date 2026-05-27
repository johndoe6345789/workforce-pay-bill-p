import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from '@phosphor-icons/react'
import type { InvoiceFormData } from '@/hooks/useInvoiceTemplateManager'

interface Props {
  mode: 'create' | 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: InvoiceFormData
  setFormData: (data: InvoiceFormData) => void
  onSubmit: () => void
  onCancel: () => void
  t: (key: string) => string
}

export function InvoiceTemplateFormDialog({ mode, open, onOpenChange, formData, setFormData, onSubmit, onCancel, t }: Props) {
  const patch = (updates: Partial<InvoiceFormData>) => setFormData({ ...formData, ...updates })
  const isCreate = mode === 'create'

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onCancel(); else onOpenChange(true) }}>
      {isCreate && (
        <DialogTrigger asChild>
          <Button><Plus size={18} className="mr-2" />{t('invoiceTemplates.createTemplate')}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? t('invoiceTemplates.createTemplate') : 'Edit Invoice Template'}</DialogTitle>
          <DialogDescription>{isCreate ? t('invoiceTemplates.subtitle') : 'Update the invoice template design'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tmpl-name">{t('invoiceTemplates.templateName')}</Label>
            <Input id="tmpl-name" placeholder={isCreate ? t('invoiceTemplates.templateNamePlaceholder') : undefined} value={formData.name} onChange={e => patch({ name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmpl-header">{t('invoiceTemplates.headerText')}</Label>
            <Input id="tmpl-header" placeholder={isCreate ? t('invoiceTemplates.headerTextPlaceholder') : undefined} value={formData.headerText} onChange={e => patch({ headerText: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmpl-footer">{t('invoiceTemplates.footerText')}</Label>
            <Textarea id="tmpl-footer" placeholder={isCreate ? t('invoiceTemplates.footerTextPlaceholder') : undefined} value={formData.footerText} onChange={e => patch({ footerText: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmpl-terms">Default Payment Terms</Label>
            <Input id="tmpl-terms" placeholder="e.g., Net 30" value={formData.defaultPaymentTerms} onChange={e => patch({ defaultPaymentTerms: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmpl-color">Accent Color</Label>
            <div className="flex gap-2">
              <Input id="tmpl-color" type="color" value={formData.accentColor} onChange={e => patch({ accentColor: e.target.value })} className="w-20 h-10" />
              <Input value={formData.accentColor} onChange={e => patch({ accentColor: e.target.value })} placeholder="#3b82f6" className="flex-1" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!formData.name}>{isCreate ? 'Create Template' : 'Update Template'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
