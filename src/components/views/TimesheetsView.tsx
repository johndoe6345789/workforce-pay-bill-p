import { useState, useMemo, useEffect, useCallback } from 'react'
import { 
  Download, 
  Funnel, 
  ChartBar, 
  Warning, 
  Clock, 
  CheckCircle,
  XCircle,
  FileText,
  CalendarBlank,
  CurrencyDollar,
  TrendUp,
  Trash
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { MetricCard } from '@/components/ui/metric-card'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { EmptyState } from '@/components/ui/empty-state'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { TimesheetDetailDialog } from '@/components/TimesheetDetailDialog'
import { TimeAndRateAdjustmentWizard } from '@/components/TimeAndRateAdjustmentWizard'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { TimesheetCreateDialogs } from '@/components/timesheets/TimesheetCreateDialogs'
import { TimesheetTabs } from '@/components/timesheets/TimesheetTabs'
import { LiveRefreshIndicator } from '@/components/LiveRefreshIndicator'
import { useTimeTracking } from '@/hooks/use-time-tracking'
import { useTimesheetsCrud } from '@/hooks/use-timesheets-crud'
import { usePermissions } from '@/hooks/use-permissions'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import type { Timesheet, TimesheetStatus, ShiftEntry } from '@/lib/types'

interface TimesheetsViewProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onCreateInvoice: (id: string) => void
}

