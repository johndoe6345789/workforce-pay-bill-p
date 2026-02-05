import { useState } from 'react'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { useTranslation } from '@/hooks/use-translation'
import { 
  CurrencyCircleDollar, 
  Plus,
  Pencil,
  Trash,
  Copy,
  CheckCircle,
  Clock
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface RateTemplate {
  id: string
  name: string
  role: string
  client?: string
  standardRate: number
  overtimeRate: number
  weekendRate: number
  nightShiftRate: number
  holidayRate: number
  currency: string
  effectiveFrom: string
  isActive: boolean
}

export function RateTemplateManager() {
  const { t } = useTranslation()
  const [templates = [], setTemplates] = useIndexedDBState<RateTemplate[]>('rate-templates', [])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<RateTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<RateTemplate>>({
    name: '',
    role: '',
    client: '',
    standardRate: 0,
    overtimeRate: 0,
    weekendRate: 0,
    nightShiftRate: 0,
    holidayRate: 0,
    currency: 'GBP',
    effectiveFrom: new Date().toISOString().split('T')[0],
    isActive: true
  })

  const handleCreate = () => {
    if (!formData.name || !formData.role || !formData.standardRate) {
      toast.error(t('rateTemplates.fillAllFields'))
      return
    }

    const newTemplate: RateTemplate = {
      id: `RT-${Date.now()}`,
      name: formData.name!,
      role: formData.role!,
      client: formData.client,
      standardRate: formData.standardRate!,
      overtimeRate: formData.overtimeRate || formData.standardRate! * 1.5,
      weekendRate: formData.weekendRate || formData.standardRate! * 1.5,
      nightShiftRate: formData.nightShiftRate || formData.standardRate! * 1.25,
      holidayRate: formData.holidayRate || formData.standardRate! * 2,
      currency: formData.currency!,
      effectiveFrom: formData.effectiveFrom!,
      isActive: formData.isActive!
    }

    setTemplates((current) => [...(current || []), newTemplate])
    toast.success(t('rateTemplates.templateCreated'))
    resetForm()
  }

  const handleUpdate = () => {
    if (!editingTemplate) return

    setTemplates((current) =>
      (current || []).map((t) =>
        t.id === editingTemplate.id
          ? { ...editingTemplate, ...formData }
          : t
      )
    )
    toast.success(t('rateTemplates.templateUpdated'))
    resetForm()
  }

  const handleDelete = (id: string) => {
    setTemplates((current) => (current || []).filter((t) => t.id !== id))
    toast.success(t('rateTemplates.templateDeleted'))
  }

  const handleDuplicate = (template: RateTemplate) => {
    const newTemplate: RateTemplate = {
      ...template,
      id: `RT-${Date.now()}`,
      name: `${template.name} (Copy)`,
      effectiveFrom: new Date().toISOString().split('T')[0]
    }
    setTemplates((current) => [...(current || []), newTemplate])
    toast.success(t('rateTemplates.templateDuplicated'))
  }

  const handleEdit = (template: RateTemplate) => {
    setEditingTemplate(template)
    setFormData(template)
    setIsCreateDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      client: '',
      standardRate: 0,
      overtimeRate: 0,
      weekendRate: 0,
      nightShiftRate: 0,
      holidayRate: 0,
      currency: 'GBP',
      effectiveFrom: new Date().toISOString().split('T')[0],
      isActive: true
    })
    setEditingTemplate(null)
    setIsCreateDialogOpen(false)
  }

  const toggleActive = (id: string) => {
    setTemplates((current) =>
      (current || []).map((t) =>
        t.id === id ? { ...t, isActive: !t.isActive } : t
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('rateTemplates.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('rateTemplates.subtitle')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm()
          setIsCreateDialogOpen(open)
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" />
              {t('rateTemplates.createTemplate')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? t('rateTemplates.editTemplate') : t('rateTemplates.createTemplate')}</DialogTitle>
              <DialogDescription>
                {t('rateTemplates.createDialog.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">{t('rateTemplates.templateNameLabel')}</Label>
                <Input
                  id="name"
                  placeholder={t('rateTemplates.templateNamePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">{t('rateTemplates.roleLabel')}</Label>
                <Input
                  id="role"
                  placeholder={t('rateTemplates.rolePlaceholder')}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">{t('rateTemplates.clientLabel')}</Label>
                <Input
                  id="client"
                  placeholder={t('rateTemplates.clientPlaceholder')}
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="standardRate">{t('rateTemplates.standardRateLabel')}</Label>
                <Input
                  id="standardRate"
                  type="number"
                  step="0.01"
                  placeholder={t('rateTemplates.standardRatePlaceholder')}
                  value={formData.standardRate}
                  onChange={(e) => setFormData({ ...formData, standardRate: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t('rateTemplates.currencyLabel')}</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overtimeRate">{t('rateTemplates.overtimeRateLabel')}</Label>
                <Input
                  id="overtimeRate"
                  type="number"
                  step="0.01"
                  placeholder={`${(formData.standardRate || 0) * 1.5}`}
                  value={formData.overtimeRate}
                  onChange={(e) => setFormData({ ...formData, overtimeRate: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">{t('rateTemplates.overtimeRateHelper')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekendRate">{t('rateTemplates.weekendRateLabel')}</Label>
                <Input
                  id="weekendRate"
                  type="number"
                  step="0.01"
                  placeholder={`${(formData.standardRate || 0) * 1.5}`}
                  value={formData.weekendRate}
                  onChange={(e) => setFormData({ ...formData, weekendRate: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">{t('rateTemplates.weekendRateHelper')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nightShiftRate">{t('rateTemplates.nightShiftRateLabel')}</Label>
                <Input
                  id="nightShiftRate"
                  type="number"
                  step="0.01"
                  placeholder={`${(formData.standardRate || 0) * 1.25}`}
                  value={formData.nightShiftRate}
                  onChange={(e) => setFormData({ ...formData, nightShiftRate: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">{t('rateTemplates.nightShiftRateHelper')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="holidayRate">{t('rateTemplates.holidayRateLabel')}</Label>
                <Input
                  id="holidayRate"
                  type="number"
                  step="0.01"
                  placeholder={`${(formData.standardRate || 0) * 2}`}
                  value={formData.holidayRate}
                  onChange={(e) => setFormData({ ...formData, holidayRate: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">{t('rateTemplates.holidayRateHelper')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveFrom">{t('rateTemplates.effectiveFromLabel')}</Label>
                <Input
                  id="effectiveFrom"
                  type="date"
                  value={formData.effectiveFrom}
                  onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>{t('common.cancel')}</Button>
              <Button onClick={editingTemplate ? handleUpdate : handleCreate}>
                {editingTemplate ? t('common.save') : t('common.add')} {t('rateTemplates.templateName')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('rateTemplates.totalTemplates')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{templates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('rateTemplates.activeTemplates')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{templates.filter(t => t.isActive).length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {templates.length === 0 ? (
          <Card className="p-12 text-center">
            <CurrencyCircleDollar size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('rateTemplates.noTemplates')}</h3>
            <p className="text-muted-foreground">{t('rateTemplates.noTemplatesDescription')}</p>
          </Card>
        ) : (
          templates.map((template) => (
            <Card key={template.id} className={cn(!template.isActive && 'opacity-60')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <CurrencyCircleDollar size={24} className="text-primary" weight="fill" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{template.name}</h3>
                          <Badge variant={template.isActive ? 'success' : 'outline'}>
                            {template.isActive ? t('rateTemplates.active') : t('rateTemplates.inactive')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.role}{template.client && ` • ${template.client}`}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('rateTemplates.standard')}</p>
                        <p className="font-semibold font-mono">£{template.standardRate.toFixed(2)}{t('rateTemplates.perHour')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('rateTemplates.overtime')}</p>
                        <p className="font-semibold font-mono">£{template.overtimeRate.toFixed(2)}{t('rateTemplates.perHour')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('rateTemplates.weekend')}</p>
                        <p className="font-semibold font-mono">£{template.weekendRate.toFixed(2)}{t('rateTemplates.perHour')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('rateTemplates.night')}</p>
                        <p className="font-semibold font-mono">£{template.nightShiftRate.toFixed(2)}{t('rateTemplates.perHour')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('rateTemplates.holiday')}</p>
                        <p className="font-semibold font-mono">£{template.holidayRate.toFixed(2)}{t('rateTemplates.perHour')}</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {t('rateTemplates.effectiveFromDate', { date: new Date(template.effectiveFrom).toLocaleDateString() })} • {t('rateTemplates.currency')}: {template.currency}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(template.id)}>
                      {template.isActive ? t('rateTemplates.deactivate') : t('rateTemplates.activate')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDuplicate(template)}>
                      <Copy size={16} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(template)}>
                      <Pencil size={16} />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(template.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
