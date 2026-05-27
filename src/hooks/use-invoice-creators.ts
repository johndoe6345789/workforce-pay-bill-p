import { useCallback } from 'react'
import type { Invoice, InvoiceLineItem, Timesheet } from '@/lib/types'
import type { InvoiceGenerationOptions } from './use-invoicing.types'

export function useInvoiceCreators(
  generateInvoiceNumber: (prefix?: string) => string
) {
  const createInvoiceFromTimesheets = useCallback((
    timesheets: Timesheet[],
    clientName: string,
    options: InvoiceGenerationOptions = {}
  ): Invoice => {
    const {
      includeLineItems = true,
      applyTax = false,
      taxRate = 0.20,
      paymentTermsDays = 30,
      roundingPrecision = 2
    } = options

    const lineItems: InvoiceLineItem[] = includeLineItems
      ? timesheets.map(ts => ({
          id: `LINE-${ts.id}`,
          description: `${ts.workerName} - Week ending ${new Date(ts.weekEnding).toLocaleDateString()}`,
          quantity: ts.hours || 0,
          rate: ts.rate || 0,
          amount: ts.amount || 0,
          timesheetId: ts.id
        }))
      : []

    const subtotal = timesheets.reduce((sum, ts) => sum + (ts.amount || 0), 0)
    const tax = applyTax ? subtotal * taxRate : 0
    const total = Number((subtotal + tax).toFixed(roundingPrecision))

    const issueDate = new Date()
    const dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + paymentTermsDays)

    return {
      id: `INV-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      clientName,
      issueDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      amount: total,
      status: 'draft',
      currency: 'GBP',
      lineItems,
      type: 'timesheet',
      paymentTerms: `Payment due within ${paymentTermsDays} days`
    }
  }, [generateInvoiceNumber])

  const createPlacementInvoice = useCallback((
    candidateName: string,
    clientName: string,
    salary: number,
    feePercentage: number,
    options: Partial<InvoiceGenerationOptions> = {}
  ): Invoice => {
    const amount = (salary * feePercentage) / 100
    const issueDate = new Date()
    const dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + (options.paymentTermsDays || 30))

    return {
      id: `INV-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber('PLACE'),
      clientName,
      issueDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      amount,
      status: 'draft',
      currency: 'GBP',
      type: 'permanent-placement',
      placementDetails: {
        candidateName,
        position: 'Position',
        startDate: issueDate.toISOString().split('T')[0],
        salary,
        feePercentage,
        guaranteePeriod: 90
      },
      paymentTerms: `Payment due within ${options.paymentTermsDays || 30} days`
    }
  }, [generateInvoiceNumber])

  const createCreditNote = useCallback((
    originalInvoice: Invoice,
    creditAmount: number,
    reason: string
  ): Invoice => {
    return {
      id: `CREDIT-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber('CREDIT'),
      clientName: originalInvoice.clientName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      amount: -Math.abs(creditAmount),
      status: 'credit',
      currency: originalInvoice.currency,
      type: 'credit-note',
      relatedInvoiceId: originalInvoice.id,
      notes: `Credit note for ${originalInvoice.invoiceNumber}: ${reason}`
    }
  }, [generateInvoiceNumber])

  return { createInvoiceFromTimesheets, createPlacementInvoice, createCreditNote }
}
