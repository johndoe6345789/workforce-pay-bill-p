import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { InvoiceTemplate } from '@/lib/types'

interface Props {
  template: InvoiceTemplate | null
  onClose: () => void
}

export function InvoiceTemplatePreviewDialog({ template, onClose }: Props) {
  if (!template) return null

  return (
    <Dialog open={!!template} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogDescription>Preview of {template.name}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-background border-2 rounded-lg p-8 space-y-6" style={{ borderColor: template.accentColor }}>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: template.accentColor }}>INVOICE</h1>
                <p className="text-sm text-muted-foreground">{template.headerText}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="font-mono font-semibold">INV-12345</p>
                <p className="text-sm text-muted-foreground mt-2">Date</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4 pb-4 border-t border-b">
              <div>
                <p className="text-sm text-muted-foreground mb-1">From</p>
                <p className="font-semibold">Your Company Name</p>
                <p className="text-sm">123 Business Street</p>
                <p className="text-sm">City, State 12345</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">To</p>
                <p className="font-semibold">Client Name</p>
                <p className="text-sm">456 Client Avenue</p>
                <p className="text-sm">City, State 67890</p>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b-2" style={{ borderColor: template.accentColor }}>
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-3">Professional Services</td><td className="text-right">40</td><td className="text-right font-mono">£25.00</td><td className="text-right font-mono">£1,000.00</td></tr>
                <tr className="border-b"><td className="py-3">Consulting</td><td className="text-right">10</td><td className="text-right font-mono">£50.00</td><td className="text-right font-mono">£500.00</td></tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right py-3 font-semibold">Total:</td>
                  <td className="text-right py-3 font-bold text-xl font-mono" style={{ color: template.accentColor }}>£1,500.00</td>
                </tr>
              </tfoot>
            </table>
            <div className="pt-4 border-t text-sm" style={{ borderColor: template.accentColor }}>
              <p className="font-semibold mb-2">Payment Terms: {template.defaultPaymentTerms}</p>
              <p className="text-muted-foreground whitespace-pre-wrap">{template.footerText}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
