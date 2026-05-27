import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus } from '@phosphor-icons/react'
import { DAYS_OF_WEEK, SHIFT_TYPES, calculateHours } from '@/data/shiftPatternConfig'
import type { ShiftPatternTemplate, ShiftType, DayOfWeek } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPattern: ShiftPatternTemplate | null
  formData: Partial<ShiftPatternTemplate>
  setFormData: (data: Partial<ShiftPatternTemplate>) => void
  toggleDayOfWeek: (day: DayOfWeek) => void
  onSave: () => void
  onCancel: () => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ShiftPatternDialog({ open, onOpenChange, editingPattern, formData, setFormData, toggleDayOfWeek, onSave, onCancel, t }: Props) {
  const patch = (updates: Partial<ShiftPatternTemplate>) => setFormData({ ...formData, ...updates })

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onCancel(); else onOpenChange(true) }}>
      <DialogTrigger asChild>
        <Button><Plus size={18} className="mr-2" />{t('shiftPatterns.createTemplate')}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPattern ? t('shiftPatterns.createDialog.editTitle') : t('shiftPatterns.createDialog.title')}</DialogTitle>
          <DialogDescription>{t('shiftPatterns.createDialog.description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pattern-name">{t('shiftPatterns.patternNameLabel')}</Label>
            <Input id="pattern-name" placeholder={t('shiftPatterns.patternNamePlaceholder')} value={formData.name} onChange={e => patch({ name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pattern-description">{t('shiftPatterns.descriptionLabel')}</Label>
            <Textarea id="pattern-description" placeholder={t('shiftPatterns.descriptionPlaceholder')} value={formData.description} onChange={e => patch({ description: e.target.value })} rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shift-type">{t('shiftPatterns.shiftTypeLabel')}</Label>
            <Select value={formData.shiftType} onValueChange={value => patch({ shiftType: value as ShiftType })}>
              <SelectTrigger id="shift-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SHIFT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{t(`shiftPatterns.shiftTypes.${type.value}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">{t('shiftPatterns.startTimeLabel')}</Label>
              <Input id="start-time" type="time" value={formData.defaultStartTime} onChange={e => patch({ defaultStartTime: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">{t('shiftPatterns.endTimeLabel')}</Label>
              <Input id="end-time" type="time" value={formData.defaultEndTime} onChange={e => patch({ defaultEndTime: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break-minutes">{t('shiftPatterns.breakMinutesLabel')}</Label>
              <Input id="break-minutes" type="number" min="0" step="15" value={formData.defaultBreakMinutes} onChange={e => patch({ defaultBreakMinutes: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate-multiplier">{t('shiftPatterns.rateMultiplierLabel')}</Label>
            <Input id="rate-multiplier" type="number" min="1.0" step="0.1" value={formData.rateMultiplier} onChange={e => patch({ rateMultiplier: parseFloat(e.target.value) || 1.0 })} />
            <p className="text-xs text-muted-foreground">{t('shiftPatterns.rateMultiplierHelper', { multiplier: formData.rateMultiplier || 1.0, rate: ((formData.rateMultiplier || 1.0) * 25).toFixed(2) })}</p>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label>{t('shiftPatterns.daysOfWeekLabel')}</Label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS_OF_WEEK.map(day => (
                <Button key={day} type="button" variant={formData.daysOfWeek?.includes(day) ? 'default' : 'outline'} size="sm" onClick={() => toggleDayOfWeek(day)} className="w-full">
                  {t(`shiftPatterns.daysOfWeekShort.${day}`)}
                </Button>
              ))}
            </div>
          </div>
          {formData.defaultStartTime && formData.defaultEndTime && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">{t('shiftPatterns.patternSummary')}</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{t('shiftPatterns.hoursPerShift')}: {calculateHours(formData.defaultStartTime, formData.defaultEndTime, formData.defaultBreakMinutes || 0).toFixed(2)}h</p>
                <p>{t('shiftPatterns.daysPerWeek')}: {formData.daysOfWeek?.length || 0}</p>
                <p>{t('shiftPatterns.totalWeeklyHours')}: {(calculateHours(formData.defaultStartTime, formData.defaultEndTime, formData.defaultBreakMinutes || 0) * (formData.daysOfWeek?.length || 0)).toFixed(2)}h</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
          <Button onClick={onSave}>{editingPattern ? t('common.edit') : t('common.save')} {t('shiftPatterns.createTemplate')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
