import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileCsv } from '@phosphor-icons/react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  csvData: string
  setCsvData: (data: string) => void
  onImport: () => void
}

export function TimesheetBulkImportDialog({ open, onOpenChange, csvData, setCsvData, onImport }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onImport}>Import</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
