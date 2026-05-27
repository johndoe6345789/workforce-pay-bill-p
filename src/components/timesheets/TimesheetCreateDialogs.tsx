import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'
import { usePermissions } from '@/hooks/use-permissions'
import { TimesheetBulkImportDialog } from '@/components/timesheets/TimesheetBulkImportDialog'
import { TimesheetEntryTabs } from '@/components/timesheets/TimesheetEntryTabs'

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
          <TimesheetEntryTabs
            formData={formData}
            setFormData={setFormData}
            onSubmitSimple={handleSubmitCreate}
            onSubmitDetailed={data => { onCreateDetailedTimesheet(data); setIsCreateDialogOpen(false) }}
            onClose={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <TimesheetBulkImportDialog
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        csvData={csvData}
        setCsvData={setCsvData}
        onImport={handleBulkImport}
      />
    </>
  )
}