export function TimesheetsView({ 
  searchQuery, 
  setSearchQuery, 
  onCreateInvoice
}: TimesheetsViewProps) {
  const { t } = useTranslation()
  const [statusFilter, setStatusFilter] = useState<'all' | TimesheetStatus>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null)
  const [viewingTimesheet, setViewingTimesheet] = useState<Timesheet | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  const { hasPermission } = usePermissions()
  
  const { 
    validateTimesheet, 
    analyzeWorkingTime,
    calculateShiftHours,
    determineShiftType
  } = useTimeTracking()
  
  const {
    timesheets,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet,
    bulkCreateTimesheets,
    lastUpdated
  } = useTimesheetsCrud({ liveRefresh: true, pollingInterval: 1000 })
  
  const handleCreateTimesheet = useCallback(async (data: {
    workerName: string
    clientName: string
    hours: number
    rate: number
    weekEnding: string
  }) => {
    try {
      await createTimesheet({
        workerId: `worker-${Date.now()}`,
        workerName: data.workerName,
        clientName: data.clientName,
        hours: data.hours,
        rate: data.rate,
        amount: data.hours * data.rate,
        weekEnding: data.weekEnding,
        status: 'pending',
        submittedDate: new Date().toISOString(),
        shifts: []
      })
      toast.success(t('timesheets.createSuccess'))
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast.error(t('timesheets.createError'))
      console.error('Error creating timesheet:', error)
    }
  }, [createTimesheet, t])

  const handleCreateDetailedTimesheet = useCallback(async (data: {
    workerName: string
    clientName: string
    weekEnding: string
    shifts: ShiftEntry[]
    totalHours: number
    totalAmount: number
    baseRate: number
  }) => {
    try {
      await createTimesheet({
        workerId: `worker-${Date.now()}`,
        workerName: data.workerName,
        clientName: data.clientName,
        hours: data.totalHours,
        rate: data.baseRate,
        amount: data.totalAmount,
        weekEnding: data.weekEnding,
        status: 'pending',
        submittedDate: new Date().toISOString(),
        shifts: data.shifts
      })
      toast.success(t('timesheets.createDetailedSuccess'))
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast.error(t('timesheets.createDetailedError'))
      console.error('Error creating detailed timesheet:', error)
    }
  }, [createTimesheet, t])

  const handleBulkImport = useCallback(async (csvData: string) => {
    try {
      const lines = csvData.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const timesheetsData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const timesheet: any = {}
        
        headers.forEach((header, index) => {
          timesheet[header] = values[index]
        })
        
        return {
          workerId: timesheet.workerId || `worker-${Date.now()}-${Math.random()}`,
          workerName: timesheet.workerName || timesheet.worker,
          clientName: timesheet.clientName || timesheet.client,
          hours: parseFloat(timesheet.hours) || 0,
          rate: parseFloat(timesheet.rate) || 0,
          amount: parseFloat(timesheet.amount) || (parseFloat(timesheet.hours) * parseFloat(timesheet.rate)),
          weekEnding: timesheet.weekEnding,
          status: 'pending' as TimesheetStatus,
          submittedDate: new Date().toISOString(),
          shifts: []
        }
      })
      
      await bulkCreateTimesheets(timesheetsData)
      toast.success(t('timesheets.importSuccess', { count: timesheetsData.length }))
      setIsBulkImportOpen(false)
    } catch (error) {
      toast.error(t('timesheets.importError'))
      console.error('Error importing timesheets:', error)
    }
  }, [bulkCreateTimesheets, t])

  const handleApprove = useCallback(async (id: string) => {
    if (!hasPermission('timesheets.approve')) {
      toast.error(t('timesheets.noPermissionApprove'))
      return
    }
    
    try {
      await updateTimesheet(id, {
        status: 'approved',
        approvedDate: new Date().toISOString()
      })
      toast.success(t('timesheets.approveSuccess'))
    } catch (error) {
      toast.error(t('timesheets.approveError'))
      console.error('Error approving timesheet:', error)
    }
  }, [updateTimesheet, hasPermission, t])

  const handleReject = useCallback(async (id: string) => {
    if (!hasPermission('timesheets.approve')) {
      toast.error(t('timesheets.noPermissionReject'))
      return
    }
    
    try {
      await updateTimesheet(id, {
        status: 'rejected'
      })
      toast.error(t('timesheets.rejectSuccess'))
    } catch (error) {
      toast.error(t('timesheets.rejectError'))
      console.error('Error rejecting timesheet:', error)
    }
  }, [updateTimesheet, hasPermission, t])

  const handleAdjust = useCallback(async (timesheetId: string, adjustment: any) => {
    if (!hasPermission('timesheets.edit')) {
      toast.error(t('timesheets.noPermissionEdit'))
      return
    }
    
    try {
      await updateTimesheet(timesheetId, adjustment)
      toast.success(t('timesheets.adjustSuccess'))
      setSelectedTimesheet(null)
    } catch (error) {
      toast.error(t('timesheets.adjustError'))
      console.error('Error adjusting timesheet:', error)
    }
  }, [updateTimesheet, hasPermission, t])

  const handleTimeAndRateAdjustment = useCallback(async (adjustment: {
    timesheetId: string
    workerId: string
    workerName: string
    clientName: string
    originalHours: number
    originalRate: number
    adjustedHours?: number
    adjustedRate?: number
    adjustmentReason: string
    adjustmentType: 'time' | 'rate' | 'both'
    approvalRequired: boolean
    notes?: string
  }) => {
    if (!hasPermission('timesheets.edit')) {
      toast.error(t('timesheets.noPermissionEdit'))
      return
    }
    
    try {
      const currentTimesheet = timesheets.find(t => t.id === adjustment.timesheetId)
      const adjustmentRecord: any = {
        id: `adj-${Date.now()}`,
        adjustmentDate: new Date().toISOString(),
        adjustedBy: 'Current User',
        previousHours: adjustment.originalHours,
        newHours: adjustment.adjustedHours ?? adjustment.originalHours,
        previousRate: adjustment.originalRate,
        newRate: adjustment.adjustedRate ?? adjustment.originalRate,
        reason: adjustment.adjustmentReason,
        notes: adjustment.notes,
        requiresApproval: adjustment.approvalRequired,
        status: adjustment.approvalRequired ? 'pending_approval' : 'applied'
      }

      const updates: any = {
        adjustments: [
          ...(currentTimesheet?.adjustments || []),
          adjustmentRecord
        ]
      }

      if (adjustment.adjustedHours !== undefined) {
        updates.hours = adjustment.adjustedHours
      }
      if (adjustment.adjustedRate !== undefined) {
        updates.rate = adjustment.adjustedRate
      }
      if (adjustment.adjustedHours !== undefined || adjustment.adjustedRate !== undefined) {
        const newHours = adjustment.adjustedHours ?? adjustment.originalHours
        const newRate = adjustment.adjustedRate ?? adjustment.originalRate
        updates.amount = newHours * newRate
      }

      if (adjustment.approvalRequired) {
        updates.status = 'pending'
      }

      await updateTimesheet(adjustment.timesheetId, updates)
      
      if (adjustment.approvalRequired) {
        toast.success(t('timesheets.adjustmentSubmitted'))
      } else {
        toast.success(t('timesheets.adjustmentApplied'))
      }
    } catch (error) {
      toast.error(t('timesheets.adjustmentError'))
      console.error('Error applying adjustment:', error)
    }
  }, [updateTimesheet, hasPermission, timesheets, t])

  const handleDelete = useCallback(async (id: string) => {
    if (!hasPermission('timesheets.delete')) {
      toast.error(t('timesheets.noPermissionDelete'))
      return
    }
    
    try {
      await deleteTimesheet(id)
      toast.success(t('timesheets.deleteSuccess'))
    } catch (error) {
      toast.error(t('timesheets.deleteError'))
      console.error('Error deleting timesheet:', error)
    }
  }, [deleteTimesheet, hasPermission, t])
  
  const timesheetsToFilter = useMemo(() => {
    return timesheets.filter(t => {
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      return matchesStatus
    })
  }, [timesheets, statusFilter])
  
  const [filteredTimesheets, setFilteredTimesheets] = useState<Timesheet[]>([])
  
  useEffect(() => {
    setFilteredTimesheets(timesheetsToFilter)
  }, [timesheetsToFilter])
  
  const handleResultsChange = useCallback((results: Timesheet[]) => {
    setFilteredTimesheets(results)
  }, [])

  const timesheetsWithValidation = useMemo(() => {
    return filteredTimesheets.map(ts => {
      const validation = validateTimesheet(ts)
      return {
        ...ts,
        validationErrors: validation.errors,
        validationWarnings: validation.warnings,
        isValid: validation.isValid
      }
    })
  }, [filteredTimesheets, validateTimesheet])

  const validationStats = useMemo(() => {
    const invalid = timesheetsWithValidation.filter(ts => !ts.isValid).length
    const withWarnings = timesheetsWithValidation.filter(ts => 
      ts.validationWarnings && ts.validationWarnings.length > 0
    ).length
    return { invalid, withWarnings }
  }, [timesheetsWithValidation])

  const [formData, setFormData] = useState({
    workerName: '',
    clientName: '',
    hours: '',
    rate: '',
    weekEnding: ''
  })
  const [csvData, setCsvData] = useState('')

  const timesheetFields: FilterField[] = [
    { name: 'workerName', label: t('timesheets.workerName'), type: 'text' },
    { name: 'clientName', label: t('timesheets.clientName'), type: 'text' },
    { name: 'status', label: t('timesheets.status.all'), type: 'select', options: [
      { value: 'pending', label: t('timesheets.status.pending') },
      { value: 'approved', label: t('timesheets.status.approved') },
      { value: 'rejected', label: t('timesheets.status.rejected') }
    ]},
    { name: 'hours', label: t('timesheets.hours'), type: 'number' },
    { name: 'amount', label: t('timesheets.amount'), type: 'number' },
    { name: 'weekEnding', label: t('timesheets.weekEnding'), type: 'date' }
  ]

  const pendingCount = filteredTimesheets.filter(ts => ts.status === 'pending').length
  const approvedCount = filteredTimesheets.filter(ts => ts.status === 'approved').length
  const totalHours = filteredTimesheets.reduce((sum, ts) => sum + ts.hours, 0)
  const totalValue = filteredTimesheets.reduce((sum, ts) => sum + ts.amount, 0)
  const approvalRate = filteredTimesheets.length > 0 
    ? (approvedCount / filteredTimesheets.length) * 100 
    : 0

  return (
    <Stack spacing={6}>
      <div className="flex items-center justify-between">
        <PageHeader
          title={t('timesheets.title')}
          description={t('timesheets.subtitle')}
          actions={
            <Stack direction="horizontal" spacing={2}>
              <Button 
                variant="outline" 
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                <ChartBar size={18} className="mr-2" />
                {showAnalytics ? t('timesheets.hideAnalytics') : t('timesheets.showAnalytics')}
              </Button>
              <TimesheetCreateDialogs
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                isBulkImportOpen={isBulkImportOpen}
                setIsBulkImportOpen={setIsBulkImportOpen}
                formData={formData}
                setFormData={setFormData}
                csvData={csvData}
                setCsvData={setCsvData}
                onCreateTimesheet={handleCreateTimesheet}
                onCreateDetailedTimesheet={handleCreateDetailedTimesheet}
                onBulkImport={handleBulkImport}
              />
            </Stack>
          }
        />
        <LiveRefreshIndicator 
          lastUpdated={lastUpdated} 
          pollingInterval={1000}
        />
      </div>

      {showAnalytics && (
        <>
          <Grid cols={4} gap={4} responsive>
            <MetricCard
              label={t('timesheets.totalTimesheets')}
              value={filteredTimesheets.length}
              icon={<FileText size={24} />}
              description={t('timesheets.pendingReview', { count: pendingCount })}
            />
            <MetricCard
              label={t('timesheets.totalHours')}
              value={`${totalHours.toFixed(1)}h`}
              icon={<Clock size={24} />}
              description={t('timesheets.thisPeriod')}
            />
            <MetricCard
              label={t('timesheets.validationIssues')}
              value={validationStats.invalid}
              icon={<Warning size={24} />}
              description={validationStats.invalid > 0 ? t('timesheets.errorsFound') : t('timesheets.allValid')}
            />
            <MetricCard
              label={t('timesheets.totalValue')}
              value={`£${totalValue.toLocaleString()}`}
              icon={<CurrencyDollar size={24} />}
              description={t('timesheets.pendingInvoicing')}
            />
          </Grid>

          <Grid cols={3} gap={4} responsive>
            <Card className="border-l-4 border-l-warning">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{t('timesheets.pending')}</CardTitle>
                  <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
                    {pendingCount}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{t('timesheets.awaitingApproval')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">
                  {pendingCount}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{t('timesheets.approved')}</CardTitle>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    <CheckCircle size={12} weight="bold" className="mr-1" />
                    {approvedCount}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{t('timesheets.readyForBilling')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">
                  {approvedCount}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{t('timesheets.approvalRate')}</CardTitle>
                  <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10">
                    <TrendUp size={12} weight="bold" className="mr-1" />
                    {approvalRate.toFixed(0)}%
                  </Badge>
                </div>
                <CardDescription className="text-xs">{t('timesheets.thisPeriod')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {approvalRate.toFixed(0)}%
                </div>
                <Progress value={approvalRate} className="mt-3 h-2" />
              </CardContent>
            </Card>
          </Grid>

          <Separator />
        </>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{t('timesheets.searchAndFilter')}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {t('timesheets.findTimesheetsAdvanced')}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono">
              {t('timesheets.results', { count: filteredTimesheets.length })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <AdvancedSearch
            items={timesheetsToFilter}
            fields={timesheetFields}
            onResultsChange={handleResultsChange}
            placeholder={t('timesheets.searchPlaceholder')}
          />
        </CardContent>
      </Card>

      <Stack direction="horizontal" spacing={3} align="center" justify="between">
        <Stack direction="horizontal" spacing={3}>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-48">
              <div className="flex items-center gap-2">
                <Funnel size={16} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('timesheets.status.all')}</SelectItem>
              <SelectItem value="pending">{t('timesheets.status.pending')}</SelectItem>
              <SelectItem value="approved">{t('timesheets.status.approved')}</SelectItem>
              <SelectItem value="rejected">{t('timesheets.status.rejected')}</SelectItem>
            </SelectContent>
          </Select>
          
          {validationStats.invalid > 0 && (
            <Badge variant="destructive" className="px-3 py-1.5">
              <Warning size={14} weight="bold" className="mr-1" />
              {t('timesheets.validationErrors', { 
                count: validationStats.invalid,
                errors: validationStats.invalid === 1 ? t('timesheets.error') : t('timesheets.errors')
              })}
            </Badge>
          )}
        </Stack>

        <Button variant="outline">
          <Download size={18} className="mr-2" />
          {t('timesheets.exportCsv')}
        </Button>
      </Stack>

      <TimesheetTabs
        filteredTimesheets={timesheetsWithValidation}
        onApprove={handleApprove}
        onReject={handleReject}
        onCreateInvoice={onCreateInvoice}
        onAdjust={setSelectedTimesheet}
        onViewDetails={setViewingTimesheet}
        onDelete={handleDelete}
      />

      <TimesheetDetailDialog
        timesheet={viewingTimesheet}
        open={viewingTimesheet !== null}
        onOpenChange={(open) => {
          if (!open) setViewingTimesheet(null)
        }}
      />

      {selectedTimesheet && (
        <TimeAndRateAdjustmentWizard
          timesheet={{
            id: selectedTimesheet.id,
            workerId: selectedTimesheet.workerId,
            workerName: selectedTimesheet.workerName,
            clientName: selectedTimesheet.clientName,
            hoursWorked: selectedTimesheet.hours,
            rate: selectedTimesheet.rate || 0,
            status: selectedTimesheet.status
          }}
          open={selectedTimesheet !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedTimesheet(null)
          }}
          onSubmit={handleTimeAndRateAdjustment}
        />
      )}
    </Stack>
  )
}
