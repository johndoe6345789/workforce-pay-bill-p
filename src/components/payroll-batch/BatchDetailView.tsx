import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PayrollApprovalWorkflow } from '@/components/PayrollApprovalWorkflow'
import type { PayrollBatch } from '@/hooks/use-payroll-batch'

interface Props {
  batch: PayrollBatch
  currentUserRole: string
  currentUserName: string
  onBack: () => void
  onRefresh: () => void
}

export function BatchDetailView({ batch, currentUserRole, currentUserName, onBack, onRefresh }: Props) {
  return (
    <div className="space-y-6">
      <div><Button variant="outline" onClick={onBack}>← Back to List</Button></div>
      <PayrollApprovalWorkflow batch={batch} currentUserRole={currentUserRole} currentUserName={currentUserName} onApprove={onRefresh} onReject={onRefresh} />
      <Card>
        <CardHeader><CardTitle>Batch Workers</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {batch.workers.map(worker => (
              <Card key={worker.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{worker.name}</div>
                      <div className="text-sm text-muted-foreground">{worker.role}</div>
                      <div className="text-sm text-muted-foreground mt-1">{worker.timesheetCount} timesheet{worker.timesheetCount !== 1 ? 's' : ''} • {worker.totalHours.toFixed(1)} hours</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">£{worker.grossPay.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Net: £{worker.netPay.toLocaleString()}</div>
                    </div>
                  </div>
                  {worker.deductions.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm font-medium mb-2">Deductions</div>
                      <div className="space-y-1">
                        {worker.deductions.map((d, i) => (
                          <div key={i} className="flex justify-between text-sm text-muted-foreground">
                            <span>{d.description}</span><span>£{d.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
