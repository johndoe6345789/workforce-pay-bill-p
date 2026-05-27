import type { WorkflowTemplate } from './use-approval-workflow-templates'

type StepPatch = Partial<Pick<WorkflowTemplate, 'isDefault' | 'steps'>>

export interface TemplateSeed {
  name: string
  batchType: WorkflowTemplate['batchType']
  description: string
  patch: StepPatch
}

const n = () => Date.now()
const step = (sfx: string, order: number, name: string, desc: string, role: string, comments: boolean, skip: boolean, extra?: object) =>
  ({ id: `STEP-${n()}-${sfx}`, order, name, description: desc, approverRole: role, requiresComments: comments, canSkip: skip, ...extra })
const esc = (sfx: string, hours: number, to: string) =>
  ({ id: `ESC-${n()}-${sfx}`, hoursUntilEscalation: hours, escalateTo: to, notifyOriginalApprover: true })
const cond = (sfx: string, field: string, val: number) =>
  ({ id: `COND-${n()}-${sfx}`, field, operator: 'lessThan', value: val })

export function buildTemplateSeeds(): TemplateSeed[] {
  return [
    {
      name: 'Standard Payroll Approval', batchType: 'payroll',
      description: 'Standard two-step approval process for payroll batches',
      patch: { isDefault: true, steps: [
        step('1', 0, 'Payroll Manager Review', 'Initial review of payroll calculations', 'Payroll Manager', false, false, { escalationRules: [esc('1', 24, 'Finance Manager')] }),
        step('2', 1, 'Finance Manager Approval', 'Final approval and authorization for payment', 'Finance Manager', true, false, { escalationRules: [esc('2', 48, 'CFO')] })
      ]}
    },
    {
      name: 'Client Invoice Approval', batchType: 'invoice',
      description: 'Single-step approval for standard client invoices',
      patch: { isDefault: true, steps: [
        step('3', 0, 'Billing Manager Approval', 'Review invoice accuracy and client terms', 'Finance Manager', false, false)
      ]}
    },
    {
      name: 'Large Invoice Approval', batchType: 'invoice',
      description: 'Multi-step approval for invoices over threshold',
      patch: { steps: [
        step('4', 0, 'Billing Manager Review', 'Initial review of large invoice', 'Manager', true, false),
        step('5', 1, 'Senior Manager Approval', 'Secondary review for high-value invoices', 'Senior Manager', true, false),
        step('6', 2, 'Director Authorization', 'Final authorization for large amounts', 'Director', true, false)
      ]}
    },
    {
      name: 'Timesheet Batch Approval', batchType: 'timesheet',
      description: 'Quick approval for timesheet batches',
      patch: { isDefault: true, steps: [
        step('7', 0, 'Operations Manager Approval', 'Review timesheet accuracy', 'Operations Manager', false, true, { skipConditions: [cond('1', 'totalHours', 100)] })
      ]}
    },
    {
      name: 'Expense Claim Approval', batchType: 'expense',
      description: 'Two-step approval for expense claims',
      patch: { isDefault: true, steps: [
        step('8', 0, 'Line Manager Approval', 'Verify expense legitimacy', 'Manager', false, false),
        step('9', 1, 'Finance Review', 'Final approval and payment authorization', 'Finance Manager', false, true, { skipConditions: [cond('2', 'amount', 500)] })
      ]}
    },
    {
      name: 'Compliance Document Approval', batchType: 'compliance',
      description: 'Rigorous approval for compliance submissions',
      patch: { isDefault: true, steps: [
        step('10', 0, 'Compliance Officer Review', 'Check document completeness', 'Compliance Officer', true, false),
        step('11', 1, 'Legal Review', 'Legal verification of compliance', 'Director', true, false)
      ]}
    },
    {
      name: 'Purchase Order Approval', batchType: 'purchase-order',
      description: 'Standard PO approval workflow',
      patch: { isDefault: true, steps: [
        step('12', 0, 'Manager Approval', 'Verify purchase necessity', 'Manager', false, false),
        step('13', 1, 'Finance Approval', 'Budget and payment approval', 'Finance Manager', true, false, { escalationRules: [esc('3', 72, 'CFO')] })
      ]}
    }
  ]
}
