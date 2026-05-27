import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface FormData {
  poNumber: string; clientName: string; clientId: string; expiryDate: string
  totalValue: string; currency: string; notes: string; approvedBy: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: FormData
  setFormData: (data: FormData) => void
  onCreate: () => void
}

export function POCreateDialog({ open, onOpenChange, formData, setFormData, onCreate }: Props) {
  const patch = (updates: Partial<FormData>) => setFormData({ ...formData, ...updates })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>Add a new purchase order from a client to track budget and invoice linking</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="po-number">PO Number *</Label>
            <Input id="po-number" value={formData.poNumber} onChange={e => patch({ poNumber: e.target.value })} placeholder="PO-2024-0001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="po-client">Client Name *</Label>
            <Input id="po-client" value={formData.clientName} onChange={e => patch({ clientName: e.target.value })} placeholder="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="po-value">Total Value *</Label>
            <Input id="po-value" type="number" step="0.01" min="0" value={formData.totalValue} onChange={e => patch({ totalValue: e.target.value })} placeholder="50000.00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="po-currency">Currency</Label>
            <Select value={formData.currency} onValueChange={currency => patch({ currency })}>
              <SelectTrigger id="po-currency"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="po-expiry">Expiry Date</Label>
            <Input id="po-expiry" type="date" value={formData.expiryDate} onChange={e => patch({ expiryDate: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="po-approved-by">Approved By</Label>
            <Input id="po-approved-by" value={formData.approvedBy} onChange={e => patch({ approvedBy: e.target.value })} placeholder="John Smith" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="po-notes">Notes</Label>
            <Textarea id="po-notes" value={formData.notes} onChange={e => patch({ notes: e.target.value })} placeholder="Additional information..." rows={3} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onCreate}>Create Purchase Order</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
