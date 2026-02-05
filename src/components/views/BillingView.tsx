import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Plus,
  Download,
  Receipt,
  Envelope,
  ChartLine,
  Warning,
  Trash,
  Eye,
  FilePdf
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { MetricCard } from '@/components/ui/metric-card'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { PermanentPlacementInvoice } from '@/components/PermanentPlacementInvoice'
import { CreditNoteGenerator } from '@/components/CreditNoteGenerator'
import { InvoiceDetailDialog } from '@/components/InvoiceDetailDialog'
import { CreateInvoiceDialog } from '@/components/CreateInvoiceDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { AdvancedDataTable } from '@/components/AdvancedDataTable'
import { LiveRefreshIndicator } from '@/components/LiveRefreshIndicator'
import { TableColumn } from '@/hooks/use-advanced-table'
import { useInvoicing } from '@/hooks/use-invoicing'
import { useInvoicesCrud } from '@/hooks/use-invoices-crud'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import type { Invoice, RateCard } from '@/lib/types'

interface BillingViewProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  rateCards: RateCard[]
}

export function BillingView({ 
  searchQuery, 
  setSearchQuery,
  rateCards 
}: BillingViewProps) {
  const { t } = useTranslation()
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  const {
    invoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    lastUpdated
  } = useInvoicesCrud({ liveRefresh: true, pollingInterval: 1000 })
  
  const {
    calculateInvoiceAging,
    getOverdueInvoices,
    calculateTotalRevenue,
    getInvoicesByStatus
  } = useInvoicing()
  
  useEffect(() => {
    setFilteredInvoices(invoices)
  }, [invoices])
  
  const handleResultsChange = useCallback((results: Invoice[]) => {
    setFilteredInvoices(results)
  }, [])

  const handleSendInvoice = useCallback(async (invoiceId: string) => {
    try {
      await updateInvoice(invoiceId, { status: 'sent' })
      toast.success(t('billing.invoiceSentSuccess'))
    } catch (error) {
      toast.error(t('billing.invoiceSentError'))
    }
  }, [updateInvoice, t])

  const handleCreatePlacementInvoice = useCallback(async (invoice: Omit<Invoice, 'id'>) => {
    try {
      await createInvoice(invoice)
      toast.success(t('billing.placementInvoiceCreatedSuccess'))
    } catch (error) {
      toast.error(t('billing.placementInvoiceCreatedError'))
    }
  }, [createInvoice, t])

  const handleCreateCreditNote = useCallback(async (creditNote: any, creditInvoice: Invoice) => {
    try {
      await createInvoice({
        ...creditNote,
        type: 'credit',
        relatedInvoiceId: creditInvoice.id
      })
      toast.success(t('billing.creditNoteCreatedSuccess'))
    } catch (error) {
      toast.error(t('billing.creditNoteCreatedError'))
    }
  }, [createInvoice, t])

  const handleDeleteInvoice = useCallback(async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId)
      toast.success(t('billing.invoiceDeletedSuccess'))
      if (viewingInvoice?.id === invoiceId) {
        setViewingInvoice(null)
      }
    } catch (error) {
      toast.error(t('billing.invoiceDeletedError'))
    }
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
      { value: 'overdue', label: t('billing.status.overdue') }
    ]},
    { name: 'amount', label: t('billing.amount'), type: 'number' },
    { name: 'currency', label: t('billing.currency'), type: 'select', options: [
      { value: 'GBP', label: 'GBP' },
      { value: 'USD', label: 'USD' },
      { value: 'EUR', label: 'EUR' }
    ]},
    { name: 'issueDate', label: t('billing.issueDate'), type: 'date' },
    { name: 'dueDate', label: t('billing.dueDate'), type: 'date' }
  ]

  const invoiceColumns: TableColumn<Invoice>[] = useMemo(() => [
    {
      key: 'invoiceNumber',
      label: t('billing.invoiceNumber'),
      sortable: true,
      render: (value) => <span className="font-mono font-semibold">{value as string}</span>
    },
    {
      key: 'clientName',
      label: t('billing.client'),
      sortable: true,
    },
    {
      key: 'issueDate',
      label: t('billing.issueDate'),
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString()
    },
    {
      key: 'dueDate',
      label: t('billing.dueDate'),
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString()
    },
    {
      key: 'amount',
      label: t('billing.amount'),
      sortable: true,
      render: (value, row) => {
        const symbol = row.currency === 'GBP' ? '£' : row.currency === 'EUR' ? '€' : '$'
        return <span className="font-mono font-semibold">{symbol}{(value as number).toLocaleString()}</span>
      }
    },
    {
      key: 'currency',
      label: t('billing.currency'),
      sortable: true,
      render: (value) => <span className="font-mono">{value as string}</span>
    },
    {
      key: 'status',
      label: t('common.status'),
      sortable: true,
      render: (value) => (
        <Badge variant={
          value === 'paid' ? 'success' : 
          value === 'overdue' ? 'destructive' : 
          value === 'sent' ? 'default' :
          'outline'
        }>
          {t(`billing.status.${value}`)}
        </Badge>
      )
    },
    {
      key: 'id',
      label: t('common.actions'),
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setViewingInvoice(row)}
            title={t('billing.view')}
          >
            <Eye size={16} />
          </Button>
          {row.status === 'draft' && (
            <Button
              size="sm"
              variant="ghost"
              className="text-primary hover:text-primary"
              onClick={() => handleSendInvoice(row.id)}
              title={t('billing.send')}
            >
              <Envelope size={16} />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            title={t('billing.pdf')}
          >
            <FilePdf size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDeleteInvoice(row.id)}
            title={t('common.delete')}
          >
            <Trash size={16} />
          </Button>
        </div>
      )
    }
  ], [t, handleSendInvoice, handleDeleteInvoice])

  return (
    <Stack spacing={6}>
      <div className="flex items-center justify-between">
        <PageHeader
          title={t('billing.title')}
          description={t('billing.subtitle')}
          actions={
            <Stack direction="horizontal" spacing={2}>
              <Button 
                variant="outline" 
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                <ChartLine size={18} className="mr-2" />
                {showAnalytics ? t('billing.hideAnalytics') : t('billing.showAnalytics')}
              </Button>
              <PermanentPlacementInvoice onCreateInvoice={handleCreatePlacementInvoice} />
              <CreditNoteGenerator invoices={invoices} onCreateCreditNote={handleCreateCreditNote} />
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus size={18} className="mr-2" />
                {t('billing.createInvoice')}
              </Button>
            </Stack>
          }
        />
        <LiveRefreshIndicator 
          lastUpdated={lastUpdated} 
          pollingInterval={1000}
        />
      </div>

      <CreateInvoiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateInvoice={async (invoice) => {
          await createInvoice(invoice)
        }}
      />

      {showAnalytics && (
        <Stack spacing={4}>
          <Grid cols={4} gap={4} responsive>
            <MetricCard
              label={t('billing.totalRevenue')}
              value={`£${totalRevenue.toLocaleString()}`}
            />
            <MetricCard
              label={t('billing.draftInvoices')}
              value={draftInvoices.length}
            />
            <MetricCard
              label={t('billing.overdueInvoices')}
              value={overdueInvoices.length}
              description={overdueInvoices.length > 0 ? t('billing.actionNeeded') : t('billing.allCurrent')}
            />
            <MetricCard
              label={t('billing.outstanding')}
              value={`£${(agingData.current + agingData.days30 + agingData.days60 + agingData.days90 + agingData.over90).toLocaleString()}`}
            />
          </Grid>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('billing.invoiceAgingAnalysis')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('billing.current')}</div>
                  <div className="font-semibold font-mono">£{agingData.current.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('billing.days30')}</div>
                  <div className="font-semibold font-mono">£{agingData.days30.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('billing.days60')}</div>
                  <div className="font-semibold font-mono text-warning">£{agingData.days60.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('billing.days90')}</div>
                  <div className="font-semibold font-mono text-warning">£{agingData.days90.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('billing.over90')}</div>
                  <div className="font-semibold font-mono text-destructive">£{agingData.over90.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Stack>
      )}

      <AdvancedSearch
        items={invoices}
        fields={invoiceFields}
        onResultsChange={handleResultsChange}
        placeholder={t('billing.searchPlaceholder')}
      />

      <AdvancedDataTable
        data={filteredInvoices}
        columns={invoiceColumns}
        rowKey="id"
        onRowClick={(invoice) => setViewingInvoice(invoice)}
        emptyMessage={t('billing.noInvoicesFound')}
        showSearch={true}
        showPagination={true}
        showExport={true}
        exportFilename={`invoices-${new Date().toISOString().split('T')[0]}`}
        initialPageSize={20}
      />

      <InvoiceDetailDialog
        invoice={viewingInvoice}
        open={viewingInvoice !== null}
        onOpenChange={(open) => {
          if (!open) setViewingInvoice(null)
        }}
        onSendInvoice={handleSendInvoice}
      />
    </Stack>
  )
}
