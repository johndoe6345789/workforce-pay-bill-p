import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Receipt, Plus, Pencil, Trash, Eye, Palette } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { InvoiceTemplate } from '@/lib/types'
import { useTranslation } from '@/hooks/use-translation'

export function InvoiceTemplateManager() {
  const { t } = useTranslation()
  const [templates = [], setTemplates] = useKV<InvoiceTemplate[]>('invoice-templates', [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<InvoiceTemplate | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    headerText: '',
    footerText: '',
    defaultPaymentTerms: 'Net 30',
    accentColor: '#3b82f6'
  })

  const defaultTemplates: InvoiceTemplate[] = [
    {
      id: 'standard',
      name: 'Standard Invoice',
      headerText: 'Thank you for your business',
      footerText: 'Payment is due within the specified terms. Late payments may incur additional charges.',
      defaultPaymentTerms: 'Net 30',
      accentColor: '#3b82f6'
    },
    {
      id: 'professional',
      name: 'Professional Services',
      headerText: 'Professional Services Rendered',
      footerText: 'All services provided in accordance with our master services agreement. Payment terms as agreed.',
      defaultPaymentTerms: 'Net 14',
      accentColor: '#8b5cf6'
    },
    {
      id: 'staffing',
      name: 'Staffing Agency',
      headerText: 'Temporary Staffing Services',
      footerText: 'Invoice covers temporary worker hours for the period specified. Please remit payment by due date.',
      defaultPaymentTerms: 'Net 7',
      accentColor: '#10b981'
    }
  ]

  const initializeTemplates = () => {
    if (templates.length === 0) {
      setTemplates(defaultTemplates)
      toast.success(t('invoiceTemplates.defaultsLoaded'))
    }
  }

  const handleCreateTemplate = () => {
    const newTemplate: InvoiceTemplate = {
      id: `template-${Date.now()}`,
      name: formData.name,
      headerText: formData.headerText,
      footerText: formData.footerText,
      defaultPaymentTerms: formData.defaultPaymentTerms,
      accentColor: formData.accentColor
    }

    setTemplates(current => [...(current || []), newTemplate])
    toast.success(t('invoiceTemplates.templateCreated'))
    setIsCreateOpen(false)
    resetForm()
  }

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return

    setTemplates(current =>
      (current || []).map(t =>
        t.id === editingTemplate.id
          ? {
              ...t,
              name: formData.name,
              headerText: formData.headerText,
              footerText: formData.footerText,
              defaultPaymentTerms: formData.defaultPaymentTerms,
              accentColor: formData.accentColor
            }
          : t
      )
    )
    toast.success(t('invoiceTemplates.templateUpdated'))
    setEditingTemplate(null)
    resetForm()
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(current => (current || []).filter(t => t.id !== id))
    toast.success(t('invoiceTemplates.templateDeleted'))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      headerText: '',
      footerText: '',
      defaultPaymentTerms: 'Net 30',
      accentColor: '#3b82f6'
    })
  }

  const openEditDialog = (template: InvoiceTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      headerText: template.headerText,
      footerText: template.footerText,
      defaultPaymentTerms: template.defaultPaymentTerms,
      accentColor: template.accentColor
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('invoiceTemplates.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('invoiceTemplates.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {templates.length === 0 && (
            <Button variant="outline" onClick={initializeTemplates}>
              {t('invoiceTemplates.loadDefaults')}
            </Button>
          )}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                {t('invoiceTemplates.createTemplate')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('invoiceTemplates.createTemplate')}</DialogTitle>
                <DialogDescription>
                  {t('invoiceTemplates.subtitle')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">{t('invoiceTemplates.templateName')}</Label>
                  <Input
                    id="template-name"
                    placeholder={t('invoiceTemplates.templateNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="header-text">{t('invoiceTemplates.headerText')}</Label>
                  <Input
                    id="header-text"
                    placeholder={t('invoiceTemplates.headerTextPlaceholder')}
                    value={formData.headerText}
                    onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer-text">{t('invoiceTemplates.footerText')}</Label>
                  <Textarea
                    id="footer-text"
                    placeholder={t('invoiceTemplates.footerTextPlaceholder')}
                    value={formData.footerText}
                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Default Payment Terms</Label>
                  <Input
                    id="payment-terms"
                    placeholder="e.g., Net 30"
                    value={formData.defaultPaymentTerms}
                    onChange={(e) => setFormData({ ...formData, defaultPaymentTerms: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm() }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate} disabled={!formData.name}>
                  Create Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {templates.length === 0 ? (
        <Card className="p-12 text-center">
          <Receipt size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No invoice templates</h3>
          <p className="text-muted-foreground mb-4">Create templates or load defaults to get started</p>
          <Button onClick={initializeTemplates}>Load Default Templates</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: template.accentColor + '20' }}
                      >
                        <Receipt 
                          size={20} 
                          weight="fill"
                          style={{ color: template.accentColor }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {template.defaultPaymentTerms}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Header:</p>
                      <p className="font-medium">{template.headerText || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Footer:</p>
                      <p className="font-medium line-clamp-2">{template.footerText || 'None'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground">Accent Color:</p>
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: template.accentColor }}
                      />
                      <code className="text-xs">{template.accentColor}</code>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setPreviewTemplate(template)}
                      className="flex-1"
                    >
                      <Eye size={16} className="mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(template)}>
                      <Pencil size={16} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteTemplate(template.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={(open) => { if (!open) { setEditingTemplate(null); resetForm() } }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Invoice Template</DialogTitle>
              <DialogDescription>
                Update the invoice template design
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-name">Template Name</Label>
                <Input
                  id="edit-template-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-header-text">Header Text</Label>
                <Input
                  id="edit-header-text"
                  value={formData.headerText}
                  onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-footer-text">Footer Text</Label>
                <Textarea
                  id="edit-footer-text"
                  value={formData.footerText}
                  onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-payment-terms">Default Payment Terms</Label>
                <Input
                  id="edit-payment-terms"
                  value={formData.defaultPaymentTerms}
                  onChange={(e) => setFormData({ ...formData, defaultPaymentTerms: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-accent-color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-accent-color"
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setEditingTemplate(null); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTemplate}>
                Update Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={(open) => { if (!open) setPreviewTemplate(null) }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Preview</DialogTitle>
              <DialogDescription>
                Preview of {previewTemplate.name}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div 
                className="bg-background border-2 rounded-lg p-8 space-y-6"
                style={{ borderColor: previewTemplate.accentColor }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h1 
                      className="text-3xl font-bold mb-2"
                      style={{ color: previewTemplate.accentColor }}
                    >
                      INVOICE
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {previewTemplate.headerText}
                    </p>
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

                <div>
                  <table className="w-full">
                    <thead>
                      <tr 
                        className="border-b-2"
                        style={{ borderColor: previewTemplate.accentColor }}
                      >
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Quantity</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">Professional Services</td>
                        <td className="text-right">40</td>
                        <td className="text-right font-mono">£25.00</td>
                        <td className="text-right font-mono">£1,000.00</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Consulting</td>
                        <td className="text-right">10</td>
                        <td className="text-right font-mono">£50.00</td>
                        <td className="text-right font-mono">£500.00</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="text-right py-3 font-semibold">Total:</td>
                        <td 
                          className="text-right py-3 font-bold text-xl font-mono"
                          style={{ color: previewTemplate.accentColor }}
                        >
                          £1,500.00
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div 
                  className="pt-4 border-t text-sm"
                  style={{ borderColor: previewTemplate.accentColor }}
                >
                  <p className="font-semibold mb-2">Payment Terms: {previewTemplate.defaultPaymentTerms}</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {previewTemplate.footerText}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setPreviewTemplate(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
