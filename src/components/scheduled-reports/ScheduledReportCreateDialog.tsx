import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Stack } from '@/components/ui/stack'
import { REPORT_TYPE_LABELS, FREQUENCY_LABELS } from '@/hooks/useScheduledReportsManager'
import type { ReportType, ReportFrequency, ReportFormat } from '@/hooks/use-scheduled-reports'

interface FormData { name: string; description: string; type: ReportType; frequency: ReportFrequency; format: ReportFormat; recipients: string }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: FormData
  setFormData: (data: FormData) => void
  onCreate: () => void
}

export function ScheduledReportCreateDialog({ open, onOpenChange, formData, setFormData, onCreate }: Props) {
  const patch = (updates: Partial<FormData>) => setFormData({ ...formData, ...updates })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Scheduled Report</DialogTitle>
          <DialogDescription>Set up an automated report to run on a regular schedule</DialogDescription>
        </DialogHeader>
        <Stack spacing={4}>
          <div>
            <Label htmlFor="name">Report Name</Label>
            <Input id="name" value={formData.name} onChange={e => patch({ name: e.target.value })} placeholder="e.g., Monthly Revenue Report" />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" value={formData.description} onChange={e => patch({ description: e.target.value })} placeholder="Brief description of this report" rows={2} />
          </div>
          <div>
            <Label htmlFor="type">Report Type</Label>
            <Select value={formData.type} onValueChange={value => patch({ type: value as ReportType })}>
              <SelectTrigger id="type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={formData.frequency} onValueChange={value => patch({ frequency: value as ReportFrequency })}>
                <SelectTrigger id="frequency"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(FREQUENCY_LABELS).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={formData.format} onValueChange={value => patch({ format: value as ReportFormat })}>
                <SelectTrigger id="format"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['csv', 'excel', 'json'] as ReportFormat[]).map(f => <SelectItem key={f} value={f}>{f.toUpperCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="recipients">Recipients (Optional)</Label>
            <Input id="recipients" value={formData.recipients} onChange={e => patch({ recipients: e.target.value })} placeholder="email1@example.com, email2@example.com" />
            <p className="text-xs text-muted-foreground mt-1">Comma-separated email addresses</p>
          </div>
        </Stack>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onCreate}>Create Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
