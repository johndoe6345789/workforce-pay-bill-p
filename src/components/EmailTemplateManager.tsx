import { Envelope, Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmailTemplateCard } from '@/components/email-templates/EmailTemplateCard'
import { EmailTemplateFormDialog } from '@/components/email-templates/EmailTemplateFormDialog'
import { EmailTemplatePreviewDialog } from '@/components/email-templates/EmailTemplatePreviewDialog'
import { useEmailTemplateManager } from '@/hooks/useEmailTemplateManager'

export function EmailTemplateManager() {
  const vm = useEmailTemplateManager()

  const tabDefs = [
    { value: 'all', label: `All Templates (${vm.templates.length})`, filter: () => vm.templates },
    { value: 'timesheet', label: `Timesheet (${vm.templates.filter(t => t.type === 'timesheet').length})`, filter: () => vm.templates.filter(t => t.type === 'timesheet') },
    { value: 'invoice', label: `Invoice (${vm.templates.filter(t => t.type === 'invoice').length})`, filter: () => vm.templates.filter(t => t.type === 'invoice') },
    { value: 'compliance', label: `Compliance (${vm.templates.filter(t => t.type === 'compliance').length})`, filter: () => vm.templates.filter(t => t.type === 'compliance') },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('emailTemplates.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('emailTemplates.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {!vm.templates.length && (
            <Button variant="outline" onClick={vm.initializeTemplates}>{vm.t('emailTemplates.loadDefaults')}</Button>
          )}
          <EmailTemplateFormDialog
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
            <Envelope size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No email templates</h3>
            <p className="text-muted-foreground mb-4">Create templates or load defaults to get started</p>
            <Button onClick={vm.initializeTemplates}><Plus size={18} className="mr-2" />Load Default Templates</Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            {tabDefs.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
          </TabsList>
          {tabDefs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-3 mt-4">
              {tab.filter().map(template => (
                <EmailTemplateCard
                  key={template.id}
                  template={template}
                  onPreview={vm.setPreviewTemplate}
                  onEdit={vm.openEditDialog}
                  onDelete={vm.handleDelete}
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <EmailTemplateFormDialog
        mode="edit"
        open={!!vm.editingTemplate}
        onOpenChange={open => { if (!open) { vm.setEditingTemplate(null); vm.resetForm() } }}
        formData={vm.formData}
        setFormData={vm.setFormData}
        onSubmit={vm.handleUpdate}
        onCancel={() => { vm.setEditingTemplate(null); vm.resetForm() }}
        t={vm.t}
      />

      <EmailTemplatePreviewDialog template={vm.previewTemplate} onClose={() => vm.setPreviewTemplate(null)} />
    </div>
  )
}
