import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { CalendarBlank, Users, CurrencyDollar } from '@phosphor-icons/react'
import type { PayrollRun, Timesheet, Worker } from '@/lib/types'

const payrollSchema = z.object({
  periodEnding: z.string().min(1, 'Period ending date is required'),
  processingType: z.enum(['all-approved', 'selected-workers', 'one-click']),
  selectedWorkerIds: z.array(z.string()).optional(),
})

type PayrollFormData = z.infer<typeof payrollSchema>

interface CreatePayrollDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreatePayroll: (payroll: Omit<PayrollRun, 'id'>) => Promise<void>
  timesheets: Timesheet[]
  workers: Worker[]
}

export function CreatePayrollDialog({
  open,
  onOpenChange,
  onCreatePayroll,
  timesheets,
  workers,
}: CreatePayrollDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<Set<string>>(new Set())

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      periodEnding: new Date().toISOString().split('T')[0],
      processingType: 'all-approved',
      selectedWorkerIds: [],
    },
  })

  const processingType = watch('processingType')
  const periodEnding = watch('periodEnding')

  const approvedTimesheets = useMemo(() => 
    timesheets.filter(ts => ts.status === 'approved' && ts.weekEnding <= periodEnding),
    [timesheets, periodEnding]
  )

  const eligibleWorkers = useMemo(() => {
    const workerIds = new Set(approvedTimesheets.map(ts => ts.workerId))
    return workers.filter(w => workerIds.has(w.id) && w.status === 'active')
  }, [approvedTimesheets, workers])

  const calculatePayrollAmount = useMemo(() => {
    let relevantTimesheets = approvedTimesheets

    if (processingType === 'selected-workers' && selectedWorkers.size > 0) {
      relevantTimesheets = approvedTimesheets.filter(ts => selectedWorkers.has(ts.workerId))
    }

    return relevantTimesheets.reduce((sum, ts) => sum + (ts.amount || 0), 0)
  }, [approvedTimesheets, processingType, selectedWorkers])

  const workerCount = useMemo(() => {
    if (processingType === 'selected-workers') {
      return selectedWorkers.size
    }
    return eligibleWorkers.length
  }, [processingType, selectedWorkers, eligibleWorkers])

  const toggleWorkerSelection = (workerId: string) => {
    const newSelection = new Set(selectedWorkers)
    if (newSelection.has(workerId)) {
      newSelection.delete(workerId)
    } else {
      newSelection.add(workerId)
    }
    setSelectedWorkers(newSelection)
  }

  const selectAllWorkers = () => {
    setSelectedWorkers(new Set(eligibleWorkers.map(w => w.id)))
  }

  const deselectAllWorkers = () => {
    setSelectedWorkers(new Set())
  }

  const onSubmit = async (data: PayrollFormData) => {
    if (processingType === 'selected-workers' && selectedWorkers.size === 0) {
      toast.error('Please select at least one worker')
      return
    }

    setIsSubmitting(true)
    try {
      const payroll: Omit<PayrollRun, 'id'> = {
        periodEnding: data.periodEnding,
        workersCount: workerCount,
        totalAmount: calculatePayrollAmount,
        status: 'scheduled',
      }

      await onCreatePayroll(payroll)
      toast.success('Payroll run created successfully')
      reset()
      setSelectedWorkers(new Set())
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to create payroll run')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Payroll Run</DialogTitle>
          <DialogDescription>
            Process payroll for approved timesheets
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <div>
              <Label htmlFor="periodEnding">Period Ending</Label>
              <Input
                id="periodEnding"
                type="date"
                {...register('periodEnding')}
              />
              {errors.periodEnding && (
                <p className="text-sm text-destructive mt-1">{errors.periodEnding.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="processingType">Processing Type</Label>
              <Select
                value={processingType}
                onValueChange={(value) => setValue('processingType', value as 'all-approved' | 'selected-workers' | 'one-click')}
              >
                <SelectTrigger id="processingType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-approved">All Approved Timesheets</SelectItem>
                  <SelectItem value="selected-workers">Selected Workers</SelectItem>
                  <SelectItem value="one-click">One-Click Processing</SelectItem>
                </SelectContent>
              </Select>
              {errors.processingType && (
                <p className="text-sm text-destructive mt-1">{errors.processingType.message}</p>
              )}
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="text-muted-foreground" size={20} />
                    <div>
                      <div className="text-2xl font-semibold">{workerCount}</div>
                      <div className="text-xs text-muted-foreground">Workers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarBlank className="text-muted-foreground" size={20} />
                    <div>
                      <div className="text-2xl font-semibold">{approvedTimesheets.length}</div>
                      <div className="text-xs text-muted-foreground">Timesheets</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyDollar className="text-muted-foreground" size={20} />
                    <div>
                      <div className="text-2xl font-semibold">
                        £{calculatePayrollAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Amount</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {processingType === 'selected-workers' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Select Workers</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={selectAllWorkers}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={deselectAllWorkers}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {eligibleWorkers.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      No eligible workers found for this period
                    </div>
                  ) : (
                    <div className="divide-y">
                      {eligibleWorkers.map((worker) => {
                        const workerTimesheets = approvedTimesheets.filter(ts => ts.workerId === worker.id)
                        const workerAmount = workerTimesheets.reduce((sum, ts) => sum + (ts.amount || 0), 0)
                        
                        return (
                          <div
                            key={worker.id}
                            className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                            onClick={() => toggleWorkerSelection(worker.id)}
                          >
                            <Checkbox
                              checked={selectedWorkers.has(worker.id)}
                              onCheckedChange={() => toggleWorkerSelection(worker.id)}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{worker.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {workerTimesheets.length} timesheet{workerTimesheets.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                £{workerAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {worker.type}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {processingType === 'one-click' && (
              <div className="p-4 border border-accent/20 bg-accent/5 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>One-Click Processing:</strong> This will automatically process all approved timesheets 
                  for the selected period with no manual review. Use this for routine payroll runs where all 
                  approvals are already complete.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  setSelectedWorkers(new Set())
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || workerCount === 0}>
                {isSubmitting ? 'Creating...' : 'Create Payroll Run'}
              </Button>
            </div>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
