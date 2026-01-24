import { useState, useMemo } from 'react'
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Users,
  CurrencyDollar,
  Clock,
  Warning,
  Eye,
  ArrowRight
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Stack } from '@/components/ui/stack'
import { Grid } from '@/components/ui/grid'
import { DataList } from '@/components/ui/data-list'
import { Separator } from '@/components/ui/separator'
import { usePayrollBatch } from '@/hooks/use-payroll-batch'
import { toast } from 'sonner'

interface PayrollBatchProcessorProps {
  timesheets: any[]
  workers: any[]
  onBatchComplete?: (batch: any) => void
}

export function PayrollBatchProcessor({ 
  timesheets, 
  workers,
  onBatchComplete 
}: PayrollBatchProcessorProps) {
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  
  const {
    createBatch,
    validateBatch,
    processBatch,
    currentBatch,
    isProcessing,
    progress
  } = usePayrollBatch()

  const approvedTimesheets = useMemo(() => 
    timesheets.filter(ts => ts.status === 'approved'),
    [timesheets]
  )

  const workersWithTimesheets = useMemo(() => {
    const workerMap = new Map()
    
    approvedTimesheets.forEach(ts => {
      if (!workerMap.has(ts.workerId)) {
        const worker = workers.find(w => w.id === ts.workerId)
        workerMap.set(ts.workerId, {
          ...worker,
          timesheets: [],
          totalHours: 0,
          totalAmount: 0
        })
      }
      
      const workerData = workerMap.get(ts.workerId)
      workerData.timesheets.push(ts)
      workerData.totalHours += ts.totalHours || ts.hours || 0
      workerData.totalAmount += ts.total || ts.amount || 0
    })
    
    return Array.from(workerMap.values())
  }, [approvedTimesheets, workers])

  const selectedWorkerData = useMemo(() => 
    workersWithTimesheets.filter(w => selectedWorkers.includes(w.id)),
    [workersWithTimesheets, selectedWorkers]
  )

  const batchTotals = useMemo(() => ({
    workers: selectedWorkerData.length,
    timesheets: selectedWorkerData.reduce((sum, w) => sum + w.timesheets.length, 0),
    hours: selectedWorkerData.reduce((sum, w) => sum + w.totalHours, 0),
    amount: selectedWorkerData.reduce((sum, w) => sum + w.totalAmount, 0)
  }), [selectedWorkerData])

  const handleToggleWorker = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    )
  }

  const handleSelectAll = () => {
    if (selectedWorkers.length === workersWithTimesheets.length) {
      setSelectedWorkers([])
    } else {
      setSelectedWorkers(workersWithTimesheets.map(w => w.id))
    }
  }

  const handleValidate = async () => {
    if (selectedWorkers.length === 0) {
      toast.error('Please select at least one worker')
      return
    }

    const batch = await createBatch(selectedWorkerData)
    const validation = await validateBatch(batch)
    
    if (validation.hasErrors) {
      setShowValidation(true)
      toast.warning(`Validation found ${validation.errors.length} issue(s)`)
    } else {
      toast.success('Batch validation passed')
      setShowPreview(true)
    }
  }

  const handleProcess = async () => {
    if (!currentBatch) return

    try {
      const result = await processBatch(currentBatch)
      toast.success('Payroll batch submitted for approval')
      onBatchComplete?.(result)
      setShowPreview(false)
      setSelectedWorkers([])
    } catch (error) {
      toast.error('Failed to process payroll batch')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'secondary',
      processing: 'default',
      approved: 'default',
      rejected: 'destructive',
      completed: 'default'
    }
    
    const colors: Record<string, string> = {
      pending: 'bg-warning/10 text-warning-foreground border-warning/30',
      processing: 'bg-accent/10 text-accent-foreground border-accent/30',
      approved: 'bg-success/10 text-success-foreground border-success/30',
      rejected: 'bg-destructive/10 text-destructive-foreground border-destructive/30',
      completed: 'bg-success/10 text-success-foreground border-success/30'
    }
    
    return (
      <Badge variant={variants[status] || 'secondary'} className={colors[status]}>
        {status}
      </Badge>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payroll Batch Processing</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedWorkers.length === workersWithTimesheets.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                onClick={handleValidate}
                disabled={selectedWorkers.length === 0}
              >
                <CheckCircle className="mr-2" />
                Validate & Process ({selectedWorkers.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedWorkers.length > 0 && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <Grid cols={4} gap={4}>
                <div>
                  <div className="text-sm text-muted-foreground">Workers</div>
                  <div className="text-2xl font-semibold">{batchTotals.workers}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Timesheets</div>
                  <div className="text-2xl font-semibold">{batchTotals.timesheets}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                  <div className="text-2xl font-semibold">{batchTotals.hours.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="text-2xl font-semibold">£{batchTotals.amount.toLocaleString()}</div>
                </div>
              </Grid>
            </div>
          )}

          <div className="space-y-2">
            {workersWithTimesheets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto mb-4" size={48} />
                <p>No workers with approved timesheets available for processing</p>
              </div>
            ) : (
              workersWithTimesheets.map((worker) => (
                <Card key={worker.id} className="overflow-hidden">
                  <div className="p-4 flex items-start gap-4">
                    <Checkbox
                      checked={selectedWorkers.includes(worker.id)}
                      onCheckedChange={() => handleToggleWorker(worker.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium">{worker.name}</div>
                          <div className="text-sm text-muted-foreground">{worker.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">£{worker.totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{worker.totalHours.toFixed(1)} hours</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{worker.timesheets.length} timesheet{worker.timesheets.length !== 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>Payment Method: {worker.paymentMethod || 'PAYE'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Payroll Batch</DialogTitle>
            <DialogDescription>
              Review the payroll batch before submitting for approval
            </DialogDescription>
          </DialogHeader>

          {currentBatch && (
            <Stack spacing={4}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Batch Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataList
                    items={[
                      { label: 'Batch ID', value: currentBatch.id },
                      { label: 'Period', value: `${currentBatch.periodStart} to ${currentBatch.periodEnd}` },
                      { label: 'Workers', value: currentBatch.workers.length },
                      { label: 'Total Amount', value: `£${currentBatch.totalAmount.toLocaleString()}` },
                      { label: 'Status', value: getStatusBadge(currentBatch.status) }
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Worker Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentBatch.workers.map((worker: any) => (
                      <div key={worker.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{worker.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {worker.timesheetCount} timesheet{worker.timesheetCount !== 1 ? 's' : ''} • {worker.totalHours.toFixed(1)} hours
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">£{worker.grossPay.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Net: £{worker.netPay.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {isProcessing && (
                <Card>
                  <CardContent className="pt-6">
                    <Stack spacing={2}>
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing batch...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} />
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleProcess} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Clock className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2" />
                  Submit for Approval
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showValidation} onOpenChange={setShowValidation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warning className="text-warning" />
              Validation Results
            </DialogTitle>
            <DialogDescription>
              Review validation issues before proceeding
            </DialogDescription>
          </DialogHeader>

          {currentBatch?.validation && (
            <Stack spacing={3}>
              {currentBatch.validation.errors?.map((error: any, index: number) => (
                <Card key={index} className="border-destructive/50">
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <XCircle className="text-destructive flex-shrink-0" />
                      <div>
                        <div className="font-medium">{error.worker}</div>
                        <div className="text-sm text-muted-foreground">{error.message}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {currentBatch.validation.warnings?.map((warning: any, index: number) => (
                <Card key={index} className="border-warning/50">
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <Warning className="text-warning flex-shrink-0" />
                      <div>
                        <div className="font-medium">{warning.worker}</div>
                        <div className="text-sm text-muted-foreground">{warning.message}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowValidation(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
