import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, FileCsv } from '@phosphor-icons/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DetailedTimesheetEntry } from '@/components/DetailedTimesheetEntry'
import { Textarea } from '@/components/ui/textarea'
import type { ShiftEntry } from '@/lib/types'

interface TimesheetCreateDialogsProps {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isBulkImportOpen: boolean
  setIsBulkImportOpen: (open: boolean) => void
  formData: {
    workerName: string
    clientName: string
    hours: string
    rate: string
    weekEnding: string
  }
  setFormData: (data: any) => void
  csvData: string
  setCsvData: (data: string) => void
  onCreateTimesheet: (data: any) => void
  onCreateDetailedTimesheet: (data: any) => void
  onBulkImport: (csvData: string) => void
}

export function TimesheetCreateDialogs({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isBulkImportOpen,
  setIsBulkImportOpen,
  formData,
  setFormData,
  csvData,
  setCsvData,
  onCreateTimesheet,
  onCreateDetailedTimesheet,
  onBulkImport
}: TimesheetCreateDialogsProps) {
  const handleSubmitCreate = () => {
    if (!formData.workerName || !formData.clientName || !formData.hours || !formData.rate || !formData.weekEnding) {
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

  const handleBulkImport = () => {
    onBulkImport(csvData)
    setCsvData('')
    setIsBulkImportOpen(false)
  }

  return (
    <>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus size={18} className="mr-2" />
            Create Timesheet
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Timesheet</DialogTitle>
            <DialogDescription>Choose between simple or detailed timesheet entry</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple Entry</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="simple" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workerName">Worker Name</Label>
                  <Input
                    id="workerName"
                    value={formData.workerName}
                    onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Total Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate (£/hour)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
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
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitCreate}>Create Timesheet</Button>
              </div>
            </TabsContent>
            <TabsContent value="detailed">
              <DetailedTimesheetEntry
                onSubmit={(data: {
                  workerName: string
                  clientName: string
                  weekEnding: string
                  shifts: ShiftEntry[]
                  totalHours: number
                  totalAmount: number
                  baseRate: number
                }) => {
                  onCreateDetailedTimesheet(data)
                  setIsCreateDialogOpen(false)
                }}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FileCsv size={18} className="mr-2" />
            Bulk Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Import Timesheets</DialogTitle>
            <DialogDescription>
              Import multiple timesheets from CSV. Format: workerName, clientName, hours, rate, weekEnding
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="workerName,clientName,hours,rate,weekEnding&#10;John Doe,Acme Corp,40,25,2024-01-12"
            rows={10}
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsBulkImportOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkImport}>Import</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
