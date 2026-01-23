import { useState } from 'react'
import {
  Plus,
  CurrencyDollar,
  Download
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PayrollDetailDialog } from '@/components/PayrollDetailDialog'
import { OneClickPayroll } from '@/components/OneClickPayroll'
import type { PayrollRun, Timesheet } from '@/lib/types'

interface PayrollViewProps {
  payrollRuns: PayrollRun[]
  timesheets: Timesheet[]
  onPayrollComplete: (run: PayrollRun) => void
}

export function PayrollView({ payrollRuns, timesheets, onPayrollComplete }: PayrollViewProps) {
  const [viewingPayroll, setViewingPayroll] = useState<PayrollRun | null>(null)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Payroll Processing</h2>
          <p className="text-muted-foreground mt-1">Manage payroll runs and worker payments</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          Run Payroll
        </Button>
      </div>

      <OneClickPayroll 
        timesheets={timesheets}
        onPayrollComplete={onPayrollComplete}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Next Pay Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">22 Jan 2025</div>
            <p className="text-sm text-muted-foreground mt-1">Weekly run in 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">12 timesheets</div>
            <p className="text-sm text-muted-foreground mt-1">Must be approved for payroll</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Last Run Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">£28,900</div>
            <p className="text-sm text-muted-foreground mt-1">45 workers paid</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {payrollRuns.map(run => (
          <Card 
            key={run.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setViewingPayroll(run)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <CurrencyDollar size={20} weight="fill" className="text-primary" />
                    <h3 className="font-semibold text-lg">Payroll Run</h3>
                    <Badge variant={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'destructive' : 'warning'}>
                      {run.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Period Ending</p>
                      <p className="font-medium">{new Date(run.periodEnding).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Workers</p>
                      <p className="font-medium">{run.workersCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-semibold font-mono text-lg">£{run.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Processed</p>
                      <p className="font-medium">
                        {run.processedDate ? new Date(run.processedDate).toLocaleDateString() : 'Not yet'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="outline" onClick={() => setViewingPayroll(run)}>
                    View Details
                  </Button>
                  {run.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      <Download size={16} className="mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {payrollRuns.length === 0 && (
          <Card className="p-12 text-center">
            <CurrencyDollar size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payroll runs yet</h3>
            <p className="text-muted-foreground">Create your first payroll run to get started</p>
          </Card>
        )}
      </div>

      <PayrollDetailDialog
        payrollRun={viewingPayroll}
        open={viewingPayroll !== null}
        onOpenChange={(open) => {
          if (!open) setViewingPayroll(null)
        }}
      />
    </div>
  )
}
