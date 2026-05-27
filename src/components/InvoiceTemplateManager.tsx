import { Receipt, Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InvoiceTemplateCard } from '@/components/invoice-templates/InvoiceTemplateCard'
import { InvoiceTemplateFormDialog } from '@/components/invoice-templates/InvoiceTemplateFormDialog'
import { InvoiceTemplatePreviewDialog } from '@/components/invoice-templates/InvoiceTemplatePreviewDialog'
import { useInvoiceTemplateManager } from '@/hooks/useInvoiceTemplateManager'

export function InvoiceTemplateManager() {
  const vm = useInvoiceTemplateManager()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('invoiceTemplates.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('invoiceTemplates.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {!vm.templates.length && (
            <Button variant="outline" onClick={vm.initializeTemplates}>{vm.t('invoiceTemplates.loadDefaults')}</Button>
          )}
          <InvoiceTemplateFormDialog
            mode="create"
            open={vm.isCreateOpen}
            onOpenChange={vm.setIsCreateOpen}
            formData={vm.formData}
            setFormData={vm.setFormData}
            onSubmit={vm.handleCreate}
            onCancel={() => { vm.setIsCreateOpen(false); vm.resetForm() }}
            t={vm.t}
          />
        </div>
      </div>

      {!vm.templates.length ? (
        <Card className="p-12 text-center">
          <CardContent>
            <Receipt size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoice templates</h3>
            <p className="text-muted-foreground mb-4">Create templates or load defaults to get started</p>
            <Button onClick={vm.initializeTemplates}><Plus size={18} className="mr-2" />Load Default Templates</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vm.templates.map(template => (
            <InvoiceTemplateCard
              key={template.id}
              template={template}
              onPreview={vm.setPreviewTemplate}
              onEdit={vm.openEditDialog}
              onDelete={vm.handleDelete}
            />
          ))}
        </div>
      )}

      <InvoiceTemplateFormDialog
        mode="edit"
        open={!!vm.editingTemplate}
        onOpenChange={open => { if (!open) { vm.setEditingTemplate(null); vm.resetForm() } }}
        formData={vm.formData}
        setFormData={vm.setFormData}
        onSubmit={vm.handleUpdate}
        onCancel={() => { vm.setEditingTemplate(null); vm.resetForm() }}
        t={vm.t}
      />

      <InvoiceTemplatePreviewDialog template={vm.previewTemplate} onClose={() => vm.setPreviewTemplate(null)} />
    </div>
  )
}
