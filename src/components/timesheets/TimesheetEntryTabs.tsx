import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DetailedTimesheetEntry } from '@/components/DetailedTimesheetEntry'
import type { ShiftEntry } from '@/lib/types'

interface FormData {
  workerName: string; clientName: string
  hours: string; rate: string; weekEnding: string
}

const SIMPLE_FIELDS: { id: keyof FormData; label: string; type?: string }[] = [
  { id: 'workerName',  label: 'Worker Name' },
  { id: 'clientName',  label: 'Client Name' },
  { id: 'hours',       label: 'Total Hours',   type: 'number' },
  { id: 'rate',        label: 'Rate (£/hour)', type: 'number' },
  { id: 'weekEnding',  label: 'Week Ending',   type: 'date' },
]

interface Props {
  formData: FormData
  setFormData: (data: FormData) => void
  onSubmitSimple: () => void
  onSubmitDetailed: (data: { workerName: string; clientName: string; weekEnding: string; shifts: ShiftEntry[]; totalHours: number; totalAmount: number; baseRate: number }) => void
  onClose: () => void
}

export function TimesheetEntryTabs({ formData, setFormData, onSubmitSimple, onSubmitDetailed, onClose }: Props) {
  return (
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmitSimple}>Create Timesheet</Button>
        </div>
      </TabsContent>
      <TabsContent value="detailed">
        <DetailedTimesheetEntry
          onSubmit={data => { onSubmitDetailed(data); onClose() }}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
