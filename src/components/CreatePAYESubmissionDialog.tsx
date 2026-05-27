import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Grid } from '@/components/ui/grid'
import { Info, Upload } from '@phosphor-icons/react'
import { usePAYEIntegration } from '@/hooks/use-paye-integration'
import { toast } from 'sonner'
import { MOCK_PAYE_EMPLOYEES } from '@/data/mockPAYEEmployees'

interface Props {
  payrollRunId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const INCLUSIONS = [
  'Employee payment details (gross pay, tax, NI)',
  'Employer NI contributions',
  'Student loan deductions (if applicable)',
  'Pension contributions',
]

const EMPLOYER_FIELDS: { label: string; key: keyof ReturnType<typeof usePAYEIntegration>['payeConfig'] }[] = [
  { label: 'Employer Reference',        key: 'employerRef' },
  { label: 'Accounts Office Reference', key: 'accountsOfficeRef' },
  { label: 'Company Name',              key: 'companyName' },
  { label: 'Contact',                   key: 'contactEmail' },
]

export function CreatePAYESubmissionDialog({ payrollRunId, open, onOpenChange, onSuccess }: Props) {
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [isCreating, setIsCreating] = useState(false)
  const { createFPS, createPAYESubmission, payeConfig } = usePAYEIntegration()

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const fps = createFPS(payrollRunId, MOCK_PAYE_EMPLOYEES, paymentDate)
      createPAYESubmission('FPS', payrollRunId, fps.id)
      toast.success('PAYE submission created', { description: 'FPS ready for validation and submission' })
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to create submission', { description: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create PAYE RTI Submission</DialogTitle>
          <DialogDescription>Generate a Full Payment Submission (FPS) for HMRC Real Time Information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <Info size={16} />
            <AlertDescription>
              This will create an FPS containing employee payment information for submission to HMRC.
              Ensure all employee details are up to date before proceeding.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-date">Payment Date</Label>
              <Input id="payment-date" type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
              <p className="text-xs text-muted-foreground">The date when employees will be paid</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="font-semibold text-sm">Employer Details</div>
              <Grid cols={2} gap={3}>
                {EMPLOYER_FIELDS.map(({ label, key }) => (
                  <div key={key}>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-sm font-mono">{String(payeConfig[key] ?? '')}</div>
                  </div>
                ))}
              </Grid>
            </div>

            <div className="p-4 border border-border rounded-lg space-y-3">
              <div className="font-semibold text-sm">What will be included?</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {INCLUSIONS.map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            <Upload size={16} className="mr-2" />Create FPS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
