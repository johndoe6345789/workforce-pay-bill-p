import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock } from '@phosphor-icons/react'
import type { RateCard, ShiftEntry } from '@/lib/types'
import { useShiftPremiumCalculator } from '@/hooks/useShiftPremiumCalculator'
import { RateCardSummary } from '@/components/shift-premium/RateCardSummary'
import { ShiftEntryList } from '@/components/shift-premium/ShiftEntryList'
import { CalculationBreakdown } from '@/components/shift-premium/CalculationBreakdown'

interface ShiftPremiumCalculatorProps {
  rateCards: RateCard[]
  onCalculate: (shifts: ShiftEntry[], totalAmount: number) => void
}

export function ShiftPremiumCalculator({ rateCards, onCalculate }: ShiftPremiumCalculatorProps) {
  const vm = useShiftPremiumCalculator({ rateCards, onCalculate })

  return (
    <Dialog open={vm.isOpen} onOpenChange={vm.setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Clock size={18} className="mr-2" />Calculate with Premiums</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shift Premium Calculator</DialogTitle>
          <DialogDescription>Calculate timesheet amounts with automatic premium rates for overtime, weekend, night, and holiday shifts</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="spc-ratecard">Rate Card *</Label>
            <Select value={vm.selectedRateCardId} onValueChange={vm.setSelectedRateCardId}>
              <SelectTrigger id="spc-ratecard"><SelectValue placeholder="Select a rate card" /></SelectTrigger>
              <SelectContent>
                {rateCards.map(rc => (
                  <SelectItem key={rc.id} value={rc.id}>
                    {rc.name} - £{rc.standardRate}/hr (OT: {rc.overtimeMultiplier}x, Weekend: {rc.weekendMultiplier}x)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {vm.selectedRateCard && <RateCardSummary rateCard={vm.selectedRateCard} />}

          <ShiftEntryList
            shifts={vm.shifts}
            onAdd={vm.addShift}
            onRemove={vm.removeShift}
            onUpdate={vm.updateShift}
          />

          <CalculationBreakdown shifts={vm.calculatedShifts} totalAmount={vm.totalAmount} />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => vm.setIsOpen(false)}>Cancel</Button>
          <Button onClick={vm.handleCalculate} disabled={!vm.selectedRateCardId || vm.calculatedShifts.length === 0}>
            Apply Calculation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
