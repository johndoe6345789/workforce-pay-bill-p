import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTimeTracking } from '@/hooks/use-time-tracking'
import { useTimesheetsCrud } from '@/hooks/use-timesheets-crud'
import { useTranslation } from '@/hooks/use-translation'
import type { Timesheet, TimesheetStatus } from '@/lib/types'
import type { FilterField } from '@/components/AdvancedSearch'
import { computeTimesheetStats, computeValidationStats } from './useTimesheetsView.stats'
import { useTimesheetsActions } from './useTimesheetsActions'

export function useTimesheetsView() {
  const { t } = useTranslation()
  const { validateTimesheet } = useTimeTracking()
  const { timesheets, createTimesheet, updateTimesheet, deleteTimesheet, bulkCreateTimesheets, lastUpdated } =
    useTimesheetsCrud({ liveRefresh: true, pollingInterval: 1000 })

  const [statusFilter, setStatusFilter] = useState<'all' | TimesheetStatus>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null)
  const [viewingTimesheet, setViewingTimesheet] = useState<Timesheet | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [filteredTimesheets, setFilteredTimesheets] = useState<Timesheet[]>([])
  const [formData, setFormData] = useState({ workerName: '', clientName: '', hours: '', rate: '', weekEnding: '' })
  const [csvData, setCsvData] = useState('')

  const timesheetFields: FilterField[] = useMemo(() => [
    { name: 'workerName', label: t('timesheets.workerName'), type: 'text' },
    { name: 'clientName', label: t('timesheets.clientName'), type: 'text' },
    { name: 'status', label: t('timesheets.status.all'), type: 'select', options: [
      { value: 'pending', label: t('timesheets.status.pending') },
      { value: 'approved', label: t('timesheets.status.approved') },
      { value: 'rejected', label: t('timesheets.status.rejected') },
    ]},
    { name: 'hours', label: t('timesheets.hours'), type: 'number' },
    { name: 'amount', label: t('timesheets.amount'), type: 'number' },
    { name: 'weekEnding', label: t('timesheets.weekEnding'), type: 'date' },
  ], [t])

  const timesheetsToFilter = useMemo(() => {
    return timesheets.filter(ts => statusFilter === 'all' || ts.status === statusFilter)
  }, [timesheets, statusFilter])

  useEffect(() => { setFilteredTimesheets(timesheetsToFilter) }, [timesheetsToFilter])

  const handleResultsChange = useCallback((results: Timesheet[]) => { setFilteredTimesheets(results) }, [])

  const timesheetsWithValidation = useMemo(() => {
    return filteredTimesheets.map(ts => {
      const validation = validateTimesheet(ts)
      return { ...ts, validationErrors: validation.errors, validationWarnings: validation.warnings, isValid: validation.isValid }
    })
  }, [filteredTimesheets, validateTimesheet])

  const validationStats = useMemo(() => computeValidationStats(timesheetsWithValidation), [timesheetsWithValidation])
  const { pendingCount, approvedCount, totalHours, totalValue, approvalRate } = useMemo(
    () => computeTimesheetStats(filteredTimesheets),
    [filteredTimesheets]
  )

  const actions = useTimesheetsActions({
    createTimesheet, updateTimesheet, deleteTimesheet, bulkCreateTimesheets,
    timesheets, setIsCreateDialogOpen, setIsBulkImportOpen, setSelectedTimesheet,
  })

  return {
    t, timesheets, lastUpdated,
    statusFilter, setStatusFilter,
    isCreateDialogOpen, setIsCreateDialogOpen,
    isBulkImportOpen, setIsBulkImportOpen,
    selectedTimesheet, setSelectedTimesheet,
    viewingTimesheet, setViewingTimesheet,
    showAnalytics, setShowAnalytics,
    filteredTimesheets, timesheetsToFilter,
    formData, setFormData, csvData, setCsvData,
    timesheetsWithValidation, validationStats,
    pendingCount, approvedCount, totalHours, totalValue, approvalRate,
    timesheetFields,
    handleResultsChange,
    ...actions,
  }
}
