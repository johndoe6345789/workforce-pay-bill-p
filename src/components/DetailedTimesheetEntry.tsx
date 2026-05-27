import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, CurrencyDollar } from '@phosphor-icons/react'
import { ShiftDetailDialog } from './ShiftDetailDialog'
import { TimesheetShiftsSection } from '@/components/timesheets/TimesheetShiftsSection'
import { useDetailedTimesheetEntry, type TimesheetSubmitData } from '@/hooks/useDetailedTimesheetEntry'

interface Props {
  onSubmit: (data: TimesheetSubmitData) => void
}

export function DetailedTimesheetEntry({ onSubmit }: Props) {
  const vm = useDetailedTimesheetEntry(onSubmit)

  return (
    <>
      <Dialog open={vm.isOpen} onOpenChange={vm.setIsOpen}>
        <DialogTrigger asChild>
          <Button><Plus size={18} className="mr-2" />Detailed Timesheet</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create Detailed Timesheet</DialogTitle>
            <DialogDescription>Add shifts with specific start/end times, breaks, and shift premiums</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ts-worker">Worker Name *</Label>
              <Input id="ts-worker" placeholder="Enter worker name" value={vm.workerName} onChange={e => vm.setWorkerName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-client">Client Name *</Label>
              <Input id="ts-client" placeholder="Enter client name" value={vm.clientName} onChange={e => vm.setClientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-week">Week Ending *</Label>
              <Input id="ts-week" type="date" value={vm.weekEnding} onChange={e => vm.setWeekEnding(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-rate">Base Rate (£/hr) *</Label>
              <Input id="ts-rate" type="number" step="0.01" placeholder="25.00" value={vm.baseRate} onChange={e => vm.setBaseRate(e.target.value)} />
            </div>
          </div>

          <TimesheetShiftsSection
            shifts={vm.shifts}
            patterns={vm.patterns}
            selectedPattern={vm.selectedPattern}
            setSelectedPattern={vm.setSelectedPattern}
            applyShiftPattern={vm.applyShiftPattern}
            onAddShift={() => { vm.setEditingShift(undefined); vm.setIsShiftDialogOpen(true) }}
            onEditShift={vm.handleEditShift}
            onDeleteShift={vm.handleDeleteShift}
            totalHours={vm.totalHours}
            totalAmount={vm.totalAmount}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => vm.setIsOpen(false)}>Cancel</Button>
            <Button onClick={vm.handleSubmit}><CurrencyDollar size={18} className="mr-2" />Create Timesheet</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ShiftDetailDialog
        open={vm.isShiftDialogOpen}
        onOpenChange={open => { vm.setIsShiftDialogOpen(open); if (!open) vm.setEditingShift(undefined) }}
        onSave={vm.editingShift ? vm.handleUpdateShift : vm.handleAddShift}
        existingShift={vm.editingShift}
        baseRate={parseFloat(vm.baseRate) || 25}
      />
    </>
  )
}
