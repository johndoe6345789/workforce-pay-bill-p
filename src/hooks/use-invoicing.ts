import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Invoice, InvoiceLineItem, Timesheet, InvoiceStatus, InvoiceType } from '@/lib/types'

interface InvoiceGenerationOptions {
  includeLineItems?: boolean
  applyTax?: boolean
  taxRate?: number
  paymentTermsDays?: number
  roundingPrecision?: number
}

interface InvoiceAgingData {
  current: number
  days30: number
  days60: number
  days90: number
  over90: number
}

export function useInvoicing() {
  const [invoices = [], setInvoices] = useKV<Invoice[]>('invoices', [])
  const [isProcessing, setIsProcessing] = useState(false)

  const generateInvoiceNumber = useCallback((prefix: string = 'INV'): string => {
    const count = invoices.length + 1
    const timestamp = Date.now().toString().slice(-6)
    return `${prefix}-${String(count).padStart(5, '0')}-${timestamp}`
  }, [invoices.length])

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

  const saveInvoice = useCallback(async (invoice: Invoice) => {
    setIsProcessing(true)
    try {
      setInvoices(current => [...(current || []), invoice])
      return invoice
    } finally {
      setIsProcessing(false)
    }
  }, [setInvoices])

  const updateInvoiceStatus = useCallback(async (
    invoiceId: string,
    status: InvoiceStatus
  ) => {
    setInvoices(current =>
      (current || []).map(inv =>
        inv.id === invoiceId ? { ...inv, status } : inv
      )
    )
  }, [setInvoices])

  const calculateInvoiceAging = useCallback((): InvoiceAgingData => {
    const now = new Date()
    const aging: InvoiceAgingData = {
      current: 0,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0
    }

    invoices.forEach(invoice => {
      if (invoice.status === 'paid' || invoice.status === 'cancelled') return

      const dueDate = new Date(invoice.dueDate)
      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysOverdue <= 0) {
        aging.current += invoice.amount
      } else if (daysOverdue <= 30) {
        aging.days30 += invoice.amount
      } else if (daysOverdue <= 60) {
        aging.days60 += invoice.amount
      } else if (daysOverdue <= 90) {
        aging.days90 += invoice.amount
      } else {
        aging.over90 += invoice.amount
      }
    })

    return aging
  }, [invoices])

  const getInvoicesByClient = useCallback((clientName: string): Invoice[] => {
    return invoices.filter(inv => inv.clientName === clientName)
  }, [invoices])

  const getInvoicesByStatus = useCallback((status: InvoiceStatus): Invoice[] => {
    return invoices.filter(inv => inv.status === status)
  }, [invoices])

  const getInvoicesByType = useCallback((type: InvoiceType): Invoice[] => {
    return invoices.filter(inv => inv.type === type)
  }, [invoices])

  const calculateTotalRevenue = useCallback((startDate?: Date, endDate?: Date): number => {
    return invoices
      .filter(inv => {
        if (inv.status === 'cancelled') return false
        if (!startDate && !endDate) return true
        
        const invDate = new Date(inv.issueDate)
        if (startDate && invDate < startDate) return false
        if (endDate && invDate > endDate) return false
        return true
      })
      .reduce((sum, inv) => sum + inv.amount, 0)
  }, [invoices])

  const getOverdueInvoices = useCallback((): Invoice[] => {
    const now = new Date()
    return invoices.filter(inv => {
      if (inv.status === 'paid' || inv.status === 'cancelled') return false
      return new Date(inv.dueDate) < now
    })
  }, [invoices])

  return {
    invoices,
    isProcessing,
    generateInvoiceNumber,
    createInvoiceFromTimesheets,
    createPlacementInvoice,
    createCreditNote,
    saveInvoice,
    updateInvoiceStatus,
    calculateInvoiceAging,
    getInvoicesByClient,
    getInvoicesByStatus,
    getInvoicesByType,
    calculateTotalRevenue,
    getOverdueInvoices
  }
}
