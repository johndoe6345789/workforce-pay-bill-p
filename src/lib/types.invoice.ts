export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'credit' | 'cancelled'
export type InvoiceType = 'timesheet' | 'permanent-placement' | 'credit-note' | 'adhoc'

export interface PlacementDetails {
  candidateName: string
  position: string
  startDate: string
  salary: number
  feePercentage: number
  guaranteePeriod: number
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  timesheetId?: string
}

export interface InvoiceTemplate {
  id: string
  name: string
  headerText: string
  footerText: string
  defaultPaymentTerms: string
  logoUrl?: string
  accentColor: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  issueDate: string
  dueDate: string
  amount: number
  status: InvoiceStatus
  currency: string
  template?: string
  lineItems?: InvoiceLineItem[]
  notes?: string
  paymentTerms?: string
  type?: InvoiceType
  relatedInvoiceId?: string
  placementDetails?: PlacementDetails
}

export interface CreditNote {
  id: string
  creditNoteNumber: string
  originalInvoiceId: string
  originalInvoiceNumber: string
  clientName: string
  issueDate: string
  amount: number
  reason: string
  status: 'draft' | 'issued' | 'applied'
  currency: string
}

export interface LinkedInvoice {
  invoiceId: string
  invoiceNumber: string
  amount: number
  linkedDate: string
  linkedBy: string
}
