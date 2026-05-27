import { useState } from 'react'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'

export interface RateTemplate {
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

const TODAY = new Date().toISOString().split('T')[0]
const DEFAULT_FORM: Partial<RateTemplate> = {
  name: '', role: '', client: '',
  standardRate: 0, overtimeRate: 0, weekendRate: 0, nightShiftRate: 0, holidayRate: 0,
  currency: 'GBP', effectiveFrom: TODAY, isActive: true
}

export function useRateTemplateManager() {
  const { t } = useTranslation()
  const [templates = [], setTemplates] = useIndexedDBState<RateTemplate[]>('rate-templates', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<RateTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<RateTemplate>>(DEFAULT_FORM)

  const resetForm = () => {
    setFormData({ ...DEFAULT_FORM, effectiveFrom: new Date().toISOString().split('T')[0] })
    setEditingTemplate(null)
    setIsDialogOpen(false)
  }

  const handleCreate = () => {
    if (!formData.name || !formData.role || !formData.standardRate) { toast.error(t('rateTemplates.fillAllFields')); return }
    const base = formData.standardRate!
    const newTemplate: RateTemplate = {
      id: `RT-${Date.now()}`,
      name: formData.name!,
      role: formData.role!,
      client: formData.client,
      standardRate: base,
      overtimeRate: formData.overtimeRate || base * 1.5,
      weekendRate: formData.weekendRate || base * 1.5,
      nightShiftRate: formData.nightShiftRate || base * 1.25,
      holidayRate: formData.holidayRate || base * 2,
      currency: formData.currency!,
      effectiveFrom: formData.effectiveFrom!,
      isActive: formData.isActive!
    }
    setTemplates(current => [...(current || []), newTemplate])
    toast.success(t('rateTemplates.templateCreated'))
    resetForm()
  }

  const handleUpdate = () => {
    if (!editingTemplate) return
    setTemplates(current => (current || []).map(t => t.id === editingTemplate.id ? { ...editingTemplate, ...formData } : t))
    toast.success(t('rateTemplates.templateUpdated'))
    resetForm()
  }

  const handleDelete = (id: string) => {
    setTemplates(current => (current || []).filter(t => t.id !== id))
    toast.success(t('rateTemplates.templateDeleted'))
  }

  const handleDuplicate = (template: RateTemplate) => {
    setTemplates(current => [...(current || []), { ...template, id: `RT-${Date.now()}`, name: `${template.name} (Copy)`, effectiveFrom: new Date().toISOString().split('T')[0] }])
    toast.success(t('rateTemplates.templateDuplicated'))
  }

  const handleEdit = (template: RateTemplate) => { setEditingTemplate(template); setFormData(template); setIsDialogOpen(true) }

  const toggleActive = (id: string) => setTemplates(current => (current || []).map(t => t.id === id ? { ...t, isActive: !t.isActive } : t))

  return {
    t, templates,
    isDialogOpen, setIsDialogOpen,
    editingTemplate, formData, setFormData,
    resetForm, handleCreate, handleUpdate, handleDelete, handleDuplicate, handleEdit, toggleActive,
  }
}
