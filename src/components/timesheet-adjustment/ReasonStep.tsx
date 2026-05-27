import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const COMMON_REASONS = [
  'Incorrect hours submitted',
  'Overtime not calculated',
  'Rate change approved',
  'Client dispute resolution',
  'Data entry error'
]

interface Props {
  reason: string
  setReason: (v: string) => void
}

export function ReasonStep({ reason, setReason }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Adjustment Reason</CardTitle>
        <CardDescription>Provide a clear explanation for audit trail</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Adjustment</Label>
          <Textarea id="reason" placeholder="E.g., Incorrect hours submitted, overtime not calculated, client requested rate change..." value={reason} onChange={e => setReason(e.target.value)} rows={4} />
          <p className="text-xs text-muted-foreground">This will be recorded in the audit trail and visible to auditors</p>
        </div>
        <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Common Reasons:</h4>
          <div className="flex flex-wrap gap-2">
            {COMMON_REASONS.map(suggestion => (
              <Button key={suggestion} variant="outline" size="sm" onClick={() => setReason(suggestion)}>{suggestion}</Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
