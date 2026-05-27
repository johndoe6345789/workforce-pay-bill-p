import { useState, useMemo } from 'react'
import { usePayrollBatch, type PayrollBatch } from '@/hooks/use-payroll-batch'

export function usePayrollBatchList() {
  const { batches } = usePayrollBatch()
  const [selectedBatch, setSelectedBatch] = useState<PayrollBatch | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBatches = useMemo(() => {
    let filtered = batches
    if (statusFilter !== 'all') filtered = filtered.filter(b => b.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(b => b.id.toLowerCase().includes(q) || b.createdBy.toLowerCase().includes(q))
    }
    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [batches, statusFilter, searchQuery])

  const getWorkflowProgress = (batch: PayrollBatch) => {
    if (!batch.approvalWorkflow) return null
    return `${batch.approvalWorkflow.currentStep}/${batch.approvalWorkflow.totalSteps}`
  }

  const refreshSelected = () => {
    if (!selectedBatch) return
    const updated = batches.find(b => b.id === selectedBatch.id)
    if (updated) setSelectedBatch(updated)
  }

  return { batches, filteredBatches, selectedBatch, setSelectedBatch, statusFilter, setStatusFilter, searchQuery, setSearchQuery, getWorkflowProgress, refreshSelected }
}
