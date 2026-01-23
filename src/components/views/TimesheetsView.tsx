import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Plus,
  Download,
  Funnel,
  FileCsv,
  CheckCircle
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { DetailedTimesheetEntry } from '@/components/DetailedTimesheetEntry'
import { TimesheetAdjustmentWizard } from '@/components/TimesheetAdjustmentWizard'
import { TimesheetDetailDialog } from '@/components/TimesheetDetailDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { TimesheetCard } from '@/components/TimesheetCard'
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
      { value: 'rejected', label: 'Rejected' },
      { value: 'processing', label: 'Processing' }
    ]},
    { name: 'hours', label: 'Hours', type: 'number' },
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'weekEnding', label: 'Week Ending', type: 'date' },
    { name: 'submittedDate', label: 'Submitted Date', type: 'date' }
  ]

  const handleSubmitCreate = () => {
    if (!formData.workerName || !formData.clientName || !formData.hours || !formData.rate || !formData.weekEnding) {
      toast.error('Please fill in all fields')
      return
    }

    onCreateTimesheet({
      workerName: formData.workerName,
      clientName: formData.clientName,
      hours: parseFloat(formData.hours),
      rate: parseFloat(formData.rate),
      weekEnding: formData.weekEnding
    })

    setFormData({
      workerName: '',
      clientName: '',
      hours: '',
      rate: '',
      weekEnding: ''
    })
    setIsCreateDialogOpen(false)
  }

  const handleSubmitBulkImport = () => {
    if (!csvData.trim()) {
      toast.error('Please paste CSV data')
      return
    }

    onBulkImport(csvData)
    setCsvData('')
    setIsBulkImportOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Timesheets</h2>
          <p className="text-muted-foreground mt-1">Manage and approve worker timesheets</p>
        </div>
        <div className="flex gap-2">
          <DetailedTimesheetEntry onSubmit={onCreateDetailedTimesheet} />
          <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileCsv size={18} className="mr-2" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Import Timesheets</DialogTitle>
                <DialogDescription>
                  Paste CSV data with columns: workerName, clientName, hours, rate, weekEnding
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="workerName,clientName,hours,rate,weekEnding&#10;John Smith,Acme Corp,40,25.50,2025-01-17&#10;Jane Doe,Tech Ltd,37.5,30.00,2025-01-17"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsBulkImportOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitBulkImport}>Import Timesheets</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Create Timesheet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Timesheet</DialogTitle>
                <DialogDescription>
                  Enter timesheet details manually
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="worker">Worker Name</Label>
                  <Input
                    id="worker"
                    placeholder="Enter worker name"
                    value={formData.workerName}
                    onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    placeholder="Enter client name"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekEnding">Week Ending</Label>
                  <Input
                    id="weekEnding"
                    type="date"
                    value={formData.weekEnding}
                    onChange={(e) => setFormData({ ...formData, weekEnding: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      placeholder="37.5"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate (£/hr)</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      placeholder="25.00"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitCreate}>Create Timesheet</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({timesheets.filter(t => t.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({timesheets.filter(t => t.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({timesheets.filter(t => t.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredTimesheets
            .filter(t => t.status === 'pending')
            .map(timesheet => (
              <TimesheetCard
                key={timesheet.id}
                timesheet={timesheet}
                onApprove={onApprove}
                onReject={onReject}
                onCreateInvoice={onCreateInvoice}
                onAdjust={setSelectedTimesheet}
                onViewDetails={setViewingTimesheet}
              />
            ))}
          {filteredTimesheets.filter(t => t.status === 'pending').length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending timesheets to review</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredTimesheets
            .filter(t => t.status === 'approved')
            .map(timesheet => (
              <TimesheetCard
                key={timesheet.id}
                timesheet={timesheet}
                onApprove={onApprove}
                onReject={onReject}
                onCreateInvoice={onCreateInvoice}
                onAdjust={setSelectedTimesheet}
                onViewDetails={setViewingTimesheet}
              />
            ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredTimesheets
            .filter(t => t.status === 'rejected')
            .map(timesheet => (
              <TimesheetCard
                key={timesheet.id}
                timesheet={timesheet}
                onApprove={onApprove}
                onReject={onReject}
                onCreateInvoice={onCreateInvoice}
                onAdjust={setSelectedTimesheet}
                onViewDetails={setViewingTimesheet}
              />
            ))}
        </TabsContent>
      </Tabs>

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
