import { useCallback } from 'react'
import { toast } from 'sonner'
import { usePermissions } from '@/hooks/use-permissions'
import { useTranslation } from '@/hooks/use-translation'
import type { Timesheet, TimesheetStatus, ShiftEntry } from '@/lib/types'

interface CrudDeps {
  createTimesheet: (data: unknown) => Promise<unknown>
  updateTimesheet: (id: string, data: unknown) => Promise<unknown>
  deleteTimesheet: (id: string) => Promise<unknown>
  bulkCreateTimesheets: (data: unknown[]) => Promise<unknown>
  timesheets: Timesheet[]
  setIsCreateDialogOpen: (v: boolean) => void
  setIsBulkImportOpen: (v: boolean) => void
  setSelectedTimesheet: (v: Timesheet | null) => void
}

export function useTimesheetsActions({
  createTimesheet, updateTimesheet, deleteTimesheet, bulkCreateTimesheets,
  timesheets, setIsCreateDialogOpen, setIsBulkImportOpen, setSelectedTimesheet,
}: CrudDeps) {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()

  const handleCreateTimesheet = useCallback(async (data: { workerName: string; clientName: string; hours: number; rate: number; weekEnding: string }) => {
    try {
      await createTimesheet({ workerId: `worker-${Date.now()}`, workerName: data.workerName, clientName: data.clientName, hours: data.hours, rate: data.rate, amount: data.hours * data.rate, weekEnding: data.weekEnding, status: 'pending', submittedDate: new Date().toISOString(), shifts: [] })
      toast.success(t('timesheets.createSuccess'))
      setIsCreateDialogOpen(false)
    } catch { toast.error(t('timesheets.createError')) }
  }, [createTimesheet, t, setIsCreateDialogOpen])

  const handleCreateDetailedTimesheet = useCallback(async (data: { workerName: string; clientName: string; weekEnding: string; shifts: ShiftEntry[]; totalHours: number; totalAmount: number; baseRate: number }) => {
    try {
      await createTimesheet({ workerId: `worker-${Date.now()}`, workerName: data.workerName, clientName: data.clientName, hours: data.totalHours, rate: data.baseRate, amount: data.totalAmount, weekEnding: data.weekEnding, status: 'pending', submittedDate: new Date().toISOString(), shifts: data.shifts })
      toast.success(t('timesheets.createDetailedSuccess'))
      setIsCreateDialogOpen(false)
    } catch { toast.error(t('timesheets.createDetailedError')) }
  }, [createTimesheet, t, setIsCreateDialogOpen])

  const handleBulkImport = useCallback(async (csvRaw: string) => {
    try {
      const lines = csvRaw.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      const timesheetsData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const row: Record<string, string> = {}
        headers.forEach((h, i) => { row[h] = values[i] })
        return { workerId: row.workerId || `worker-${Date.now()}-${Math.random()}`, workerName: row.workerName || row.worker, clientName: row.clientName || row.client, hours: parseFloat(row.hours) || 0, rate: parseFloat(row.rate) || 0, amount: parseFloat(row.amount) || (parseFloat(row.hours) * parseFloat(row.rate)), weekEnding: row.weekEnding, status: 'pending' as TimesheetStatus, submittedDate: new Date().toISOString(), shifts: [] }
      })
      await bulkCreateTimesheets(timesheetsData)
      toast.success(t('timesheets.importSuccess', { count: timesheetsData.length }))
      setIsBulkImportOpen(false)
    } catch { toast.error(t('timesheets.importError')) }
  }, [bulkCreateTimesheets, t, setIsBulkImportOpen])

  const handleApprove = useCallback(async (id: string) => {
    if (!hasPermission('timesheets.approve')) { toast.error(t('timesheets.noPermissionApprove')); return }
    try { await updateTimesheet(id, { status: 'approved', approvedDate: new Date().toISOString() }); toast.success(t('timesheets.approveSuccess')) }
    catch { toast.error(t('timesheets.approveError')) }
  }, [updateTimesheet, hasPermission, t])

  const handleReject = useCallback(async (id: string) => {
    if (!hasPermission('timesheets.approve')) { toast.error(t('timesheets.noPermissionReject')); return }
    try { await updateTimesheet(id, { status: 'rejected' }); toast.error(t('timesheets.rejectSuccess')) }
    catch { toast.error(t('timesheets.rejectError')) }
  }, [updateTimesheet, hasPermission, t])

  const handleAdjust = useCallback(async (timesheetId: string, adjustment: unknown) => {
    if (!hasPermission('timesheets.edit')) { toast.error(t('timesheets.noPermissionEdit')); return }
    try { await updateTimesheet(timesheetId, adjustment); toast.success(t('timesheets.adjustSuccess')); setSelectedTimesheet(null) }
    catch { toast.error(t('timesheets.adjustError')) }
  }, [updateTimesheet, hasPermission, t, setSelectedTimesheet])

  const handleTimeAndRateAdjustment = useCallback(async (adjustment: { timesheetId: string; workerId: string; workerName: string; clientName: string; originalHours: number; originalRate: number; adjustedHours?: number; adjustedRate?: number; adjustmentReason: string; adjustmentType: 'time' | 'rate' | 'both'; approvalRequired: boolean; notes?: string }) => {
    if (!hasPermission('timesheets.edit')) { toast.error(t('timesheets.noPermissionEdit')); return }
    try {
      const current = timesheets.find(ts => ts.id === adjustment.timesheetId)
      const adjustmentRecord = { id: `adj-${Date.now()}`, adjustmentDate: new Date().toISOString(), adjustedBy: 'Current User', previousHours: adjustment.originalHours, newHours: adjustment.adjustedHours ?? adjustment.originalHours, previousRate: adjustment.originalRate, newRate: adjustment.adjustedRate ?? adjustment.originalRate, reason: adjustment.adjustmentReason, notes: adjustment.notes, requiresApproval: adjustment.approvalRequired, status: adjustment.approvalRequired ? 'pending_approval' : 'applied' }
      const updates: Record<string, unknown> = { adjustments: [...((current as Record<string, unknown[]> | undefined)?.adjustments || []), adjustmentRecord] }
      if (adjustment.adjustedHours !== undefined) updates.hours = adjustment.adjustedHours
      if (adjustment.adjustedRate !== undefined) updates.rate = adjustment.adjustedRate
      if (adjustment.adjustedHours !== undefined || adjustment.adjustedRate !== undefined) { updates.amount = (adjustment.adjustedHours ?? adjustment.originalHours) * (adjustment.adjustedRate ?? adjustment.originalRate) }
      if (adjustment.approvalRequired) updates.status = 'pending'
      await updateTimesheet(adjustment.timesheetId, updates)
      toast.success(adjustment.approvalRequired ? t('timesheets.adjustmentSubmitted') : t('timesheets.adjustmentApplied'))
    } catch { toast.error(t('timesheets.adjustmentError')) }
  }, [updateTimesheet, hasPermission, timesheets, t])

  const handleDelete = useCallback(async (id: string) => {
    if (!hasPermission('timesheets.delete')) { toast.error(t('timesheets.noPermissionDelete')); return }
    try { await deleteTimesheet(id); toast.success(t('timesheets.deleteSuccess')) }
    catch { toast.error(t('timesheets.deleteError')) }
  }, [deleteTimesheet, hasPermission, t])

  return {
    handleCreateTimesheet, handleCreateDetailedTimesheet, handleBulkImport,
    handleApprove, handleReject, handleAdjust, handleTimeAndRateAdjustment, handleDelete,
  }
}
