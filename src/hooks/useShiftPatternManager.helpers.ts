import type { ShiftPatternTemplate, ShiftType, DayOfWeek } from '@/lib/types'

export function buildPatternFromForm(formData: Partial<ShiftPatternTemplate>): ShiftPatternTemplate {
  return {
    id: `SP-${Date.now()}`,
    name: formData.name!,
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
}

export function formDataFromPattern(pattern: ShiftPatternTemplate): Partial<ShiftPatternTemplate> {
  return {
    name: pattern.name,
    description: pattern.description,
    shiftType: pattern.shiftType,
    isRecurring: pattern.isRecurring,
    defaultStartTime: pattern.defaultStartTime,
    defaultEndTime: pattern.defaultEndTime,
    defaultBreakMinutes: pattern.defaultBreakMinutes,
    daysOfWeek: pattern.daysOfWeek,
    rateMultiplier: pattern.rateMultiplier,
  }
}
