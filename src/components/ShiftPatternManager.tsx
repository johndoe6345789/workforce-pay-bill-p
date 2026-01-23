import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  Clock,
  Plus,
  Trash,
  Copy,
  Moon,
  Sun,
  CalendarBlank,
  CheckCircle,
  PencilSimple
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { ShiftPatternTemplate, ShiftType, DayOfWeek, RecurrencePattern } from '@/lib/types'

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
]

const SHIFT_TYPES: { value: ShiftType; label: string; icon: any; color: string }[] = [
  { value: 'night', label: 'Night Shift', icon: Moon, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { value: 'weekend', label: 'Weekend', icon: CalendarBlank, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'evening', label: 'Evening', icon: Sun, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { value: 'early-morning', label: 'Early Morning', icon: Sun, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'standard', label: 'Standard', icon: Clock, color: 'bg-muted text-muted-foreground border-border' },
  { value: 'overtime', label: 'Overtime', icon: Clock, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { value: 'holiday', label: 'Holiday', icon: CalendarBlank, color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { value: 'split-shift', label: 'Split Shift', icon: Clock, color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' }
]

export function ShiftPatternManager() {
  const [patterns = [], setPatterns] = useKV<ShiftPatternTemplate[]>('shift-patterns', [])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPattern, setEditingPattern] = useState<ShiftPatternTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<ShiftPatternTemplate>>({
    name: '',
    description: '',
    shiftType: 'night',
    isRecurring: true,
    defaultStartTime: '22:00',
    defaultEndTime: '06:00',
    defaultBreakMinutes: 30,
    daysOfWeek: [],
    rateMultiplier: 1.0
  })

  const handleCreatePattern = () => {
    if (!formData.name || !formData.shiftType || !formData.daysOfWeek || formData.daysOfWeek.length === 0) {
      toast.error('Please fill in all required fields')
      return
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
      recurrencePattern: formData.isRecurring ? {
        frequency: 'weekly'
      } : undefined
    }

    setPatterns(current => [...(current || []), newPattern])
    toast.success('Shift pattern template created')
    resetForm()
    setIsCreateDialogOpen(false)
  }

  const handleUpdatePattern = () => {
    if (!editingPattern || !formData.name || !formData.shiftType || !formData.daysOfWeek || formData.daysOfWeek.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    setPatterns(current => {
      if (!current) return []
      return current.map(p =>
        p.id === editingPattern.id
          ? {
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
              recurrencePattern: formData.isRecurring ? (p.recurrencePattern || { frequency: 'weekly' }) : undefined
            }
          : p
      )
    })
    toast.success('Shift pattern template updated')
    resetForm()
    setEditingPattern(null)
  }

  const handleDeletePattern = (id: string) => {
    setPatterns(current => {
      if (!current) return []
      return current.filter(p => p.id !== id)
    })
    toast.success('Shift pattern template deleted')
  }

  const handleDuplicatePattern = (pattern: ShiftPatternTemplate) => {
    const duplicated: ShiftPatternTemplate = {
      ...pattern,
      id: `SP-${Date.now()}`,
      name: `${pattern.name} (Copy)`,
      createdDate: new Date().toISOString(),
      usageCount: 0
    }
    setPatterns(current => [...(current || []), duplicated])
    toast.success('Shift pattern template duplicated')
  }

  const handleEditPattern = (pattern: ShiftPatternTemplate) => {
    setEditingPattern(pattern)
    setFormData({
      name: pattern.name,
      description: pattern.description,
      shiftType: pattern.shiftType,
      isRecurring: pattern.isRecurring,
      defaultStartTime: pattern.defaultStartTime,
      defaultEndTime: pattern.defaultEndTime,
      defaultBreakMinutes: pattern.defaultBreakMinutes,
      daysOfWeek: pattern.daysOfWeek,
      rateMultiplier: pattern.rateMultiplier
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shiftType: 'night',
      isRecurring: true,
      defaultStartTime: '22:00',
      defaultEndTime: '06:00',
      defaultBreakMinutes: 30,
      daysOfWeek: [],
      rateMultiplier: 1.0
    })
  }

  const toggleDayOfWeek = (day: DayOfWeek) => {
    setFormData(prev => {
      const currentDays = prev.daysOfWeek || []
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day]
      return { ...prev, daysOfWeek: newDays }
    })
  }

  const getShiftTypeConfig = (type: ShiftType) => {
    return SHIFT_TYPES.find(st => st.value === type) || SHIFT_TYPES[0]
  }

  const calculateHours = (startTime: string, endTime: string, breakMinutes: number): number => {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
    
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60
    }
    
    totalMinutes -= breakMinutes
    
    return totalMinutes / 60
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Shift Pattern Templates</h2>
          <p className="text-muted-foreground mt-1">Create reusable templates for recurring shift schedules</p>
        </div>
        <Dialog 
          open={isCreateDialogOpen || editingPattern !== null} 
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false)
              setEditingPattern(null)
              resetForm()
            } else {
              setIsCreateDialogOpen(true)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPattern ? 'Edit' : 'Create'} Shift Pattern Template</DialogTitle>
              <DialogDescription>
                Define a reusable template for recurring shift schedules
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pattern-name">Template Name *</Label>
                <Input
                  id="pattern-name"
                  placeholder="e.g. Night Shift - Mon-Fri"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pattern-description">Description</Label>
                <Textarea
                  id="pattern-description"
                  placeholder="Optional description of the shift pattern"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift-type">Shift Type *</Label>
                <Select
                  value={formData.shiftType}
                  onValueChange={(value) => setFormData({ ...formData, shiftType: value as ShiftType })}
                >
                  <SelectTrigger id="shift-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIFT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time *</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={formData.defaultStartTime}
                    onChange={(e) => setFormData({ ...formData, defaultStartTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time *</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={formData.defaultEndTime}
                    onChange={(e) => setFormData({ ...formData, defaultEndTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break-minutes">Break (mins)</Label>
                  <Input
                    id="break-minutes"
                    type="number"
                    min="0"
                    step="15"
                    value={formData.defaultBreakMinutes}
                    onChange={(e) => setFormData({ ...formData, defaultBreakMinutes: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate-multiplier">Rate Multiplier</Label>
                <Input
                  id="rate-multiplier"
                  type="number"
                  min="1.0"
                  step="0.1"
                  value={formData.rateMultiplier}
                  onChange={(e) => setFormData({ ...formData, rateMultiplier: parseFloat(e.target.value) || 1.0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Standard rate × {formData.rateMultiplier || 1.0} = {((formData.rateMultiplier || 1.0) * 25).toFixed(2)} per hour (example at £25/hr)
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Days of Week *</Label>
                <div className="grid grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <Button
                      key={day.value}
                      type="button"
                      variant={formData.daysOfWeek?.includes(day.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleDayOfWeek(day.value)}
                      className="w-full"
                    >
                      {day.label.substring(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              {formData.defaultStartTime && formData.defaultEndTime && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium">Pattern Summary</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      Hours per shift: {calculateHours(
                        formData.defaultStartTime,
                        formData.defaultEndTime,
                        formData.defaultBreakMinutes || 0
                      ).toFixed(2)}h
                    </p>
                    <p>
                      Days per week: {formData.daysOfWeek?.length || 0}
                    </p>
                    <p>
                      Total weekly hours: {(
                        calculateHours(
                          formData.defaultStartTime,
                          formData.defaultEndTime,
                          formData.defaultBreakMinutes || 0
                        ) * (formData.daysOfWeek?.length || 0)
                      ).toFixed(2)}h
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setEditingPattern(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingPattern ? handleUpdatePattern : handleCreatePattern}>
                {editingPattern ? 'Update' : 'Create'} Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{patterns.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Active shift patterns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Most Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {patterns.length > 0 ? Math.max(...patterns.map(p => p.usageCount)) : 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Times applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Night Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {patterns.filter(p => p.shiftType === 'night').length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Night shift templates</p>
          </CardContent>
        </Card>
      </div>

      {patterns.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No shift patterns yet</h3>
          <p className="text-muted-foreground mb-4">Create your first template to streamline recurring shift scheduling</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus size={18} className="mr-2" />
            Create Template
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map(pattern => {
            const shiftConfig = getShiftTypeConfig(pattern.shiftType)
            const ShiftIcon = shiftConfig.icon
            const hours = calculateHours(pattern.defaultStartTime, pattern.defaultEndTime, pattern.defaultBreakMinutes)

            return (
              <Card key={pattern.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn('p-2 rounded-lg', shiftConfig.color)}>
                          <ShiftIcon size={24} weight="fill" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{pattern.name}</h3>
                            <Badge className={shiftConfig.color}>
                              {shiftConfig.label}
                            </Badge>
                          </div>
                          {pattern.description && (
                            <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {pattern.defaultStartTime} - {pattern.defaultEndTime}
                            </span>
                            <span>•</span>
                            <span>{hours.toFixed(2)}h per shift</span>
                            {pattern.rateMultiplier > 1.0 && (
                              <>
                                <span>•</span>
                                <span className="text-accent font-medium">{pattern.rateMultiplier}× rate</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {pattern.daysOfWeek.map(day => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day.substring(0, 3).toUpperCase()}
                        </Badge>
                      ))}
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weekly hours:</span>
                        <span className="font-mono font-medium">{(hours * pattern.daysOfWeek.length).toFixed(2)}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Break time:</span>
                        <span className="font-mono font-medium">{pattern.defaultBreakMinutes} mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Times used:</span>
                        <span className="font-mono font-medium">{pattern.usageCount}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEditPattern(pattern)}
                      >
                        <PencilSimple size={16} className="mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDuplicatePattern(pattern)}
                      >
                        <Copy size={16} className="mr-2" />
                        Duplicate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeletePattern(pattern.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
