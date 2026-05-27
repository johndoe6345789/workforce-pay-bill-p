import { UploadSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import type { UploadForm } from '@/hooks/useComplianceView'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UploadForm
  setForm: (form: UploadForm) => void
  onSubmit: () => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function UploadDocumentDialog({ open, onOpenChange, form, setForm, onSubmit, t }: Props) {
  const patch = (updates: Partial<UploadForm>) => setForm({ ...form, ...updates })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UploadSimple size={18} className="mr-2" />
          {t('compliance.uploadDocument')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('compliance.uploadDialog.title')}</DialogTitle>
          <DialogDescription>{t('compliance.uploadDialog.description')}</DialogDescription>
        </DialogHeader>
        <Stack spacing={4} className="py-4">
          <div className="space-y-2">
            <Label htmlFor="workerName">{t('compliance.uploadDialog.workerNameLabel')}</Label>
            <Input
              id="workerName"
              placeholder={t('compliance.uploadDialog.workerNamePlaceholder')}
              value={form.workerName}
              onChange={e => patch({ workerName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="documentType">{t('compliance.uploadDialog.documentTypeLabel')}</Label>
            <Select value={form.documentType} onValueChange={value => patch({ documentType: value })}>
              <SelectTrigger id="documentType">
                <SelectValue placeholder={t('compliance.uploadDialog.documentTypePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DBS Check">{t('compliance.documentTypes.dbsCheck')}</SelectItem>
                <SelectItem value="Right to Work">{t('compliance.documentTypes.rightToWork')}</SelectItem>
                <SelectItem value="Professional License">{t('compliance.documentTypes.professionalLicense')}</SelectItem>
                <SelectItem value="First Aid Certificate">{t('compliance.documentTypes.firstAidCertificate')}</SelectItem>
                <SelectItem value="Driving License">{t('compliance.documentTypes.drivingLicense')}</SelectItem>
                <SelectItem value="Passport">{t('compliance.documentTypes.passport')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">{t('compliance.uploadDialog.expiryDateLabel')}</Label>
            <Input id="expiryDate" type="date" value={form.expiryDate} onChange={e => patch({ expiryDate: e.target.value })} />
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <UploadSimple size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">{t('compliance.uploadDialog.uploadAreaText')}</p>
            <p className="text-xs text-muted-foreground">{t('compliance.uploadDialog.uploadAreaSubtext')}</p>
          </div>
        </Stack>
        <Stack direction="horizontal" spacing={2} justify="end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('compliance.uploadDialog.cancel')}</Button>
          <Button onClick={onSubmit}>{t('compliance.uploadDialog.upload')}</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
