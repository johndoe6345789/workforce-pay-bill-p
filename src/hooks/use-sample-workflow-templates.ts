import { useEffect } from 'react'
import { useApprovalWorkflowTemplates, type WorkflowTemplate } from './use-approval-workflow-templates'

export function useSampleWorkflowTemplates() {
  const { templates, createTemplate, updateTemplate, addStep, setDefaultTemplate } = useApprovalWorkflowTemplates()

  useEffect(() => {
    if (templates.length === 0) {
      const payrollTemplate = createTemplate(
        'Standard Payroll Approval',
        'payroll',
        'Standard two-step approval process for payroll batches'
      )

      updateTemplate(payrollTemplate.id, {
        isDefault: true,
        steps: [
          {
            id: `STEP-${Date.now()}-1`,
            order: 0,
            name: 'Payroll Manager Review',
            description: 'Initial review of payroll calculations',
            approverRole: 'Payroll Manager',
            requiresComments: false,
            canSkip: false,
            escalationRules: [
              {
                id: `ESC-${Date.now()}-1`,
                hoursUntilEscalation: 24,
                escalateTo: 'Finance Manager',
                notifyOriginalApprover: true
              }
            ]
          },
          {
            id: `STEP-${Date.now()}-2`,
            order: 1,
            name: 'Finance Manager Approval',
            description: 'Final approval and authorization for payment',
            approverRole: 'Finance Manager',
            requiresComments: true,
            canSkip: false,
            escalationRules: [
              {
                id: `ESC-${Date.now()}-2`,
                hoursUntilEscalation: 48,
                escalateTo: 'CFO',
                notifyOriginalApprover: true
              }
            ]
          }
        ]
      })

      const invoiceTemplate = createTemplate(
        'Client Invoice Approval',
        'invoice',
        'Single-step approval for standard client invoices'
      )

      updateTemplate(invoiceTemplate.id, {
        isDefault: true,
        steps: [
          {
            id: `STEP-${Date.now()}-3`,
            order: 0,
            name: 'Billing Manager Approval',
            description: 'Review invoice accuracy and client terms',
            approverRole: 'Finance Manager',
            requiresComments: false,
            canSkip: false
          }
        ]
      })

      const largeInvoiceTemplate = createTemplate(
        'Large Invoice Approval',
        'invoice',
        'Multi-step approval for invoices over threshold'
      )

      updateTemplate(largeInvoiceTemplate.id, {
        steps: [
          {
            id: `STEP-${Date.now()}-4`,
            order: 0,
            name: 'Billing Manager Review',
            description: 'Initial review of large invoice',
            approverRole: 'Manager',
            requiresComments: true,
            canSkip: false
          },
          {
            id: `STEP-${Date.now()}-5`,
            order: 1,
            name: 'Senior Manager Approval',
            description: 'Secondary review for high-value invoices',
            approverRole: 'Senior Manager',
            requiresComments: true,
            canSkip: false
          },
          {
            id: `STEP-${Date.now()}-6`,
            order: 2,
            name: 'Director Authorization',
            description: 'Final authorization for large amounts',
            approverRole: 'Director',
            requiresComments: true,
            canSkip: false
          }
        ]
      })

      const timesheetTemplate = createTemplate(
        'Timesheet Batch Approval',
        'timesheet',
        'Quick approval for timesheet batches'
      )

      updateTemplate(timesheetTemplate.id, {
        isDefault: true,
        steps: [
          {
            id: `STEP-${Date.now()}-7`,
            order: 0,
            name: 'Operations Manager Approval',
            description: 'Review timesheet accuracy',
            approverRole: 'Operations Manager',
            requiresComments: false,
            canSkip: true,
            skipConditions: [
              {
                id: `COND-${Date.now()}`,
                field: 'totalHours',
                operator: 'lessThan',
                value: 100
              }
            ]
          }
        ]
      })

      const expenseTemplate = createTemplate(
        'Expense Claim Approval',
        'expense',
        'Two-step approval for expense claims'
      )

      updateTemplate(expenseTemplate.id, {
        isDefault: true,
        steps: [
          {
            id: `STEP-${Date.now()}-8`,
            order: 0,
            name: 'Line Manager Approval',
            description: 'Verify expense legitimacy',
            approverRole: 'Manager',
            requiresComments: false,
            canSkip: false
          },
          {
            id: `STEP-${Date.now()}-9`,
            order: 1,
            name: 'Finance Review',
            description: 'Final approval and payment authorization',
            approverRole: 'Finance Manager',
            requiresComments: false,
            canSkip: true,
            skipConditions: [
              {
                id: `COND-${Date.now()}-2`,
                field: 'amount',
                operator: 'lessThan',
                value: 500
              }
            ]
          }
        ]
      })

      const complianceTemplate = createTemplate(
        'Compliance Document Approval',
        'compliance',
        'Rigorous approval for compliance submissions'
      )

      updateTemplate(complianceTemplate.id, {
        isDefault: true,
        steps: [
          {
            id: `STEP-${Date.now()}-10`,
            order: 0,
            name: 'Compliance Officer Review',
            description: 'Check document completeness',
            approverRole: 'Compliance Officer',
            requiresComments: true,
            canSkip: false
          },
          {
            id: `STEP-${Date.now()}-11`,
            order: 1,
            name: 'Legal Review',
            description: 'Legal verification of compliance',
            approverRole: 'Director',
            requiresComments: true,
            canSkip: false
          }
        ]
      })

      const purchaseOrderTemplate = createTemplate(
        'Purchase Order Approval',
        'purchase-order',
        'Standard PO approval workflow'
      )

      updateTemplate(purchaseOrderTemplate.id, {
        isDefault: true,
        steps: [
          {
            id: `STEP-${Date.now()}-12`,
            order: 0,
            name: 'Manager Approval',
            description: 'Verify purchase necessity',
            approverRole: 'Manager',
            requiresComments: false,
            canSkip: false
          },
          {
            id: `STEP-${Date.now()}-13`,
            order: 1,
            name: 'Finance Approval',
            description: 'Budget and payment approval',
            approverRole: 'Finance Manager',
            requiresComments: true,
            canSkip: false,
            escalationRules: [
              {
                id: `ESC-${Date.now()}-3`,
                hoursUntilEscalation: 72,
                escalateTo: 'CFO',
                notifyOriginalApprover: true
              }
            ]
          }
        ]
      })
    }
  }, [])
}
