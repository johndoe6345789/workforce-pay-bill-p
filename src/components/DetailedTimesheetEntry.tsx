import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, Calendar, CurrencyDollar, Lightning } from '@phosphor-icons/react'
import { ShiftDetailDialog } from './ShiftDetailDialog'
import { ShiftEntryCard } from '@/components/timesheet/ShiftEntryCard'
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Shifts ({vm.shifts.length})</Label>
              <div className="flex gap-2">
                {vm.patterns.length > 0 && (
                  <>
                    <Select value={vm.selectedPattern} onValueChange={vm.setSelectedPattern}>
                      <SelectTrigger className="w-48"><SelectValue placeholder="Choose pattern..." /></SelectTrigger>
                      <SelectContent>
                        {vm.patterns.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={vm.applyShiftPattern} disabled={!vm.selectedPattern}>
                      <Lightning size={16} className="mr-2" />Apply
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                  </>
                )}
                <Button size="sm" onClick={() => { vm.setEditingShift(undefined); vm.setIsShiftDialogOpen(true) }}>
                  <Plus size={16} className="mr-2" />Add Shift
                </Button>
              </div>
            </div>

            <ScrollArea className="h-64 border rounded-lg">
              {!vm.shifts.length ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No shifts added yet</p>
                  <p className="text-xs mt-1">Click "Add Shift" to get started</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {vm.shifts.map(shift => (
                    <ShiftEntryCard key={shift.id} shift={shift} onEdit={vm.handleEditShift} onDelete={vm.handleDeleteShift} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {vm.shifts.length > 0 && (
            <Card className="bg-accent/5">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Total Shifts</p><p className="font-semibold text-lg">{vm.shifts.length}</p></div>
                  <div><p className="text-muted-foreground">Total Hours</p><p className="font-mono font-semibold text-lg">{vm.totalHours.toFixed(2)}</p></div>
                  <div><p className="text-muted-foreground">Total Amount</p><p className="font-mono font-semibold text-lg text-accent">£{vm.totalAmount.toFixed(2)}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

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
