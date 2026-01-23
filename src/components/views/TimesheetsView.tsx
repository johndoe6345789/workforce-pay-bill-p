import { useState, useMemo, useEffect, useCallback } from 'react'
import { Download, Funnel, ChartBar, Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TimesheetAdjustmentWizard } from '@/components/TimesheetAdjustmentWizard'
import { TimesheetDetailDialog } from '@/components/TimesheetDetailDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { TimesheetCreateDialogs } from '@/components/timesheets/TimesheetCreateDialogs'
import { TimesheetTabs } from '@/components/timesheets/TimesheetTabs'
import { useTimeTracking } from '@/hooks/use-time-tracking'
import { toast } from 'sonner'
import type { Timesheet, TimesheetStatus, ShiftEntry } from '@/lib/types'

interface TimesheetsViewProps {
  timesheets: Timesheet[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
  onCreateTimesheet: (data: {
    workerName: string
    clientName: string
    hours: number
    rate: number
    weekEnding: string
  }) => void
  onCreateDetailedTimesheet: (data: {
    workerName: string
    clientName: string
    weekEnding: string
    shifts: ShiftEntry[]
    totalHours: number
    totalAmount: number
    baseRate: number
  }) => void
  onBulkImport: (csvData: string) => void
  onAdjust: (timesheetId: string, adjustment: any) => void
}

export function TimesheetsView({ 
  timesheets, 
  searchQuery, 
  setSearchQuery, 
  onApprove, 
  onReject,
  onCreateInvoice,
  onCreateTimesheet,
  onCreateDetailedTimesheet,
  onBulkImport,
  onAdjust
}: TimesheetsViewProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | TimesheetStatus>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null)
  const [viewingTimesheet, setViewingTimesheet] = useState<Timesheet | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  const { 
    validateTimesheet, 
    analyzeWorkingTime,
    calculateShiftHours,
    determineShiftType
  } = useTimeTracking()
  
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Timesheets</h2>
          <p className="text-muted-foreground mt-1">Manage and approve worker timesheets</p>
        </div>
        <div className="flex gap-2">
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
            onCreateTimesheet={onCreateTimesheet}
            onCreateDetailedTimesheet={onCreateDetailedTimesheet}
            onBulkImport={onBulkImport}
          />
        </div>
      </div>

      {showAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Total Timesheets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{filteredTimesheets.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {filteredTimesheets.reduce((sum, ts) => sum + ts.hours, 0).toFixed(1)}h
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Validation Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold">{validationStats.invalid}</div>
                {validationStats.invalid > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    <Warning size={12} className="mr-1" />
                    Errors
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold font-mono">
                £{filteredTimesheets.reduce((sum, ts) => sum + ts.amount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AdvancedSearch
        items={timesheetsToFilter}
        fields={timesheetFields}
        onResultsChange={handleResultsChange}
        placeholder="Search timesheets or use query language (e.g., status = pending hours > 40)"
      />

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-40">
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
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      <TimesheetTabs
        filteredTimesheets={timesheetsWithValidation}
        onApprove={onApprove}
        onReject={onReject}
        onCreateInvoice={onCreateInvoice}
        onAdjust={setSelectedTimesheet}
        onViewDetails={setViewingTimesheet}
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
          onAdjust={onAdjust}
        />
      )}
    </div>
  )
}
