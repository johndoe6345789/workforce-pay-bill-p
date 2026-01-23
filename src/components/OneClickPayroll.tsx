import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  CurrencyDollar, 
  CheckCircle, 
  Warning,
  Calendar,
  Users,
  Calculator,
  ArrowRight
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/use-permissions'
import type { Timesheet, PayrollRun } from '@/lib/types'

interface OneClickPayrollProps {
  timesheets: Timesheet[]
  onPayrollComplete: (run: PayrollRun) => void
}

export function OneClickPayroll({ timesheets, onPayrollComplete }: OneClickPayrollProps) {
  const { hasPermission } = usePermissions()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [payrollPreview, setPayrollPreview] = useState<PayrollPreviewData | null>(null)

  const approvedTimesheets = timesheets.filter(t => t.status === 'approved')
  const uniqueWorkers = new Set(approvedTimesheets.map(t => t.workerId)).size
  const totalAmount = approvedTimesheets.reduce((sum, t) => sum + t.amount, 0)

  const generatePayrollPreview = () => {
    const workerPayments = new Map<string, { name: string; amount: number; hours: number; count: number }>()

    approvedTimesheets.forEach(ts => {
      const existing = workerPayments.get(ts.workerId) || { name: ts.workerName, amount: 0, hours: 0, count: 0 }
      workerPayments.set(ts.workerId, {
        name: ts.workerName,
        amount: existing.amount + ts.amount,
        hours: existing.hours + ts.hours,
        count: existing.count + 1
      })
    })

    setPayrollPreview({
      workers: Array.from(workerPayments.entries()).map(([id, data]) => ({
        workerId: id,
        workerName: data.name,
        amount: data.amount,
        hours: data.hours,
        timesheetCount: data.count
      })),
      totalAmount,
      totalWorkers: uniqueWorkers,
      totalTimesheets: approvedTimesheets.length
    })

    setShowConfirmation(true)
  }

  const processPayroll = async () => {
    setIsProcessing(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const newPayrollRun: PayrollRun = {
      id: `PR-${Date.now()}`,
      periodEnding: new Date().toISOString().split('T')[0],
      workersCount: uniqueWorkers,
      totalAmount,
      status: 'completed',
      processedDate: new Date().toISOString()
    }

    onPayrollComplete(newPayrollRun)

    setIsProcessing(false)
    setShowConfirmation(false)
    toast.success(`Payroll processed: £${totalAmount.toLocaleString()} paid to ${uniqueWorkers} workers`)
  }

  if (approvedTimesheets.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CurrencyDollar size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No approved timesheets</h3>
          <p className="text-muted-foreground">Approve timesheets to run payroll</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-l-4 border-accent/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyDollar size={24} className="text-accent" weight="fill" />
            One-Click Payroll
          </CardTitle>
          <CardDescription>
            Process payroll instantly from approved timesheets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users size={18} />
                <span className="text-sm">Workers</span>
              </div>
              <div className="text-2xl font-semibold font-mono">{uniqueWorkers}</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <CheckCircle size={18} />
                <span className="text-sm">Timesheets</span>
              </div>
              <div className="text-2xl font-semibold font-mono">{approvedTimesheets.length}</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calculator size={18} />
                <span className="text-sm">Total Amount</span>
              </div>
              <div className="text-2xl font-semibold font-mono">£{totalAmount.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
            <CheckCircle size={24} className="text-accent" weight="fill" />
            <div className="flex-1">
              <p className="font-medium">Ready to process</p>
              <p className="text-sm text-muted-foreground">
                All timesheets approved and validated
              </p>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={generatePayrollPreview}
            disabled={!hasPermission('payroll.process')}
          >
            <CurrencyDollar size={20} className="mr-2" />
            Process Payroll Now
            <ArrowRight size={20} className="ml-2" />
          </Button>
          {!hasPermission('payroll.process') && (
            <p className="text-sm text-muted-foreground text-center">
              You don't have permission to process payroll
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Payroll Processing</DialogTitle>
            <DialogDescription>
              Review payment details before processing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-semibold font-mono">{payrollPreview?.totalWorkers}</div>
                <div className="text-sm text-muted-foreground mt-1">Workers</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-semibold font-mono">{payrollPreview?.totalTimesheets}</div>
                <div className="text-sm text-muted-foreground mt-1">Timesheets</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-semibold font-mono">£{payrollPreview?.totalAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Total</div>
              </div>
            </div>

            <Separator />

            <div className="max-h-96 overflow-y-auto space-y-2">
              {payrollPreview?.workers.map((worker) => (
                <div key={worker.workerId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{worker.workerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {worker.hours} hours • {worker.timesheetCount} timesheet{worker.timesheetCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold font-mono text-lg">£{worker.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center gap-2 p-4 bg-warning/10 rounded-lg">
              <Warning size={20} className="text-warning" />
              <p className="text-sm">
                This action will generate payment files and mark timesheets as processed. This cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={processPayroll} disabled={isProcessing}>
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  Confirm & Process
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface PayrollPreviewData {
  workers: {
    workerId: string
    workerName: string
    amount: number
    hours: number
    timesheetCount: number
  }[]
  totalAmount: number
  totalWorkers: number
  totalTimesheets: number
}
