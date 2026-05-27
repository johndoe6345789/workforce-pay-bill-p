import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from '@phosphor-icons/react'

interface FormData { workerName: string; email: string; startDate: string }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: FormData
  setFormData: (data: FormData) => void
  onSubmit: () => void
  t: (key: string) => string
}

export function OnboardingCreateDialog({ open, onOpenChange, formData, setFormData, onSubmit, t }: Props) {
  const patch = (updates: Partial<FormData>) => setFormData({ ...formData, ...updates })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button><UserPlus size={18} className="mr-2" />{t('onboarding.startOnboarding')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('onboarding.createDialog.title')}</DialogTitle>
          <DialogDescription>{t('onboarding.createDialog.description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ob-name">{t('onboarding.createDialog.workerNameLabel')}</Label>
            <Input id="ob-name" value={formData.workerName} onChange={e => patch({ workerName: e.target.value })} placeholder={t('onboarding.createDialog.workerNamePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ob-email">{t('onboarding.createDialog.emailLabel')}</Label>
            <Input id="ob-email" type="email" value={formData.email} onChange={e => patch({ email: e.target.value })} placeholder={t('onboarding.createDialog.emailPlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ob-start">{t('onboarding.createDialog.startDateLabel')}</Label>
            <Input id="ob-start" type="date" value={formData.startDate} onChange={e => patch({ startDate: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('onboarding.createDialog.cancel')}</Button>
          <Button onClick={onSubmit}>{t('onboarding.createDialog.start')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
