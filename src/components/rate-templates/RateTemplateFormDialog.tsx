import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from '@phosphor-icons/react'
import type { RateTemplate } from '@/hooks/useRateTemplateManager'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  formData: Partial<RateTemplate>
  setFormData: (data: Partial<RateTemplate>) => void
  onSubmit: () => void
  onCancel: () => void
  t: (key: string) => string
}

export function RateTemplateFormDialog({ open, onOpenChange, isEditing, formData, setFormData, onSubmit, onCancel, t }: Props) {
  const patch = (updates: Partial<RateTemplate>) => setFormData({ ...formData, ...updates })
  const base = formData.standardRate || 0

  const rateFields: Array<{ id: keyof RateTemplate; label: string; helper: string; multiplier: number }> = [
    { id: 'overtimeRate', label: t('rateTemplates.overtimeRateLabel'), helper: t('rateTemplates.overtimeRateHelper'), multiplier: 1.5 },
    { id: 'weekendRate', label: t('rateTemplates.weekendRateLabel'), helper: t('rateTemplates.weekendRateHelper'), multiplier: 1.5 },
    { id: 'nightShiftRate', label: t('rateTemplates.nightShiftRateLabel'), helper: t('rateTemplates.nightShiftRateHelper'), multiplier: 1.25 },
    { id: 'holidayRate', label: t('rateTemplates.holidayRateLabel'), helper: t('rateTemplates.holidayRateHelper'), multiplier: 2 },
  ]

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onCancel(); else onOpenChange(true) }}>
      <DialogTrigger asChild>
        <Button><Plus size={18} className="mr-2" />{t('rateTemplates.createTemplate')}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('rateTemplates.editTemplate') : t('rateTemplates.createTemplate')}</DialogTitle>
          <DialogDescription>{t('rateTemplates.createDialog.description')}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="rt-name">{t('rateTemplates.templateNameLabel')}</Label>
            <Input id="rt-name" placeholder={t('rateTemplates.templateNamePlaceholder')} value={formData.name} onChange={e => patch({ name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rt-role">{t('rateTemplates.roleLabel')}</Label>
            <Input id="rt-role" placeholder={t('rateTemplates.rolePlaceholder')} value={formData.role} onChange={e => patch({ role: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rt-client">{t('rateTemplates.clientLabel')}</Label>
            <Input id="rt-client" placeholder={t('rateTemplates.clientPlaceholder')} value={formData.client} onChange={e => patch({ client: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rt-std">{t('rateTemplates.standardRateLabel')}</Label>
            <Input id="rt-std" type="number" step="0.01" placeholder={t('rateTemplates.standardRatePlaceholder')} value={formData.standardRate} onChange={e => patch({ standardRate: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rt-currency">{t('rateTemplates.currencyLabel')}</Label>
            <Select value={formData.currency} onValueChange={value => patch({ currency: value })}>
              <SelectTrigger id="rt-currency"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {rateFields.map(field => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={`rt-${field.id}`}>{field.label}</Label>
              <Input id={`rt-${field.id}`} type="number" step="0.01" placeholder={`${(base * field.multiplier).toFixed(2)}`} value={formData[field.id] as number} onChange={e => patch({ [field.id]: parseFloat(e.target.value) || 0 })} />
              <p className="text-xs text-muted-foreground">{field.helper}</p>
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="rt-from">{t('rateTemplates.effectiveFromLabel')}</Label>
            <Input id="rt-from" type="date" value={formData.effectiveFrom} onChange={e => patch({ effectiveFrom: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
          <Button onClick={onSubmit}>{isEditing ? t('common.save') : t('common.add')} {t('rateTemplates.templateName')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
