import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Plus, 
  Trash, 
  PencilSimple, 
  Clock, 
  Moon, 
  Sun, 
  SunHorizon,
  Calendar,
  CurrencyDollar
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { ShiftDetailDialog } from './ShiftDetailDialog'
import type { ShiftEntry } from '@/lib/types'

interface DetailedTimesheetEntryProps {
  onSubmit: (data: {
    workerName: string
    clientName: string
    weekEnding: string
    shifts: ShiftEntry[]
    totalHours: number
    totalAmount: number
    baseRate: number
  }) => void
}

export function DetailedTimesheetEntry({ onSubmit }: DetailedTimesheetEntryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<ShiftEntry | undefined>(undefined)
  const [workerName, setWorkerName] = useState('')
  const [clientName, setClientName] = useState('')
  const [weekEnding, setWeekEnding] = useState('')
  const [baseRate, setBaseRate] = useState('25.00')
  const [shifts, setShifts] = useState<ShiftEntry[]>([])

  const handleAddShift = (shiftData: Omit<ShiftEntry, 'id'>) => {
    const newShift: ShiftEntry = {
      ...shiftData,
      id: `shift-${Date.now()}-${Math.random()}`
    }
    setShifts(prev => [...prev, newShift].sort((a, b) => 
      new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime()
    ))
    toast.success('Shift added successfully')
  }

  const handleUpdateShift = (shiftData: Omit<ShiftEntry, 'id'>) => {
    if (!editingShift) return
    
    setShifts(prev => prev.map(shift => 
      shift.id === editingShift.id 
        ? { ...shiftData, id: shift.id }
        : shift
    ).sort((a, b) => 
      new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime()
    ))
    setEditingShift(undefined)
    toast.success('Shift updated successfully')
  }

  const handleDeleteShift = (shiftId: string) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId))
    toast.success('Shift removed')
  }

  const handleEditShift = (shift: ShiftEntry) => {
    setEditingShift(shift)
    setIsShiftDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!workerName || !clientName || !weekEnding) {
      toast.error('Please fill in worker, client, and week ending')
      return
    }

    if (shifts.length === 0) {
      toast.error('Please add at least one shift')
      return
    }

    const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0)
    const totalAmount = shifts.reduce((sum, shift) => sum + shift.amount, 0)

    onSubmit({
      workerName,
      clientName,
      weekEnding,
      shifts,
      totalHours,
      totalAmount,
      baseRate: parseFloat(baseRate)
    })

    setWorkerName('')
    setClientName('')
    setWeekEnding('')
    setBaseRate('25.00')
    setShifts([])
    setIsOpen(false)
  }

  const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0)
  const totalAmount = shifts.reduce((sum, shift) => sum + shift.amount, 0)

  const getShiftIcon = (shiftType: string) => {
    switch (shiftType) {
      case 'night': return <Moon size={16} weight="fill" className="text-purple-500" />
      case 'evening': return <SunHorizon size={16} weight="fill" className="text-orange-500" />
      case 'early-morning': return <Sun size={16} weight="fill" className="text-yellow-500" />
      default: return <Clock size={16} className="text-muted-foreground" />
    }
  }

  const getShiftBadgeColor = (shiftType: string) => {
    switch (shiftType) {
      case 'night': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'evening': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'weekend': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'holiday': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'overtime': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'early-morning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus size={18} className="mr-2" />
            Detailed Timesheet
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create Detailed Timesheet</DialogTitle>
            <DialogDescription>
              Add shifts with specific start/end times, breaks, and shift premiums
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ts-worker">Worker Name *</Label>
              <Input
                id="ts-worker"
                placeholder="Enter worker name"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-client">Client Name *</Label>
              <Input
                id="ts-client"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-week">Week Ending *</Label>
              <Input
                id="ts-week"
                type="date"
                value={weekEnding}
                onChange={(e) => setWeekEnding(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-rate">Base Rate (£/hr) *</Label>
              <Input
                id="ts-rate"
                type="number"
                step="0.01"
                placeholder="25.00"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Shifts ({shifts.length})</Label>
              <Button
                size="sm"
                onClick={() => {
                  setEditingShift(undefined)
                  setIsShiftDialogOpen(true)
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Shift
              </Button>
            </div>

            <ScrollArea className="h-64 border rounded-lg">
              {shifts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No shifts added yet</p>
                  <p className="text-xs mt-1">Click "Add Shift" to get started</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {shifts.map(shift => (
                    <Card key={shift.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            {getShiftIcon(shift.shiftType)}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {new Date(shift.date).toLocaleDateString('en-GB', { 
                                    weekday: 'short', 
                                    day: 'numeric', 
                                    month: 'short' 
                                  })}
                                </span>
                                <Badge className={getShiftBadgeColor(shift.shiftType)}>
                                  {shift.shiftType}
                                </Badge>
                                {shift.rateMultiplier > 1.0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {shift.rateMultiplier}x
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-4 gap-3 text-xs">
                                <div>
                                  <p className="text-muted-foreground">Time</p>
                                  <p className="font-mono">{shift.startTime} - {shift.endTime}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Break</p>
                                  <p className="font-mono">{shift.breakMinutes} min</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Hours</p>
                                  <p className="font-mono font-semibold">{shift.hours.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Amount</p>
                                  <p className="font-mono font-semibold">£{shift.amount.toFixed(2)}</p>
                                </div>
                              </div>
                              {shift.notes && (
                                <p className="text-xs text-muted-foreground italic">{shift.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditShift(shift)}
                            >
                              <PencilSimple size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteShift(shift.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {shifts.length > 0 && (
            <Card className="bg-accent/5">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Shifts</p>
                    <p className="font-semibold text-lg">{shifts.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Hours</p>
                    <p className="font-mono font-semibold text-lg">{totalHours.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-mono font-semibold text-lg text-accent">£{totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <CurrencyDollar size={18} className="mr-2" />
              Create Timesheet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ShiftDetailDialog
        open={isShiftDialogOpen}
        onOpenChange={(open) => {
          setIsShiftDialogOpen(open)
          if (!open) setEditingShift(undefined)
        }}
        onSave={editingShift ? handleUpdateShift : handleAddShift}
        existingShift={editingShift}
        baseRate={parseFloat(baseRate) || 25}
      />
    </>
  )
}
