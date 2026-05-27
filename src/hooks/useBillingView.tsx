import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Envelope, FilePdf, Trash } from '@phosphor-icons/react'
import { TableColumn } from '@/hooks/use-advanced-table'
import { useInvoicing } from '@/hooks/use-invoicing'
import { useInvoicesCrud } from '@/hooks/use-invoices-crud'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import type { Invoice, RateCard } from '@/lib/types'
import type { FilterField } from '@/components/AdvancedSearch'

interface Options {
  rateCards: RateCard[]
}

export function useBillingView({ rateCards: _rateCards }: Options) {
  const { t } = useTranslation()
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const { invoices, createInvoice, updateInvoice, deleteInvoice, lastUpdated } =
    useInvoicesCrud({ liveRefresh: true, pollingInterval: 1000 })

  const { calculateInvoiceAging, getOverdueInvoices, calculateTotalRevenue, getInvoicesByStatus } = useInvoicing()

  useEffect(() => { setFilteredInvoices(invoices) }, [invoices])

  const handleResultsChange = useCallback((results: Invoice[]) => { setFilteredInvoices(results) }, [])

  const handleSendInvoice = useCallback(async (invoiceId: string) => {
    try {
      await updateInvoice(invoiceId, { status: 'sent' })
      toast.success(t('billing.invoiceSentSuccess'))
    } catch { toast.error(t('billing.invoiceSentError')) }
  }, [updateInvoice, t])

  const handleCreatePlacementInvoice = useCallback(async (invoice: Omit<Invoice, 'id'>) => {
    try {
      await createInvoice(invoice)
      toast.success(t('billing.placementInvoiceCreatedSuccess'))
    } catch { toast.error(t('billing.placementInvoiceCreatedError')) }
  }, [createInvoice, t])

  const handleCreateCreditNote = useCallback(async (creditNote: any, creditInvoice: Invoice) => {
    try {
      await createInvoice({ ...creditNote, type: 'credit', relatedInvoiceId: creditInvoice.id })
      toast.success(t('billing.creditNoteCreatedSuccess'))
    } catch { toast.error(t('billing.creditNoteCreatedError')) }
  }, [createInvoice, t])

  const handleDeleteInvoice = useCallback(async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId)
      toast.success(t('billing.invoiceDeletedSuccess'))
      if (viewingInvoice?.id === invoiceId) setViewingInvoice(null)
    } catch { toast.error(t('billing.invoiceDeletedError')) }
  }, [deleteInvoice, viewingInvoice, t])

  const agingData = useMemo(() => calculateInvoiceAging(), [calculateInvoiceAging])
  const overdueInvoices = useMemo(() => getOverdueInvoices(), [getOverdueInvoices])
  const totalRevenue = useMemo(() => calculateTotalRevenue(), [calculateTotalRevenue])
  const draftInvoices = useMemo(() => getInvoicesByStatus('draft'), [getInvoicesByStatus])

  const invoiceFields: FilterField[] = [
    { name: 'invoiceNumber', label: t('billing.invoiceNumber'), type: 'text' },
    { name: 'clientName', label: t('billing.clientName'), type: 'text' },
    { name: 'status', label: t('common.status'), type: 'select', options: [
      { value: 'draft', label: t('billing.status.draft') },
      { value: 'sent', label: t('billing.status.sent') },
      { value: 'paid', label: t('billing.status.paid') },
      { value: 'overdue', label: t('billing.status.overdue') },
    ]},
    { name: 'amount', label: t('billing.amount'), type: 'number' },
    { name: 'currency', label: t('billing.currency'), type: 'select', options: [
      { value: 'GBP', label: 'GBP' },
      { value: 'USD', label: 'USD' },
      { value: 'EUR', label: 'EUR' },
    ]},
    { name: 'issueDate', label: t('billing.issueDate'), type: 'date' },
    { name: 'dueDate', label: t('billing.dueDate'), type: 'date' },
  ]

  const invoiceColumns: TableColumn<Invoice>[] = useMemo(() => [
    { key: 'invoiceNumber', label: t('billing.invoiceNumber'), sortable: true, render: v => <span className="font-mono font-semibold">{v as string}</span> },
    { key: 'clientName', label: t('billing.client'), sortable: true },
    { key: 'issueDate', label: t('billing.issueDate'), sortable: true, render: v => new Date(v as string).toLocaleDateString() },
    { key: 'dueDate', label: t('billing.dueDate'), sortable: true, render: v => new Date(v as string).toLocaleDateString() },
    {
      key: 'amount', label: t('billing.amount'), sortable: true,
      render: (v, row) => {
        const sym = row.currency === 'GBP' ? '£' : row.currency === 'EUR' ? '€' : '$'
        return <span className="font-mono font-semibold">{sym}{(v as number).toLocaleString()}</span>
      }
    },
    { key: 'currency', label: t('billing.currency'), sortable: true, render: v => <span className="font-mono">{v as string}</span> },
    {
      key: 'status', label: t('common.status'), sortable: true,
      render: v => (
        <Badge variant={v === 'paid' ? 'success' : v === 'overdue' ? 'destructive' : v === 'sent' ? 'default' : 'outline'}>
          {t(`billing.status.${v}`)}
        </Badge>
      )
    },
    {
      key: 'id', label: t('common.actions'), sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => setViewingInvoice(row)} title={t('billing.view')}><Eye size={16} /></Button>
          {row.status === 'draft' && (
            <Button size="sm" variant="ghost" className="text-primary hover:text-primary" onClick={() => handleSendInvoice(row.id)} title={t('billing.send')}><Envelope size={16} /></Button>
          )}
          <Button size="sm" variant="ghost" title={t('billing.pdf')}><FilePdf size={16} /></Button>
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteInvoice(row.id)} title={t('common.delete')}><Trash size={16} /></Button>
        </div>
      )
    },
  ], [t, handleSendInvoice, handleDeleteInvoice])

  return {
    t,
    invoices, createInvoice, lastUpdated,
    viewingInvoice, setViewingInvoice,
    filteredInvoices,
    showAnalytics, setShowAnalytics,
    showCreateDialog, setShowCreateDialog,
    handleResultsChange,
    handleSendInvoice,
    handleCreatePlacementInvoice,
    handleCreateCreditNote,
    handleDeleteInvoice,
    agingData, overdueInvoices, totalRevenue, draftInvoices,
    invoiceFields, invoiceColumns,
  }
}
