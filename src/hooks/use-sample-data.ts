import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Timesheet, Invoice, Expense, ComplianceDocument } from '@/lib/types'

export function useSampleData() {
  const [hasInitialized, setHasInitialized] = useKV<boolean>('sample-data-initialized', false)
  const [, setTimesheets] = useKV<Timesheet[]>('timesheets', [])
  const [, setInvoices] = useKV<Invoice[]>('invoices', [])
  const [, setExpenses] = useKV<Expense[]>('expenses', [])
  const [, setComplianceDocs] = useKV<ComplianceDocument[]>('compliance-docs', [])

  useEffect(() => {
    if (hasInitialized) return

    const initializeData = async () => {
      const sampleTimesheets: Timesheet[] = [
        {
          id: 'TS-001',
          workerId: 'W-001',
          workerName: 'John Smith',
          clientName: 'Acme Corporation',
          weekEnding: '2025-01-17',
          hours: 40,
          status: 'pending',
          submittedDate: '2025-01-18T09:00:00Z',
          amount: 1200,
          rate: 30
        },
        {
          id: 'TS-002',
          workerId: 'W-002',
          workerName: 'Sarah Johnson',
          clientName: 'Tech Solutions Ltd',
          weekEnding: '2025-01-17',
          hours: 45,
          status: 'pending',
          submittedDate: '2025-01-18T10:30:00Z',
          amount: 1575,
          rate: 35
        },
        {
          id: 'TS-003',
          workerId: 'W-001',
          workerName: 'John Smith',
          clientName: 'Acme Corporation',
          weekEnding: '2025-01-10',
          hours: 37.5,
          status: 'approved',
          submittedDate: '2025-01-11T09:00:00Z',
          approvedDate: '2025-01-12T14:00:00Z',
          amount: 1125,
          rate: 30
        },
        {
          id: 'TS-004',
          workerId: 'W-003',
          workerName: 'Michael Brown',
          clientName: 'Global Industries',
          weekEnding: '2025-01-17',
          hours: 52,
          status: 'pending',
          submittedDate: '2025-01-18T11:00:00Z',
          amount: 1820,
          rate: 35
        },
        {
          id: 'TS-005',
          workerId: 'W-004',
          workerName: 'Emma Wilson',
          clientName: 'Tech Solutions Ltd',
          weekEnding: '2025-01-17',
          hours: 40,
          status: 'approved',
          submittedDate: '2025-01-18T08:30:00Z',
          approvedDate: '2025-01-18T15:00:00Z',
          amount: 1000,
          rate: 25
        }
      ]

      const sampleInvoices: Invoice[] = [
        {
          id: 'INV-001',
          invoiceNumber: 'INV-00001',
          clientName: 'Acme Corporation',
          issueDate: '2025-01-15',
          dueDate: '2025-02-14',
          amount: 5400,
          status: 'sent',
          currency: 'GBP'
        },
        {
          id: 'INV-002',
          invoiceNumber: 'INV-00002',
          clientName: 'Tech Solutions Ltd',
          issueDate: '2025-01-10',
          dueDate: '2025-02-09',
          amount: 3150,
          status: 'paid',
          currency: 'GBP'
        },
        {
          id: 'INV-003',
          invoiceNumber: 'INV-00003',
          clientName: 'Global Industries',
          issueDate: '2024-12-20',
          dueDate: '2025-01-19',
          amount: 8900,
          status: 'overdue',
          currency: 'GBP'
        },
        {
          id: 'INV-004',
          invoiceNumber: 'INV-00004',
          clientName: 'Tech Solutions Ltd',
          issueDate: '2025-01-18',
          dueDate: '2025-02-17',
          amount: 2500,
          status: 'draft',
          currency: 'GBP'
        }
      ]

      const sampleExpenses: Expense[] = [
        {
          id: 'EXP-001',
          workerId: 'W-001',
          workerName: 'John Smith',
          clientName: 'Acme Corporation',
          date: '2025-01-15',
          category: 'Travel',
          description: 'Train ticket to client site',
          amount: 45.50,
          currency: 'GBP',
          status: 'pending',
          submittedDate: '2025-01-16T10:00:00Z',
          billable: true
        },
        {
          id: 'EXP-002',
          workerId: 'W-002',
          workerName: 'Sarah Johnson',
          clientName: 'Tech Solutions Ltd',
          date: '2025-01-14',
          category: 'Meals',
          description: 'Lunch meeting with client team',
          amount: 35.00,
          currency: 'GBP',
          status: 'approved',
          submittedDate: '2025-01-15T09:00:00Z',
          approvedDate: '2025-01-16T11:00:00Z',
          billable: true
        },
        {
          id: 'EXP-003',
          workerId: 'W-003',
          workerName: 'Michael Brown',
          clientName: 'Global Industries',
          date: '2025-01-16',
          category: 'Accommodation',
          description: 'Hotel stay for 2 nights',
          amount: 240.00,
          currency: 'GBP',
          status: 'pending',
          submittedDate: '2025-01-17T08:30:00Z',
          billable: true
        },
        {
          id: 'EXP-004',
          workerId: 'W-001',
          workerName: 'John Smith',
          clientName: 'Acme Corporation',
          date: '2025-01-10',
          category: 'Equipment',
          description: 'Laptop accessories',
          amount: 85.00,
          currency: 'GBP',
          status: 'rejected',
          submittedDate: '2025-01-11T14:00:00Z',
          billable: false
        }
      ]

      const sampleComplianceDocs: ComplianceDocument[] = [
        {
          id: 'DOC-001',
          workerId: 'W-001',
          workerName: 'John Smith',
          documentType: 'DBS Check',
          expiryDate: '2025-02-15',
          status: 'expiring',
          daysUntilExpiry: 28
        },
        {
          id: 'DOC-002',
          workerId: 'W-002',
          workerName: 'Sarah Johnson',
          documentType: 'Right to Work',
          expiryDate: '2026-06-30',
          status: 'valid',
          daysUntilExpiry: 528
        },
        {
          id: 'DOC-003',
          workerId: 'W-003',
          workerName: 'Michael Brown',
          documentType: 'Professional License',
          expiryDate: '2025-01-10',
          status: 'expired',
          daysUntilExpiry: -8
        },
        {
          id: 'DOC-004',
          workerId: 'W-004',
          workerName: 'Emma Wilson',
          documentType: 'First Aid Certificate',
          expiryDate: '2025-03-20',
          status: 'valid',
          daysUntilExpiry: 61
        },
        {
          id: 'DOC-005',
          workerId: 'W-001',
          workerName: 'John Smith',
          documentType: 'Driving License',
          expiryDate: '2025-02-05',
          status: 'expiring',
          daysUntilExpiry: 18
        }
      ]

      setTimesheets(sampleTimesheets)
      setInvoices(sampleInvoices)
      setExpenses(sampleExpenses)
      setComplianceDocs(sampleComplianceDocs)
      setHasInitialized(true)
    }

    initializeData()
  }, [hasInitialized, setTimesheets, setInvoices, setExpenses, setComplianceDocs, setHasInitialized])
}
