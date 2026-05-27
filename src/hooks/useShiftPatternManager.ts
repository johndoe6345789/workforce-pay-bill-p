import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import type { ShiftPatternTemplate, DayOfWeek } from '@/lib/types'
import { DEFAULT_SHIFT_FORM } from './useShiftPatternManager.types'
import { buildPatternFromForm, formDataFromPattern } from './useShiftPatternManager.helpers'

export function useShiftPatternManager() {
  const { t } = useTranslation()
  const [patterns = [], setPatterns] = useKV<ShiftPatternTemplate[]>('shift-patterns', [])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPattern, setEditingPattern] = useState<ShiftPatternTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<ShiftPatternTemplate>>(DEFAULT_SHIFT_FORM)

  const resetForm = () => setFormData(DEFAULT_SHIFT_FORM)

  const closeDialog = () => {
    setIsCreateDialogOpen(false)
    setEditingPattern(null)
    resetForm()
  }

  const handleCreatePattern = () => {
    if (!formData.name || !formData.shiftType || !formData.daysOfWeek?.length) {
      toast.error(t('shiftPatterns.fillAllFields')); return
    }
    setPatterns(current => [...(current || []), buildPatternFromForm(formData)])
    toast.success(t('shiftPatterns.patternCreated'))
    closeDialog()
  }

  const handleUpdatePattern = () => {
    if (!editingPattern || !formData.name || !formData.shiftType || !formData.daysOfWeek?.length) {
      toast.error(t('shiftPatterns.fillAllFields')); return
    }
    setPatterns(current => (current || []).map(p =>
      p.id !== editingPattern.id ? p : {
        ...buildPatternFromForm(formData),
        id: p.id,
        createdDate: p.createdDate,
        usageCount: p.usageCount,
        recurrencePattern: formData.isRecurring ? (p.recurrencePattern || { frequency: 'weekly' }) : undefined,
      }
    ))
    toast.success(t('shiftPatterns.patternUpdated'))
    closeDialog()
  }

  const handleDeletePattern = (id: string) => {
    setPatterns(current => (current || []).filter(p => p.id !== id))
    toast.success(t('shiftPatterns.patternDeleted'))
  }

  const handleDuplicatePattern = (pattern: ShiftPatternTemplate) => {
    const copy = { ...pattern, id: `SP-${Date.now()}`, name: `${pattern.name} (Copy)`, createdDate: new Date().toISOString(), usageCount: 0 }
    setPatterns(current => [...(current || []), copy])
    toast.success(t('shiftPatterns.patternDuplicated'))
  }

  const handleEditPattern = (pattern: ShiftPatternTemplate) => {
    setEditingPattern(pattern)
    setFormData(formDataFromPattern(pattern))
  }

  const toggleDayOfWeek = (day: DayOfWeek) => {
    setFormData(prev => {
      const current = prev.daysOfWeek || []
      return { ...prev, daysOfWeek: current.includes(day) ? current.filter(d => d !== day) : [...current, day] }
    })
  }

  return {
    t, patterns, isCreateDialogOpen, setIsCreateDialogOpen,
    editingPattern, setEditingPattern,
    formData, setFormData,
    resetForm, closeDialog,
    handleCreatePattern, handleUpdatePattern, handleDeletePattern,
    handleDuplicatePattern, handleEditPattern, toggleDayOfWeek,
  }
}
