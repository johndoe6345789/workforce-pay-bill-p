import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, Plus, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { RateCard, ShiftEntry, ShiftType } from '@/lib/types'

interface ShiftPremiumCalculatorProps {
  rateCards: RateCard[]
  onCalculate: (shifts: ShiftEntry[], totalAmount: number) => void
}

export function ShiftPremiumCalculator({ rateCards, onCalculate }: ShiftPremiumCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRateCardId, setSelectedRateCardId] = useState<string>('')
  const [shifts, setShifts] = useState<Array<{
    date: string
    shiftType: ShiftType
    hours: string
  }>>([
    { date: '', shiftType: 'standard', hours: '' }
  ])

  const selectedRateCard = rateCards.find(rc => rc.id === selectedRateCardId)

  const getShiftRate = (shiftType: ShiftType, baseRate: number, rateCard: RateCard): number => {
    switch (shiftType) {
      case 'standard':
        return baseRate
      case 'overtime':
        return baseRate * rateCard.overtimeMultiplier
      case 'weekend':
        return baseRate * rateCard.weekendMultiplier
      case 'night':
        return baseRate * rateCard.nightMultiplier
      case 'holiday':
        return baseRate * rateCard.holidayMultiplier
      default:
        return baseRate
    }
  }

  const calculateShifts = (): ShiftEntry[] => {
    if (!selectedRateCard) return []

    return shifts
      .filter(s => s.date && s.hours)
      .map((shift, index) => {
        const hours = parseFloat(shift.hours)
        const rate = getShiftRate(shift.shiftType, selectedRateCard.standardRate, selectedRateCard)
        const amount = hours * rate

        return {
          id: `SHIFT-${Date.now()}-${index}`,
          date: shift.date,
          shiftType: shift.shiftType,
          hours: hours,
          rate: rate,
          amount: amount
        }
      })
  }

  const addShift = () => {
    setShifts([...shifts, { date: '', shiftType: 'standard', hours: '' }])
  }

  const removeShift = (index: number) => {
    setShifts(shifts.filter((_, i) => i !== index))
  }

  const updateShift = (index: number, field: keyof typeof shifts[0], value: string) => {
    const updated = [...shifts]
    updated[index] = { ...updated[index], [field]: value }
    setShifts(updated)
  }

  const handleCalculate = () => {
    if (!selectedRateCardId) {
      toast.error('Please select a rate card')
      return
    }

    const calculatedShifts = calculateShifts()
    
    if (calculatedShifts.length === 0) {
      toast.error('Please add at least one valid shift')
      return
    }

    const totalAmount = calculatedShifts.reduce((sum, shift) => sum + shift.amount, 0)
    
    onCalculate(calculatedShifts, totalAmount)
    toast.success(`Calculated ${calculatedShifts.length} shifts totaling £${totalAmount.toFixed(2)}`)
    
    setSelectedRateCardId('')
    setShifts([{ date: '', shiftType: 'standard', hours: '' }])
    setIsOpen(false)
  }

  const calculatedShifts = selectedRateCard ? calculateShifts() : []
  const totalAmount = calculatedShifts.reduce((sum, shift) => sum + shift.amount, 0)

  const getShiftTypeInfo = (shiftType: ShiftType) => {
    switch (shiftType) {
      case 'standard':
        return { label: 'Standard', color: 'bg-muted' }
      case 'overtime':
        return { label: 'Overtime', color: 'bg-warning/20' }
      case 'weekend':
        return { label: 'Weekend', color: 'bg-info/20' }
      case 'night':
        return { label: 'Night', color: 'bg-accent/20' }
      case 'holiday':
        return { label: 'Holiday', color: 'bg-success/20' }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Clock size={18} className="mr-2" />
          Calculate with Premiums
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shift Premium Calculator</DialogTitle>
          <DialogDescription>
            Calculate timesheet amounts with automatic premium rates for overtime, weekend, night, and holiday shifts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="spc-ratecard">Rate Card *</Label>
            <Select value={selectedRateCardId} onValueChange={setSelectedRateCardId}>
              <SelectTrigger id="spc-ratecard">
                <SelectValue placeholder="Select a rate card" />
              </SelectTrigger>
              <SelectContent>
                {rateCards.map(rc => (
                  <SelectItem key={rc.id} value={rc.id}>
                    {rc.name} - £{rc.standardRate}/hr (OT: {rc.overtimeMultiplier}x, Weekend: {rc.weekendMultiplier}x)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRateCard && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Standard</p>
                    <p className="font-semibold font-mono">£{selectedRateCard.standardRate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overtime</p>
                    <p className="font-semibold font-mono">£{(selectedRateCard.standardRate * selectedRateCard.overtimeMultiplier).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weekend</p>
                    <p className="font-semibold font-mono">£{(selectedRateCard.standardRate * selectedRateCard.weekendMultiplier).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Night</p>
                    <p className="font-semibold font-mono">£{(selectedRateCard.standardRate * selectedRateCard.nightMultiplier).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Holiday</p>
                    <p className="font-semibold font-mono">£{(selectedRateCard.standardRate * selectedRateCard.holidayMultiplier).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Shifts</Label>
              <Button size="sm" variant="outline" onClick={addShift}>
                <Plus size={16} className="mr-2" />
                Add Shift
              </Button>
            </div>

            {shifts.map((shift, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-4 space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={shift.date}
                        onChange={(e) => updateShift(index, 'date', e.target.value)}
                      />
                    </div>
                    <div className="col-span-4 space-y-2">
                      <Label>Shift Type</Label>
                      <Select
                        value={shift.shiftType}
                        onValueChange={(value) => updateShift(index, 'shiftType', value as ShiftType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="overtime">Overtime</SelectItem>
                          <SelectItem value="weekend">Weekend</SelectItem>
                          <SelectItem value="night">Night</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3 space-y-2">
                      <Label>Hours</Label>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="8"
                        value={shift.hours}
                        onChange={(e) => updateShift(index, 'hours', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex items-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeShift(index)}
                        disabled={shifts.length === 1}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {calculatedShifts.length > 0 && (
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-base">Calculated Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculatedShifts.map((shift, index) => {
                  const info = getShiftTypeInfo(shift.shiftType)
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn(info.color)}>
                          {info.label}
                        </Badge>
                        <span className="text-muted-foreground">{shift.date}</span>
                        <span className="font-mono">{shift.hours}h × £{shift.rate.toFixed(2)}</span>
                      </div>
                      <span className="font-semibold font-mono">£{shift.amount.toFixed(2)}</span>
                    </div>
                  )
                })}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-semibold font-mono">£{totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleCalculate} disabled={!selectedRateCardId || calculatedShifts.length === 0}>
            Apply Calculation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
