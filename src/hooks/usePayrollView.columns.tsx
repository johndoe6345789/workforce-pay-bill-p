import { useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, FileText, Download, Trash } from '@phosphor-icons/react'
import type { TableColumn } from '@/hooks/use-advanced-table'

interface UsePayrollColumnsParams {
  t: (key: string, opts?: Record<string, unknown>) => string
  setViewingPayroll: (row: Record<string, unknown> | null) => void
  setSelectedPayrollForPAYE: (id: string | null) => void
  setShowCreatePAYE: (show: boolean) => void
  handleDeletePayrollRun: (id: string) => Promise<void>
  viewingPayroll: { id: string } | null
}

export function usePayrollColumns({
  t, setViewingPayroll, setSelectedPayrollForPAYE,
  setShowCreatePAYE, handleDeletePayrollRun,
}: UsePayrollColumnsParams): TableColumn<Record<string, unknown>>[] {
  const stableDelete = useCallback(
    (id: string) => handleDeletePayrollRun(id),
    [handleDeletePayrollRun]
  )

  return useMemo(() => [
    { key: 'periodEnding', label: t('payroll.periodEnding'), sortable: true, render: (v) => new Date(v as string).toLocaleDateString() },
    { key: 'workersCount', label: t('payroll.workers'), sortable: true },
    { key: 'totalAmount', label: t('payroll.totalAmount'), sortable: true, render: (v) => <span className="font-mono font-semibold">£{(v as number).toLocaleString()}</span> },
    { key: 'processedDate', label: t('payroll.processed'), sortable: true, render: (v) => v ? new Date(v as string).toLocaleDateString() : t('payroll.notYet') },
    { key: 'status', label: t('common.status'), sortable: true, render: (v) => <Badge variant={v === 'completed' ? 'success' : v === 'failed' ? 'destructive' : 'warning'}>{t(`payroll.status.${v}`)}</Badge> },
    {
      key: 'id', label: t('common.actions'), sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => setViewingPayroll(row as Record<string, unknown>)} title={t('payroll.viewDetails')}><Eye size={16} /></Button>
          {row.status === 'completed' && (
            <>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary" onClick={() => { setSelectedPayrollForPAYE(row.id as string); setShowCreatePAYE(true) }} title={t('payroll.createPAYE')}><FileText size={16} /></Button>
              <Button size="sm" variant="ghost" title={t('payroll.export')}><Download size={16} /></Button>
            </>
          )}
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => stableDelete(row.id as string)} title={t('common.delete')}><Trash size={16} /></Button>
        </div>
      ),
    },
  ], [t, setViewingPayroll, setSelectedPayrollForPAYE, setShowCreatePAYE, stableDelete])
}
