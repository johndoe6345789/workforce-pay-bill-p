import { useCallback } from 'react'
import { toast } from 'sonner'
import type { 
  Timesheet, 
  Invoice, 
  ComplianceDocument,
  ComplianceStatus,
  Expense,
  ExpenseStatus,
  InvoiceStatus,
  ShiftEntry,
  NewNotification,
  AppActions,
  TimesheetAdjustment,
  CreditNote
} from '@/lib/types'

export function useAppActions(
  timesheets: Timesheet[],
  setTimesheets: (updater: (current: Timesheet[]) => Timesheet[]) => void,
  invoices: Invoice[],
  setInvoices: (updater: (current: Invoice[]) => Invoice[]) => void,
  setComplianceDocs: (updater: (current: ComplianceDocument[]) => ComplianceDocument[]) => void,
  setExpenses: (updater: (current: Expense[]) => Expense[]) => void,
  addNotification: (notification: NewNotification) => void
): AppActions {
  const handleApproveTimesheet = useCallback((id: string) => {
    setTimesheets(current => {
      const updated = current.map(t => 
        t.id === id 
          ? { ...t, status: 'approved' as const, approvedDate: new Date().toISOString() }
          : t
      )
      const timesheet = updated.find(t => t.id === id)
      if (timesheet) {
        addNotification({
          type: 'timesheet',
          priority: 'medium',
          title: 'Timesheet Approved',
          message: `${timesheet.workerName}'s timesheet for ${new Date(timesheet.weekEnding).toLocaleDateString()} has been approved`,
          relatedId: id
        })
      }
      return updated
    })
    toast.success('Timesheet approved successfully')
  }, [setTimesheets, addNotification])

  const handleRejectTimesheet = useCallback((id: string) => {
    setTimesheets(current => {
      const updated = current.map(t => 
        t.id === id 
          ? { ...t, status: 'rejected' as const }
          : t
      )
      const timesheet = updated.find(t => t.id === id)
      if (timesheet) {
        addNotification({
          type: 'timesheet',
          priority: 'medium',
          title: 'Timesheet Rejected',
          message: `${timesheet.workerName}'s timesheet for ${new Date(timesheet.weekEnding).toLocaleDateString()} has been rejected`,
          relatedId: id
        })
      }
      return updated
    })
    toast.error('Timesheet rejected')
  }, [setTimesheets, addNotification])

  const handleAdjustTimesheet = (timesheetId: string, adjustment: TimesheetAdjustment) => {
    setTimesheets(current => 
      current.map(t => {
        if (t.id !== timesheetId) return t
        
        const newAdjustment = {
          ...adjustment,
          id: adjustment.id || `ADJ-${Date.now()}`,
          adjustmentDate: adjustment.adjustmentDate || new Date().toISOString(),
        }
        
        const newHours = adjustment.newHours
        const newRate = adjustment.newRate ?? t.rate ?? 0
        
        return {
          ...t,
          hours: newHours,
          rate: newRate,
          amount: newHours * newRate,
          adjustments: [...(t.adjustments || []), newAdjustment]
        }
      })
    )
  }

  const handleCreateInvoice = (timesheetId: string) => {
    setTimesheets(current => {
      const timesheet = current.find(t => t.id === timesheetId)
      if (!timesheet) return current

      setInvoices(currentInvoices => {
        const newInvoice: Invoice = {
          id: `INV-${Date.now()}`,
          invoiceNumber: `INV-${String(currentInvoices.length + 1).padStart(5, '0')}`,
          clientName: timesheet.clientName,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: timesheet.amount,
          status: 'draft',
          currency: 'GBP'
        }

        toast.success(`Invoice ${newInvoice.invoiceNumber} created`)
        return [...currentInvoices, newInvoice]
      })
      
      return current
    })
  }

  const handleCreateTimesheet = (data: {
    workerName: string
    clientName: string
    hours: number
    rate: number
    weekEnding: string
  }) => {
    const newTimesheet: Timesheet = {
      id: `TS-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: data.workerName,
      clientName: data.clientName,
      weekEnding: data.weekEnding,
      hours: data.hours,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      amount: data.hours * data.rate
    }

    setTimesheets(current => [...current, newTimesheet])
    toast.success('Timesheet created successfully')
  }

  const handleCreateDetailedTimesheet = (data: {
    workerName: string
    clientName: string
    weekEnding: string
    shifts: ShiftEntry[]
    totalHours: number
    totalAmount: number
    baseRate: number
  }) => {
    const newTimesheet: Timesheet = {
      id: `TS-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: data.workerName,
      clientName: data.clientName,
      weekEnding: data.weekEnding,
      hours: data.totalHours,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      amount: data.totalAmount,
      rate: data.baseRate,
      shifts: data.shifts
    }

    setTimesheets(current => [...current, newTimesheet])
    toast.success(`Detailed timesheet created with ${data.shifts.length} shifts`)
  }

  const handleBulkImport = (csvData: string) => {
    const lines = csvData.trim().split('\n')
    if (lines.length < 2) {
      toast.error('Invalid CSV format')
      return
    }

    const headers = lines[0].split(',').map(h => h.trim())
    const newTimesheets: Timesheet[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length !== headers.length) continue

      const workerName = values[headers.indexOf('workerName')] || values[0]
      const clientName = values[headers.indexOf('clientName')] || values[1]
      const hours = parseFloat(values[headers.indexOf('hours')] || values[2] || '0')
      const rate = parseFloat(values[headers.indexOf('rate')] || values[3] || '0')
      const weekEnding = values[headers.indexOf('weekEnding')] || values[4]

      if (workerName && clientName && hours > 0 && rate > 0) {
        newTimesheets.push({
          id: `TS-${Date.now()}-${i}`,
          workerId: `W-${Date.now()}-${i}`,
          workerName,
          clientName,
          weekEnding,
          hours,
          status: 'pending',
          submittedDate: new Date().toISOString(),
          amount: hours * rate
        })
      }
    }

    if (newTimesheets.length > 0) {
      setTimesheets(current => [...current, ...newTimesheets])
      toast.success(`Imported ${newTimesheets.length} timesheets`)
    } else {
      toast.error('No valid timesheets found in CSV')
    }
  }

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(current => 
      current.map(inv =>
        inv.id === invoiceId
          ? { ...inv, status: 'sent' as InvoiceStatus }
          : inv
      )
    )
    toast.success('Invoice sent to client via email')
  }

  const handleUploadDocument = (data: {
    workerId: string
    workerName: string
    documentType: string
    expiryDate: string
  }) => {
    const expiryDateObj = new Date(data.expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.floor((expiryDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    let status: ComplianceStatus = 'valid'
    if (daysUntilExpiry < 0) status = 'expired'
    else if (daysUntilExpiry < 30) status = 'expiring'

    const newDoc: ComplianceDocument = {
      id: `DOC-${Date.now()}`,
      workerId: data.workerId,
      workerName: data.workerName,
      documentType: data.documentType,
      expiryDate: data.expiryDate,
      status,
      daysUntilExpiry
    }

    setComplianceDocs(current => [...current, newDoc])
    
    if (status === 'expiring' || status === 'expired') {
      addNotification({
        type: 'compliance',
        priority: status === 'expired' ? 'urgent' : 'high',
        title: status === 'expired' ? 'Document Expired' : 'Document Expiring Soon',
        message: `${data.documentType} for ${data.workerName} ${status === 'expired' ? 'has expired' : `expires in ${daysUntilExpiry} days`}`,
        relatedId: newDoc.id
      })
    }
    
    toast.success('Document uploaded successfully')
  }

  const handleCreateExpense = (data: {
    workerName: string
    clientName: string
    date: string
    category: string
    description: string
    amount: number
    billable: boolean
  }) => {
    const newExpense: Expense = {
      id: `EXP-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: data.workerName,
      clientName: data.clientName,
      date: data.date,
      category: data.category,
      description: data.description,
      amount: data.amount,
      currency: 'GBP',
      status: 'pending',
      submittedDate: new Date().toISOString(),
      billable: data.billable
    }

    setExpenses(current => [...current, newExpense])
    addNotification({
      type: 'expense',
      priority: 'low',
      title: 'New Expense Submitted',
      message: `${data.workerName} submitted a £${data.amount.toFixed(2)} expense`,
      relatedId: newExpense.id
    })
    toast.success('Expense created successfully')
  }

  const handleApproveExpense = (id: string) => {
    setExpenses(current => 
      current.map(e =>
        e.id === id
          ? { ...e, status: 'approved' as ExpenseStatus, approvedDate: new Date().toISOString() }
          : e
      )
    )
    toast.success('Expense approved')
  }

  const handleRejectExpense = (id: string) => {
    setExpenses(current => 
      current.map(e =>
        e.id === id
          ? { ...e, status: 'rejected' as ExpenseStatus }
          : e
      )
    )
    toast.error('Expense rejected')
  }

  const handleCreatePlacementInvoice = (invoice: Invoice) => {
    setInvoices(current => [...current, invoice])
  }

  const handleCreateCreditNote = (creditNote: CreditNote, creditInvoice: Invoice) => {
    setInvoices(current => [...current, creditInvoice])
  }

  return {
    handleApproveTimesheet,
    handleRejectTimesheet,
    handleAdjustTimesheet,
    handleCreateInvoice,
    handleCreateTimesheet,
    handleCreateDetailedTimesheet,
    handleBulkImport,
    handleSendInvoice,
    handleUploadDocument,
    handleCreateExpense,
    handleApproveExpense,
    handleRejectExpense,
    handleCreatePlacementInvoice,
    handleCreateCreditNote
  }
}
