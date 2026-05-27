import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from '@phosphor-icons/react'
import { calculateDaysBetweenDates, type HolidayFormData } from '@/hooks/useHolidayPayManager'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: HolidayFormData
  setFormData: (data: HolidayFormData) => void
  onSubmit: () => void
  t: (key: string) => string
}

export function HolidayRequestDialog({ open, onOpenChange, formData, setFormData, onSubmit, t }: Props) {
  const patch = (updates: Partial<HolidayFormData>) => setFormData({ ...formData, ...updates })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button><Plus size={18} className="mr-2" />{t('holidayPay.newHolidayRequest')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('holidayPay.createDialog.title')}</DialogTitle>
          <DialogDescription>{t('holidayPay.createDialog.description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="req-worker">{t('holidayPay.workerNameLabel')}</Label>
            <Input id="req-worker" placeholder={t('holidayPay.workerNamePlaceholder')} value={formData.workerName} onChange={e => patch({ workerName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="req-start">{t('holidayPay.startDateLabel')}</Label>
              <Input id="req-start" type="date" value={formData.startDate} onChange={e => patch({ startDate: e.target.value, days: calculateDaysBetweenDates(e.target.value, formData.endDate) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-end">{t('holidayPay.endDateLabel')}</Label>
              <Input id="req-end" type="date" value={formData.endDate} onChange={e => patch({ endDate: e.target.value, days: calculateDaysBetweenDates(formData.startDate, e.target.value) })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="req-days">{t('holidayPay.daysRequestedLabel')}</Label>
            <Input id="req-days" type="number" value={formData.days} onChange={e => patch({ days: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
          <Button onClick={onSubmit}>{t('holidayPay.submitRequest')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
