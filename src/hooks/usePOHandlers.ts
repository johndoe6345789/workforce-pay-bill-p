import { useDataExport } from '@/hooks/use-data-export'
import { toast } from 'sonner'
import type { PurchaseOrder, LinkedInvoice } from '@/lib/types'
import type { POFormData, GetStatusColor } from './usePurchaseOrderTracking.types'
import { EMPTY_FORM } from './usePurchaseOrderTracking.types'

type Inv = { id: string; invoiceNumber: string; amount: number; currency: string; clientName: string; status: string }
type T = (key: string, vars?: Record<string, unknown>) => string
export interface POHandlersParams {
  t: T; filteredPOs: PurchaseOrder[]; selectedPO: PurchaseOrder | null; invoices: Inv[]
  create: (po: PurchaseOrder) => Promise<void>; update: (id: string, patch: Partial<PurchaseOrder>) => Promise<void>; remove: (id: string) => Promise<void>
  setFormData: (d: POFormData) => void; setIsCreateOpen: (v: boolean) => void; setIsDetailOpen: (v: boolean) => void
  setIsLinkInvoiceOpen: (v: boolean) => void; setSelectedPO: (po: PurchaseOrder | null) => void; formData: POFormData
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-success/10 text-success-foreground border-success/30',
  'expiring-soon': 'bg-warning/10 text-warning-foreground border-warning/30',
  expired: 'bg-destructive/10 text-destructive-foreground border-destructive/30',
  fulfilled: 'bg-accent/10 text-accent-foreground border-accent/30',
  cancelled: 'bg-muted text-muted-foreground border-border',
}

export function usePOHandlers({ t, filteredPOs, selectedPO, invoices, create, update, remove, setFormData, setIsCreateOpen, setIsDetailOpen, setIsLinkInvoiceOpen, setSelectedPO, formData }: POHandlersParams) {
  const { exportToExcel } = useDataExport()
  const now = () => new Date().toISOString()
  const today = () => now().split('T')[0]

  const handleCreate = async () => {
    if (!formData.poNumber || !formData.clientName || !formData.totalValue) { toast.error(t('purchaseOrders.createDialog.fillAllFields')); return }
    const totalValue = parseFloat(formData.totalValue)
    if (isNaN(totalValue) || totalValue <= 0) { toast.error(t('purchaseOrders.createDialog.invalidValue')); return }
    const newPO: PurchaseOrder = {
      id: `PO-${Date.now()}`, poNumber: formData.poNumber, clientId: formData.clientId || `CLIENT-${Date.now()}`,
      clientName: formData.clientName, issueDate: today(), expiryDate: formData.expiryDate || undefined,
      totalValue, remainingValue: totalValue, utilisedValue: 0, status: 'active', currency: formData.currency,
      linkedInvoices: [], notes: formData.notes || undefined, approvedBy: formData.approvedBy || undefined,
      approvedDate: formData.approvedBy ? today() : undefined, createdBy: 'Current User', createdDate: now(), lastModifiedDate: now()
    }
    try { await create(newPO); toast.success(t('purchaseOrders.messages.createSuccess', { poNumber: newPO.poNumber })); setFormData({ ...EMPTY_FORM }); setIsCreateOpen(false) }
    catch { toast.error(t('purchaseOrders.messages.createError')) }
  }

  const handleLinkInvoice = async (invoiceId: string) => {
    if (!selectedPO) return
    const inv = invoices.find(i => i.id === invoiceId)
    if (!inv) { toast.error(t('purchaseOrders.messages.invoiceNotFound')); return }
    if (selectedPO.linkedInvoices.some(li => li.invoiceId === invoiceId)) { toast.error(t('purchaseOrders.messages.alreadyLinked')); return }
    if (inv.amount > selectedPO.remainingValue) toast.warning(t('purchaseOrders.messages.exceedsRemaining', { currency: inv.currency, amount: inv.amount, remaining: selectedPO.remainingValue }))
    const linked: LinkedInvoice = { invoiceId: inv.id, invoiceNumber: inv.invoiceNumber, amount: inv.amount, linkedDate: now(), linkedBy: 'Current User' }
    const patch = { linkedInvoices: [...selectedPO.linkedInvoices, linked], utilisedValue: selectedPO.utilisedValue + inv.amount, remainingValue: selectedPO.remainingValue - inv.amount, lastModifiedDate: now() }
    try { await update(selectedPO.id, patch); setSelectedPO({ ...selectedPO, ...patch }); toast.success(t('purchaseOrders.messages.linkSuccess', { invoiceNumber: inv.invoiceNumber, poNumber: selectedPO.poNumber })); setIsLinkInvoiceOpen(false) }
    catch { toast.error(t('purchaseOrders.messages.linkError')) }
  }

  const handleUnlinkInvoice = async (li: LinkedInvoice) => {
    if (!selectedPO) return
    const patch = { linkedInvoices: selectedPO.linkedInvoices.filter(x => x.invoiceId !== li.invoiceId), utilisedValue: selectedPO.utilisedValue - li.amount, remainingValue: selectedPO.remainingValue + li.amount, lastModifiedDate: now() }
    try { await update(selectedPO.id, patch); setSelectedPO({ ...selectedPO, ...patch }); toast.success(t('purchaseOrders.messages.unlinkSuccess', { invoiceNumber: li.invoiceNumber })) }
    catch { toast.error(t('purchaseOrders.messages.unlinkError')) }
  }

  const handleDelete = async (po: PurchaseOrder) => {
    if (po.linkedInvoices.length > 0) { toast.error(t('purchaseOrders.messages.cannotDeleteLinked')); return }
    try { await remove(po.id); toast.success(t('purchaseOrders.messages.deleteSuccess', { poNumber: po.poNumber })); if (selectedPO?.id === po.id) { setIsDetailOpen(false); setSelectedPO(null) } }
    catch { toast.error(t('purchaseOrders.messages.deleteError')) }
  }

  const handleViewDetails = (po: PurchaseOrder) => { setSelectedPO(po); setIsDetailOpen(true) }

  const handleExportPOs = () => {
    try {
      exportToExcel(filteredPOs.map(po => ({
        'PO Number': po.poNumber, 'Client': po.clientName, 'Status': po.status,
        'Issue Date': new Date(po.issueDate).toLocaleDateString(),
        'Expiry Date': po.expiryDate ? new Date(po.expiryDate).toLocaleDateString() : 'N/A',
        'Currency': po.currency, 'Total Value': po.totalValue, 'Utilised Value': po.utilisedValue,
        'Remaining Value': po.remainingValue, 'Utilization %': ((po.utilisedValue / po.totalValue) * 100).toFixed(2),
        'Linked Invoices': po.linkedInvoices.length, 'Created By': po.createdBy,
        'Created Date': new Date(po.createdDate).toLocaleDateString()
      })), { filename: `purchase-orders-${today()}` })
      toast.success(t('purchaseOrders.messages.exportSuccess') || 'Purchase orders exported successfully')
    } catch { toast.error(t('purchaseOrders.messages.exportError') || 'Failed to export purchase orders') }
  }

  const getStatusColor: GetStatusColor = status => STATUS_COLORS[status] ?? 'bg-muted text-muted-foreground border-border'

  return { handleCreate, handleLinkInvoice, handleUnlinkInvoice, handleDelete, handleViewDetails, handleExportPOs, getStatusColor }
}
