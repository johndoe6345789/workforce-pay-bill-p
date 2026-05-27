import type { EmailTemplate, NotificationType } from '@/lib/types'

export type { EmailTemplate, NotificationType }

export const TYPE_COLORS: Record<NotificationType, string> = {
  timesheet: 'bg-accent/10 text-accent',
  invoice: 'bg-info/10 text-info',
  compliance: 'bg-warning/10 text-warning',
  expense: 'bg-success/10 text-success',
  payroll: 'bg-primary/10 text-primary',
  system: 'bg-muted text-muted-foreground'
}

export const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'timesheet-approval',
    name: 'Timesheet Approval Notification',
    type: 'timesheet',
    subject: 'Timesheet Approved - {{workerName}} - Week Ending {{weekEnding}}',
    body: 'Dear {{workerName}},\n\nYour timesheet for the week ending {{weekEnding}} has been approved.\n\nHours: {{hours}}\nAmount: {{amount}}\nClient: {{clientName}}\n\nBest regards,\nWorkForce Pro Team',
    variables: ['workerName', 'weekEnding', 'hours', 'amount', 'clientName']
  },
  {
    id: 'timesheet-rejection',
    name: 'Timesheet Rejection Notification',
    type: 'timesheet',
    subject: 'Timesheet Rejected - {{workerName}} - Week Ending {{weekEnding}}',
    body: 'Dear {{workerName}},\n\nYour timesheet for the week ending {{weekEnding}} has been rejected.\n\nReason: {{reason}}\n\nPlease review and resubmit with corrections.\n\nBest regards,\nWorkForce Pro Team',
    variables: ['workerName', 'weekEnding', 'reason']
  },
  {
    id: 'invoice-sent',
    name: 'Invoice Sent to Client',
    type: 'invoice',
    subject: 'Invoice {{invoiceNumber}} - {{clientName}}',
    body: 'Dear {{clientName}},\n\nPlease find attached invoice {{invoiceNumber}} dated {{issueDate}}.\n\nAmount Due: {{amount}} {{currency}}\nDue Date: {{dueDate}}\n\nPayment terms: {{paymentTerms}}\n\nThank you for your business.\n\nBest regards,\nWorkForce Pro',
    variables: ['invoiceNumber', 'clientName', 'issueDate', 'amount', 'currency', 'dueDate', 'paymentTerms']
  },
  {
    id: 'compliance-expiring',
    name: 'Document Expiring Alert',
    type: 'compliance',
    subject: 'Urgent: {{documentType}} Expiring Soon - {{workerName}}',
    body: 'Dear {{workerName}},\n\nYour {{documentType}} is expiring in {{daysUntilExpiry}} days on {{expiryDate}}.\n\nPlease upload an updated document as soon as possible to avoid any disruption to your assignments.\n\nUpload here: {{uploadLink}}\n\nBest regards,\nCompliance Team',
    variables: ['workerName', 'documentType', 'daysUntilExpiry', 'expiryDate', 'uploadLink']
  }
]

export const DEFAULT_FORM = {
  name: '',
  type: 'timesheet' as NotificationType,
  subject: '',
  body: '',
  variables: [] as string[]
}

export type EmailFormData = typeof DEFAULT_FORM

export function extractVariables(text: string): string[] {
  const regex = /\{\{(\w+)\}\}/g
  const matches = text.match(regex)
  if (!matches) return []
  return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
}
