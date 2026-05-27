import * as z from 'zod'
import type { PayrollRun, Timesheet, Worker } from '@/lib/types'

export const payrollSchema = z.object({
  periodEnding: z.string().min(1, 'Period ending date is required'),
  processingType: z.enum(['all-approved', 'selected-workers', 'one-click']),
  selectedWorkerIds: z.array(z.string()).optional(),
})

export type PayrollFormData = z.infer<typeof payrollSchema>

export interface CreatePayrollDialogOptions {
  timesheets: Timesheet[]
  workers: Worker[]
  onCreatePayroll: (payroll: Omit<PayrollRun, 'id'>) => Promise<void>
  onOpenChange: (open: boolean) => void
}
