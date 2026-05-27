import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from '@phosphor-icons/react'
import type { NewCurrencyForm } from '@/hooks/useCurrencyManagement'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: NewCurrencyForm
  setForm: (data: NewCurrencyForm) => void
  onSubmit: () => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function AddCurrencyDialog({ open, onOpenChange, form, setForm, onSubmit, t }: Props) {
  const patch = (updates: Partial<NewCurrencyForm>) => setForm({ ...form, ...updates })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button><Plus size={18} className="mr-2" />{t('currency.addCurrency')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('currency.addNewCurrency')}</DialogTitle>
          <DialogDescription>{t('currency.addNewCurrencyDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cur-code">{t('currency.code')}</Label>
              <Input id="cur-code" placeholder={t('currency.currencyCodePlaceholder')} value={form.code} onChange={e => patch({ code: e.target.value.toUpperCase() })} maxLength={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cur-symbol">{t('currency.symbol')}</Label>
              <Input id="cur-symbol" placeholder={t('currency.symbolPlaceholder')} value={form.symbol} onChange={e => patch({ symbol: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cur-name">{t('currency.name')}</Label>
            <Input id="cur-name" placeholder={t('currency.namePlaceholder')} value={form.name} onChange={e => patch({ name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cur-rate">{t('currency.exchangeRateToGBP')}</Label>
            <Input id="cur-rate" type="number" step="0.0001" placeholder={t('currency.ratePlaceholder')} value={form.rateToGBP} onChange={e => patch({ rateToGBP: e.target.value })} />
            <p className="text-xs text-muted-foreground">{t('currency.rateHint', { code: form.code || 'XXX', rate: form.rateToGBP || '0' })}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
          <Button onClick={onSubmit}>{t('currency.addCurrency')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
