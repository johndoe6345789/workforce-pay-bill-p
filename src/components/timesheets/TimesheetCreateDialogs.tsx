import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, FileCsv } from '@phosphor-icons/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DetailedTimesheetEntry } from '@/components/DetailedTimesheetEntry'
import { Textarea } from '@/components/ui/textarea'
import { usePermissions } from '@/hooks/use-permissions'
import type { ShiftEntry } from '@/lib/types'

interface FormData {
  workerName: string
  clientName: string
  hours: string
  rate: string
  weekEnding: string
}

interface Props {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isBulkImportOpen: boolean
  setIsBulkImportOpen: (open: boolean) => void
  formData: FormData
  setFormData: (data: any) => void
  csvData: string
  setCsvData: (data: string) => void
  onCreateTimesheet: (data: any) => void
  onCreateDetailedTimesheet: (data: any) => void
  onBulkImport: (csvData: string) => void
}

const SIMPLE_FIELDS: { id: keyof FormData; label: string; type?: string }[] = [
  { id: 'workerName',  label: 'Worker Name' },
  { id: 'clientName',  label: 'Client Name' },
  { id: 'hours',       label: 'Total Hours',   type: 'number' },
  { id: 'rate',        label: 'Rate (£/hour)', type: 'number' },
  { id: 'weekEnding',  label: 'Week Ending',   type: 'date' },
]

const EMPTY_FORM: FormData = { workerName: '', clientName: '', hours: '', rate: '', weekEnding: '' }

export function TimesheetCreateDialogs({
  isCreateDialogOpen, setIsCreateDialogOpen,
  isBulkImportOpen, setIsBulkImportOpen,
  formData, setFormData,
  csvData, setCsvData,
  onCreateTimesheet, onCreateDetailedTimesheet, onBulkImport,
}: Props) {
  const { hasPermission } = usePermissions()

  const handleSubmitCreate = () => {
    if (SIMPLE_FIELDS.some(f => !formData[f.id])) return
    onCreateTimesheet({
      workerName: formData.workerName,
      clientName: formData.clientName,
      hours: parseFloat(formData.hours),
      rate: parseFloat(formData.rate),
      weekEnding: formData.weekEnding,
    })
    setFormData(EMPTY_FORM)
    setIsCreateDialogOpen(false)
  }

  const handleBulkImport = () => {
    onBulkImport(csvData)
    setCsvData('')
    setIsBulkImportOpen(false)
  }

  if (!hasPermission('timesheets.create')) return null

  return (
    <>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button><Plus size={18} className="mr-2" />Create Timesheet</Button>
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
                {SIMPLE_FIELDS.map(({ id, label, type }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      type={type}
                      value={formData[id]}
                      onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitCreate}>Create Timesheet</Button>
              </div>
            </TabsContent>
            <TabsContent value="detailed">
              <DetailedTimesheetEntry
                onSubmit={(data: { workerName: string; clientName: string; weekEnding: string; shifts: ShiftEntry[]; totalHours: number; totalAmount: number; baseRate: number }) => {
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
          <Button variant="outline"><FileCsv size={18} className="mr-2" />Bulk Import</Button>
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
            onChange={e => setCsvData(e.target.value)}
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
