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
import { TimesheetAdjustmentWizard } from '@/components/TimesheetAdjustmentWizard'
import { TimesheetDetailDialog } from '@/components/TimesheetDetailDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { TimesheetCreateDialogs } from '@/components/timesheets/TimesheetCreateDialogs'
import { TimesheetTabs } from '@/components/timesheets/TimesheetTabs'
import { useTimeTracking } from '@/hooks/use-time-tracking'
import { useTimesheetsCrud } from '@/hooks/use-timesheets-crud'
import { usePermissions } from '@/hooks/use-permissions'
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
    bulkCreateTimesheets
  } = useTimesheetsCrud()
  
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
      toast.success('Timesheet created successfully')
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast.error('Failed to create timesheet')
      console.error('Error creating timesheet:', error)
    }
  }, [createTimesheet])

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
      toast.success('Detailed timesheet created successfully')
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast.error('Failed to create detailed timesheet')
      console.error('Error creating detailed timesheet:', error)
    }
  }, [createTimesheet])

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
      toast.success(`${timesheetsData.length} timesheets imported successfully`)
      setIsBulkImportOpen(false)
    } catch (error) {
      toast.error('Failed to import timesheets')
      console.error('Error importing timesheets:', error)
    }
  }, [bulkCreateTimesheets])

  const handleApprove = useCallback(async (id: string) => {
    if (!hasPermission('timesheets.approve')) {
      toast.error('You do not have permission to approve timesheets')
      return
    }
    
    try {
      await updateTimesheet(id, {
        status: 'approved',
        approvedDate: new Date().toISOString()
      })
      toast.success('Timesheet approved')
    } catch (error) {
      toast.error('Failed to approve timesheet')
      console.error('Error approving timesheet:', error)
    }
  }, [updateTimesheet, hasPermission])

  const handleReject = useCallback(async (id: string) => {
    if (!hasPermission('timesheets.approve')) {
      toast.error('You do not have permission to reject timesheets')
      return
    }
    
    try {
      await updateTimesheet(id, {
        status: 'rejected'
      })
      toast.error('Timesheet rejected')
    } catch (error) {
      toast.error('Failed to reject timesheet')
      console.error('Error rejecting timesheet:', error)
    }
  }, [updateTimesheet, hasPermission])

  const handleAdjust = useCallback(async (timesheetId: string, adjustment: any) => {
    if (!hasPermission('timesheets.edit')) {
      toast.error('You do not have permission to adjust timesheets')
      return
    }
    
    try {
      await updateTimesheet(timesheetId, adjustment)
      toast.success('Timesheet adjusted')
      setSelectedTimesheet(null)
    } catch (error) {
      toast.error('Failed to adjust timesheet')
      console.error('Error adjusting timesheet:', error)
    }
  }, [updateTimesheet, hasPermission])

  const handleDelete = useCallback(async (id: string) => {
    if (!hasPermission('timesheets.delete')) {
      toast.error('You do not have permission to delete timesheets')
      return
    }
    
    try {
      await deleteTimesheet(id)
      toast.success('Timesheet deleted')
    } catch (error) {
      toast.error('Failed to delete timesheet')
      console.error('Error deleting timesheet:', error)
    }
  }, [deleteTimesheet, hasPermission])
  
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
    { name: 'workerName', label: 'Worker Name', type: 'text' },
    { name: 'clientName', label: 'Client Name', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' }
    ]},
    { name: 'hours', label: 'Hours', type: 'number' },
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'weekEnding', label: 'Week Ending', type: 'date' }
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
      <PageHeader
        title="Timesheets"
        description="Manage and approve worker timesheets"
        actions={
          <Stack direction="horizontal" spacing={2}>
            <Button 
              variant="outline" 
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <ChartBar size={18} className="mr-2" />
              {showAnalytics ? 'Hide' : 'Show'} Analytics
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

      {showAnalytics && (
        <>
          <Grid cols={4} gap={4} responsive>
            <MetricCard
              label="Total Timesheets"
              value={filteredTimesheets.length}
              icon={<FileText size={24} />}
              description={`${pendingCount} pending review`}
            />
            <MetricCard
              label="Total Hours"
              value={`${totalHours.toFixed(1)}h`}
              icon={<Clock size={24} />}
              description="This period"
            />
            <MetricCard
              label="Validation Issues"
              value={validationStats.invalid}
              icon={<Warning size={24} />}
              description={validationStats.invalid > 0 ? 'Errors found' : 'All valid'}
            />
            <MetricCard
              label="Total Value"
              value={`£${totalValue.toLocaleString()}`}
              icon={<CurrencyDollar size={24} />}
              description="Pending invoicing"
            />
          </Grid>

          <Grid cols={3} gap={4} responsive>
            <Card className="border-l-4 border-l-warning">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Pending</CardTitle>
                  <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
                    {pendingCount}
                  </Badge>
                </div>
                <CardDescription className="text-xs">Awaiting approval</CardDescription>
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
                  <CardTitle className="text-base font-medium">Approved</CardTitle>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    <CheckCircle size={12} weight="bold" className="mr-1" />
                    {approvedCount}
                  </Badge>
                </div>
                <CardDescription className="text-xs">Ready for billing</CardDescription>
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
                  <CardTitle className="text-base font-medium">Approval Rate</CardTitle>
                  <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10">
                    <TrendUp size={12} weight="bold" className="mr-1" />
                    {approvalRate.toFixed(0)}%
                  </Badge>
                </div>
                <CardDescription className="text-xs">This period</CardDescription>
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
              <CardTitle className="text-lg">Search & Filter</CardTitle>
              <CardDescription className="text-xs mt-1">
                Find timesheets using advanced search
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono">
              {filteredTimesheets.length} results
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <AdvancedSearch
            items={timesheetsToFilter}
            fields={timesheetFields}
            onResultsChange={handleResultsChange}
            placeholder="Search by worker, client, or status..."
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          {validationStats.invalid > 0 && (
            <Badge variant="destructive" className="px-3 py-1.5">
              <Warning size={14} weight="bold" className="mr-1" />
              {validationStats.invalid} validation {validationStats.invalid === 1 ? 'error' : 'errors'}
            </Badge>
          )}
        </Stack>

        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Export CSV
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
        <TimesheetAdjustmentWizard
          timesheet={selectedTimesheet}
          open={selectedTimesheet !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedTimesheet(null)
          }}
          onAdjust={(id, adjustment) => handleAdjust(id, adjustment)}
        />
      )}
    </Stack>
  )
}
