import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, MagnifyingGlass, Download } from '@phosphor-icons/react'
import { usePurchaseOrderTracking } from '@/hooks/usePurchaseOrderTracking'
import { POCreateDialog } from '@/components/purchase-orders/POCreateDialog'
import { PODetailDialog } from '@/components/purchase-orders/PODetailDialog'
import { POMetricsGrid } from '@/components/purchase-orders/POMetricsGrid'
import { POTabs } from '@/components/purchase-orders/POTabs'

export function PurchaseOrderTracking() {
  const vm = usePurchaseOrderTracking()

  if (vm.isLoadingState) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">{vm.t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('purchaseOrders.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('purchaseOrders.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={vm.handleExportPOs} disabled={vm.filteredPOs.length === 0}>
            <Download size={18} className="mr-2" />
            {vm.t('purchaseOrders.export') || 'Export'}
          </Button>
          <Button onClick={() => vm.setIsCreateOpen(true)}>
            <Plus size={18} className="mr-2" />
            {vm.t('purchaseOrders.createPO')}
          </Button>
        </div>
      </div>

      <POMetricsGrid metrics={vm.metrics} totalPOs={vm.purchaseOrders.length} />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by PO number or client..."
            value={vm.searchQuery}
            onChange={e => vm.setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={vm.filterStatus} onValueChange={vm.setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <POTabs
        filteredPOs={vm.filteredPOs}
        purchaseOrders={vm.purchaseOrders}
        metrics={vm.metrics}
        onViewDetails={vm.handleViewDetails}
        onDelete={vm.handleDelete}
        getStatusColor={vm.getStatusColor}
      />

      <POCreateDialog
        open={vm.isCreateOpen}
        onOpenChange={vm.setIsCreateOpen}
        formData={vm.formData}
        setFormData={vm.setFormData}
        onCreate={vm.handleCreate}
      />

      {vm.selectedPO && (
        <PODetailDialog
          open={vm.isDetailOpen}
          onOpenChange={vm.setIsDetailOpen}
          selectedPO={vm.selectedPO}
          availableInvoices={vm.availableInvoices}
          isLinkInvoiceOpen={vm.isLinkInvoiceOpen}
          setIsLinkInvoiceOpen={vm.setIsLinkInvoiceOpen}
          handleUnlinkInvoice={vm.handleUnlinkInvoice}
          handleLinkInvoice={vm.handleLinkInvoice}
          getStatusColor={vm.getStatusColor}
        />
      )}
    </div>
  )
}
