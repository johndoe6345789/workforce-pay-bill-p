import { Plus, ChartLine } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Stack } from '@/components/ui/stack'
import { PermanentPlacementInvoice } from '@/components/PermanentPlacementInvoice'
import { CreditNoteGenerator } from '@/components/CreditNoteGenerator'
import { InvoiceDetailDialog } from '@/components/InvoiceDetailDialog'
import { CreateInvoiceDialog } from '@/components/CreateInvoiceDialog'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import { AdvancedDataTable } from '@/components/AdvancedDataTable'
import { LiveRefreshIndicator } from '@/components/LiveRefreshIndicator'
import { BillingAnalytics } from '@/components/billing/BillingAnalytics'
import { useBillingView } from '@/hooks/useBillingView'
import type { RateCard } from '@/lib/types'

interface BillingViewProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  rateCards: RateCard[]
}

export function BillingView({ searchQuery: _searchQuery, setSearchQuery: _setSearchQuery, rateCards }: BillingViewProps) {
  const vm = useBillingView({ rateCards })

  return (
    <Stack spacing={6}>
      <div className="flex items-center justify-between">
        <PageHeader
          title={vm.t('billing.title')}
          description={vm.t('billing.subtitle')}
          actions={
            <Stack direction="horizontal" spacing={2}>
              <Button variant="outline" onClick={() => vm.setShowAnalytics(!vm.showAnalytics)}>
                <ChartLine size={18} className="mr-2" />
                {vm.showAnalytics ? vm.t('billing.hideAnalytics') : vm.t('billing.showAnalytics')}
              </Button>
              <PermanentPlacementInvoice onCreateInvoice={vm.handleCreatePlacementInvoice} />
              <CreditNoteGenerator invoices={vm.invoices} onCreateCreditNote={vm.handleCreateCreditNote} />
              <Button onClick={() => vm.setShowCreateDialog(true)}>
                <Plus size={18} className="mr-2" />{vm.t('billing.createInvoice')}
              </Button>
            </Stack>
          }
        />
        <LiveRefreshIndicator lastUpdated={vm.lastUpdated} pollingInterval={1000} />
      </div>

      <CreateInvoiceDialog
        open={vm.showCreateDialog}
        onOpenChange={vm.setShowCreateDialog}
        onCreateInvoice={async invoice => { await vm.createInvoice(invoice) }}
      />

      {vm.showAnalytics && (
        <BillingAnalytics
          totalRevenue={vm.totalRevenue}
          draftCount={vm.draftInvoices.length}
          overdueCount={vm.overdueInvoices.length}
          agingData={vm.agingData}
          t={vm.t}
        />
      )}

      <AdvancedSearch
        items={vm.invoices}
        fields={vm.invoiceFields}
        onResultsChange={vm.handleResultsChange}
        placeholder={vm.t('billing.searchPlaceholder')}
      />

      <AdvancedDataTable
        data={vm.filteredInvoices}
        columns={vm.invoiceColumns}
        rowKey="id"
        onRowClick={invoice => vm.setViewingInvoice(invoice)}
        emptyMessage={vm.t('billing.noInvoicesFound')}
        showSearch={true}
        showPagination={true}
        showExport={true}
        exportFilename={`invoices-${new Date().toISOString().split('T')[0]}`}
        initialPageSize={20}
      />

      <InvoiceDetailDialog
        invoice={vm.viewingInvoice}
        open={vm.viewingInvoice !== null}
        onOpenChange={open => { if (!open) vm.setViewingInvoice(null) }}
        onSendInvoice={vm.handleSendInvoice}
      />
    </Stack>
  )
}
