import { Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { POForm } from '@/hooks/usePurchaseOrderManager'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: POForm
  patch: (updates: Partial<POForm>) => void
  onSubmit: () => void
}

export function CreatePODialog({ open, onOpenChange, form, patch, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button><Plus size={18} className="mr-2" />Create PO</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>Add a new purchase order from a client</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="po-number">PO Number *</Label>
            <Input id="po-number" value={form.poNumber} onChange={e => patch({ poNumber: e.target.value })} placeholder="PO-12345" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="po-client">Client Name *</Label>
            <Input id="po-client" value={form.clientName} onChange={e => patch({ clientName: e.target.value })} placeholder="Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po-value">Total Value (£) *</Label>
              <Input id="po-value" type="number" step="0.01" value={form.totalValue} onChange={e => patch({ totalValue: e.target.value })} placeholder="10000.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="po-expiry">Expiry Date</Label>
              <Input id="po-expiry" type="date" value={form.expiryDate} onChange={e => patch({ expiryDate: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="po-notes">Notes</Label>
            <Input id="po-notes" value={form.notes} onChange={e => patch({ notes: e.target.value })} placeholder="Additional information..." />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit}>Create Purchase Order</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
