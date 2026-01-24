import { useState, useMemo } from 'react'
import {
  Eye,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  FunnelSimple,
  CalendarBlank,
  CurrencyDollar,
  Users
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { PayrollApprovalWorkflow } from '@/components/PayrollApprovalWorkflow'
import { usePayrollBatch, type PayrollBatch } from '@/hooks/use-payroll-batch'
import { format } from 'date-fns'

interface PayrollBatchListProps {
  currentUserRole: string
  currentUserName: string
}

export function PayrollBatchList({ currentUserRole, currentUserName }: PayrollBatchListProps) {
  const [selectedBatch, setSelectedBatch] = useState<PayrollBatch | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const { batches } = usePayrollBatch()

  const filteredBatches = useMemo(() => {
    let filtered = batches

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b => 
        b.id.toLowerCase().includes(query) ||
        b.createdBy.toLowerCase().includes(query)
      )
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [batches, statusFilter, searchQuery])

  const getBatchStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      'draft': {
        label: 'Draft',
        className: 'bg-muted text-muted-foreground',
        icon: null
      },
      'pending-approval': {
        label: 'Pending Approval',
        className: 'bg-warning/10 text-warning-foreground border-warning/30',
        icon: Clock
      },
      'approved': {
        label: 'Approved',
        className: 'bg-success/10 text-success-foreground border-success/30',
        icon: CheckCircle
      },
      'rejected': {
        label: 'Rejected',
        className: 'bg-destructive/10 text-destructive-foreground border-destructive/30',
        icon: XCircle
      },
      'processing': {
        label: 'Processing',
        className: 'bg-accent/10 text-accent-foreground border-accent/30',
        icon: Clock
      },
      'completed': {
        label: 'Completed',
        className: 'bg-success/10 text-success-foreground border-success/30',
        icon: CheckCircle
      }
    }

    const config = statusConfig[status] || statusConfig.draft
    const Icon = config.icon

    return (
      <Badge className={config.className}>
        {Icon && <Icon className="mr-1" size={14} />}
        {config.label}
      </Badge>
    )
  }

  const getWorkflowProgress = (batch: PayrollBatch) => {
    if (!batch.approvalWorkflow) return null
    
    const { currentStep, totalSteps } = batch.approvalWorkflow
    return `${currentStep}/${totalSteps}`
  }

  if (selectedBatch) {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="outline" onClick={() => setSelectedBatch(null)}>
            ← Back to List
          </Button>
        </div>
        <PayrollApprovalWorkflow
          batch={selectedBatch}
          currentUserRole={currentUserRole}
          currentUserName={currentUserName}
          onApprove={() => {
            const updated = batches.find(b => b.id === selectedBatch.id)
            if (updated) setSelectedBatch(updated)
          }}
          onReject={() => {
            const updated = batches.find(b => b.id === selectedBatch.id)
            if (updated) setSelectedBatch(updated)
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle>Batch Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedBatch.workers.map((worker) => (
                <Card key={worker.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{worker.name}</div>
                        <div className="text-sm text-muted-foreground">{worker.role}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {worker.timesheetCount} timesheet{worker.timesheetCount !== 1 ? 's' : ''} • {worker.totalHours.toFixed(1)} hours
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">£{worker.grossPay.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Net: £{worker.netPay.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    {worker.deductions.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm font-medium mb-2">Deductions</div>
                        <div className="space-y-1">
                          {worker.deductions.map((deduction, index) => (
                            <div key={index} className="flex justify-between text-sm text-muted-foreground">
                              <span>{deduction.description}</span>
                              <span>£{deduction.amount.toFixed(2)}</span>
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payroll Batches</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending-approval">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredBatches.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="mx-auto mb-4" size={48} />
            <p>No payroll batches found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBatches.map((batch) => (
              <Card key={batch.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-4" onClick={() => setSelectedBatch(batch)}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium">{batch.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(batch.createdAt), 'PPp')}
                      </div>
                    </div>
                    {getBatchStatusBadge(batch.status)}
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Period</div>
                      <div className="flex items-center gap-1 text-sm">
                        <CalendarBlank size={14} className="text-muted-foreground" />
                        <span>{batch.periodStart}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Workers</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Users size={14} className="text-muted-foreground" />
                        <span>{batch.totalWorkers}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Amount</div>
                      <div className="flex items-center gap-1 text-sm">
                        <CurrencyDollar size={14} className="text-muted-foreground" />
                        <span>£{batch.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Progress</div>
                      <div className="text-sm">
                        {getWorkflowProgress(batch) || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm text-muted-foreground">
                      Created by {batch.createdBy}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2" />
                      View Details
                      <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
