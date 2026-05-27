import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ADJUSTMENT_REASONS } from '@/hooks/useTimeAdjustmentWizard'

interface Props {
  adjustmentReason: string
  setAdjustmentReason: (v: string) => void
  notes: string
  setNotes: (v: string) => void
}

export function JustificationStep({ adjustmentReason, setAdjustmentReason, notes, setNotes }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="adjustment-reason">Reason for Adjustment *</Label>
        <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
          <SelectTrigger id="adjustment-reason"><SelectValue placeholder="Select a reason" /></SelectTrigger>
          <SelectContent>
            {ADJUSTMENT_REASONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="adjustment-notes">Additional Notes</Label>
        <Textarea id="adjustment-notes" placeholder="Provide additional context for this adjustment..." value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
        <div className="text-xs text-muted-foreground">{adjustmentReason === 'other' && 'Required when selecting "Other"'}</div>
      </div>
    </div>
  )
}
