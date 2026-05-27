import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { Plus } from '@phosphor-icons/react'

interface FormData {
  workerName: string; clientName: string; date: string; category: string
  description: string; amount: string; billable: boolean
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: FormData
  setFormData: (data: FormData) => void
  onSubmit: () => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ExpenseCreateDialog({ open, onOpenChange, formData, setFormData, onSubmit, t }: Props) {
  const patch = (updates: Partial<FormData>) => setFormData({ ...formData, ...updates })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button><Plus size={18} className="mr-2" />{t('expenses.createExpense')}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('expenses.createDialog.title')}</DialogTitle>
          <DialogDescription>{t('expenses.createDialog.description')}</DialogDescription>
        </DialogHeader>
        <Grid cols={2} gap={4} className="py-4">
          <div className="space-y-2">
            <Label htmlFor="exp-worker">{t('expenses.createDialog.workerNameLabel')}</Label>
            <Input id="exp-worker" placeholder={t('expenses.createDialog.workerNamePlaceholder')} value={formData.workerName} onChange={e => patch({ workerName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-client">{t('expenses.createDialog.clientNameLabel')}</Label>
            <Input id="exp-client" placeholder={t('expenses.createDialog.clientNamePlaceholder')} value={formData.clientName} onChange={e => patch({ clientName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-date">{t('expenses.createDialog.expenseDateLabel')}</Label>
            <Input id="exp-date" type="date" value={formData.date} onChange={e => patch({ date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-category">{t('expenses.createDialog.categoryLabel')}</Label>
            <Select value={formData.category} onValueChange={category => patch({ category })}>
              <SelectTrigger id="exp-category"><SelectValue placeholder={t('expenses.createDialog.categoryPlaceholder')} /></SelectTrigger>
              <SelectContent>
                {['Travel', 'Accommodation', 'Meals', 'Equipment', 'Training', 'Other'].map(cat => (
                  <SelectItem key={cat} value={cat}>{t(`expenses.categories.${cat.toLowerCase()}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="exp-description">{t('expenses.createDialog.descriptionLabel')}</Label>
            <Textarea id="exp-description" placeholder={t('expenses.createDialog.descriptionPlaceholder')} value={formData.description} onChange={e => patch({ description: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-amount">{t('expenses.createDialog.amountLabel')}</Label>
            <Input id="exp-amount" type="number" step="0.01" placeholder={t('expenses.createDialog.amountPlaceholder')} value={formData.amount} onChange={e => patch({ amount: e.target.value })} />
          </div>
          <div className="space-y-2 flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.billable} onChange={e => patch({ billable: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm">{t('expenses.createDialog.billableLabel')}</span>
            </label>
          </div>
        </Grid>
        <Stack direction="horizontal" spacing={2} justify="end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('expenses.createDialog.cancel')}</Button>
          <Button onClick={onSubmit}>{t('expenses.createDialog.create')}</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
