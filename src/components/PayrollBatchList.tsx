import { Clock } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { usePayrollBatchList } from '@/hooks/usePayrollBatchList'
import { BatchCard } from '@/components/payroll-batch/BatchCard'
import { BatchDetailView } from '@/components/payroll-batch/BatchDetailView'

interface Props { currentUserRole: string; currentUserName: string }

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending-approval', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
]

export function PayrollBatchList({ currentUserRole, currentUserName }: Props) {
  const vm = usePayrollBatchList()

  if (vm.selectedBatch) {
    return <BatchDetailView batch={vm.selectedBatch} currentUserRole={currentUserRole} currentUserName={currentUserName} onBack={() => vm.setSelectedBatch(null)} onRefresh={vm.refreshSelected} />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payroll Batches</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={vm.statusFilter} onValueChange={vm.setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Search batches..." value={vm.searchQuery} onChange={e => vm.setSearchQuery(e.target.value)} className="w-[200px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {vm.filteredBatches.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="mx-auto mb-4" size={48} />
            <p>No payroll batches found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vm.filteredBatches.map(batch => (
              <BatchCard key={batch.id} batch={batch} progress={vm.getWorkflowProgress(batch)} onClick={() => vm.setSelectedBatch(batch)} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
