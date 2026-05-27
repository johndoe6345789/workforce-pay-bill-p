import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import { DAYS_OF_WEEK } from '@/data/shiftPatternConfig'
import type { ShiftPatternTemplate, ShiftType, DayOfWeek } from '@/lib/types'
import { DEFAULT_SHIFT_FORM } from './useShiftPatternManager.types'

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
    const newPattern: ShiftPatternTemplate = {
      id: `SP-${Date.now()}`,
      name: formData.name,
      description: formData.description || '',
      shiftType: formData.shiftType as ShiftType,
      isRecurring: formData.isRecurring ?? true,
      defaultStartTime: formData.defaultStartTime || '09:00',
      defaultEndTime: formData.defaultEndTime || '17:00',
      defaultBreakMinutes: formData.defaultBreakMinutes || 30,
      daysOfWeek: formData.daysOfWeek as DayOfWeek[],
      rateMultiplier: formData.rateMultiplier || 1.0,
      createdDate: new Date().toISOString(),
      usageCount: 0,
      recurrencePattern: formData.isRecurring ? { frequency: 'weekly' } : undefined,
    }
    setPatterns(current => [...(current || []), newPattern])
    toast.success(t('shiftPatterns.patternCreated'))
    closeDialog()
  }

  const handleUpdatePattern = () => {
    if (!editingPattern || !formData.name || !formData.shiftType || !formData.daysOfWeek?.length) {
      toast.error(t('shiftPatterns.fillAllFields')); return
    }
    setPatterns(current => (current || []).map(p =>
      p.id !== editingPattern.id ? p : {
        ...p,
        name: formData.name!,
        description: formData.description || '',
        shiftType: formData.shiftType as ShiftType,
        isRecurring: formData.isRecurring ?? true,
        defaultStartTime: formData.defaultStartTime || '09:00',
        defaultEndTime: formData.defaultEndTime || '17:00',
        defaultBreakMinutes: formData.defaultBreakMinutes || 30,
        daysOfWeek: formData.daysOfWeek as DayOfWeek[],
        rateMultiplier: formData.rateMultiplier || 1.0,
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
    setPatterns(current => [...(current || []), { ...pattern, id: `SP-${Date.now()}`, name: `${pattern.name} (Copy)`, createdDate: new Date().toISOString(), usageCount: 0 }])
    toast.success(t('shiftPatterns.patternDuplicated'))
  }

  const handleEditPattern = (pattern: ShiftPatternTemplate) => {
    setEditingPattern(pattern)
    setFormData({ name: pattern.name, description: pattern.description, shiftType: pattern.shiftType, isRecurring: pattern.isRecurring, defaultStartTime: pattern.defaultStartTime, defaultEndTime: pattern.defaultEndTime, defaultBreakMinutes: pattern.defaultBreakMinutes, daysOfWeek: pattern.daysOfWeek, rateMultiplier: pattern.rateMultiplier })
  }

  const toggleDayOfWeek = (day: DayOfWeek) => {
    setFormData(prev => {
      const current = prev.daysOfWeek || []
      return { ...prev, daysOfWeek: current.includes(day) ? current.filter(d => d !== day) : [...current, day] }
    })
  }

  void DAYS_OF_WEEK

  return {
    t, patterns, isCreateDialogOpen, setIsCreateDialogOpen,
    editingPattern, setEditingPattern,
    formData, setFormData,
    resetForm, closeDialog,
    handleCreatePattern, handleUpdatePattern, handleDeletePattern,
    handleDuplicatePattern, handleEditPattern, toggleDayOfWeek,
  }
}
