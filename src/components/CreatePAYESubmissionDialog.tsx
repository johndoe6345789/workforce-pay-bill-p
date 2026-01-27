import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack } from '@/components/ui/stack'
import { Grid } from '@/components/ui/grid'
import { Info, Upload } from '@phosphor-icons/react'
import { usePAYEIntegration, type FPSEmployee } from '@/hooks/use-paye-integration'
import { usePayrollCalculations } from '@/hooks/use-payroll-calculations'
import { toast } from 'sonner'

interface CreatePAYESubmissionDialogProps {
  payrollRunId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreatePAYESubmissionDialog({
  payrollRunId,
  open,
  onOpenChange,
  onSuccess
}: CreatePAYESubmissionDialogProps) {
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [isCreating, setIsCreating] = useState(false)

  const { createFPS, createPAYESubmission, payeConfig } = usePAYEIntegration()
  const { calculatePayroll } = usePayrollCalculations()

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const mockEmployees: FPSEmployee[] = [
        {
          workerId: 'W-001',
          employeeRef: 'EMP001',
          niNumber: 'AB123456C',
          title: 'Ms',
          firstName: 'Sarah',
          lastName: 'Johnson',
          dateOfBirth: '1985-03-15',
          gender: 'F',
          address: {
            line1: '123 Main Street',
            line2: 'Apartment 4B',
            line3: 'London',
            postcode: 'SW1A 1AA',
            country: 'England'
          },
          taxCode: '1257L',
          niCategory: 'A',
          grossPay: 3500.0,
          taxableGrossPay: 3500.0,
          incomeTax: 477.5,
          employeeNI: 354.6,
          employerNI: 429.2,
          studentLoan: 0,
          pensionContribution: 175.0,
          paymentMethod: 'BACS',
          payFrequency: 'Monthly',
          hoursWorked: 160
        },
        {
          workerId: 'W-002',
          employeeRef: 'EMP002',
          niNumber: 'CD234567D',
          title: 'Mr',
          firstName: 'Michael',
          lastName: 'Chen',
          dateOfBirth: '1990-07-22',
          gender: 'M',
          address: {
            line1: '456 Oak Avenue',
            line3: 'Manchester',
            postcode: 'M1 1AA',
            country: 'England'
          },
          taxCode: '1257L',
          niCategory: 'A',
          grossPay: 4200.0,
          taxableGrossPay: 4200.0,
          incomeTax: 617.5,
          employeeNI: 438.6,
          employerNI: 531.2,
          studentLoan: 65.34,
          studentLoanPlan: 'Plan2',
          pensionContribution: 210.0,
          paymentMethod: 'BACS',
          payFrequency: 'Monthly',
          hoursWorked: 175
        },
        {
          workerId: 'W-003',
          employeeRef: 'EMP003',
          niNumber: 'EF345678E',
          title: 'Ms',
          firstName: 'Emma',
          lastName: 'Wilson',
          dateOfBirth: '1988-11-08',
          gender: 'F',
          address: {
            line1: '789 High Street',
            line2: 'Flat 12',
            line3: 'Birmingham',
            postcode: 'B1 1AA',
            country: 'England'
          },
          taxCode: '1257L',
          niCategory: 'A',
          grossPay: 3800.0,
          taxableGrossPay: 3800.0,
          incomeTax: 537.5,
          employeeNI: 390.6,
          employerNI: 473.2,
          pensionContribution: 190.0,
          paymentMethod: 'BACS',
          payFrequency: 'Monthly',
          hoursWorked: 168
        }
      ]

      const fps = createFPS(payrollRunId, mockEmployees, paymentDate)

      const submission = createPAYESubmission('FPS', payrollRunId, fps.id)

      toast.success('PAYE submission created', {
        description: `FPS ready for validation and submission`
      })

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to create submission', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create PAYE RTI Submission</DialogTitle>
          <DialogDescription>
            Generate a Full Payment Submission (FPS) for HMRC Real Time Information
          </DialogDescription>
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
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The date when employees will be paid
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="font-semibold text-sm">Employer Details</div>
              <Grid cols={2} gap={3}>
                <div>
                  <div className="text-xs text-muted-foreground">Employer Reference</div>
                  <div className="text-sm font-mono">{payeConfig.employerRef}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Accounts Office Reference</div>
                  <div className="text-sm font-mono">{payeConfig.accountsOfficeRef}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Company Name</div>
                  <div className="text-sm">{payeConfig.companyName}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Contact</div>
                  <div className="text-sm">{payeConfig.contactEmail}</div>
                </div>
              </Grid>
            </div>

            <div className="p-4 border border-border rounded-lg space-y-3">
              <div className="font-semibold text-sm">What will be included?</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <span>Employee payment details (gross pay, tax, NI)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <span>Employer NI contributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <span>Student loan deductions (if applicable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <span>Pension contributions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            <Upload size={16} />
            Create FPS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
