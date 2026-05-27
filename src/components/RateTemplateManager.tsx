import { CurrencyCircleDollar } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RateTemplateCard } from '@/components/rate-templates/RateTemplateCard'
import { RateTemplateFormDialog } from '@/components/rate-templates/RateTemplateFormDialog'
import { useRateTemplateManager } from '@/hooks/useRateTemplateManager'

export function RateTemplateManager() {
  const vm = useRateTemplateManager()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('rateTemplates.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('rateTemplates.subtitle')}</p>
        </div>
        <RateTemplateFormDialog
          open={vm.isDialogOpen}
          onOpenChange={vm.setIsDialogOpen}
          isEditing={!!vm.editingTemplate}
          formData={vm.formData}
          setFormData={vm.setFormData}
          onSubmit={vm.editingTemplate ? vm.handleUpdate : vm.handleCreate}
          onCancel={vm.resetForm}
          t={vm.t}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('rateTemplates.totalTemplates')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.templates.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('rateTemplates.activeTemplates')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.templates.filter(t => t.isActive).length}</div></CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {!vm.templates.length ? (
          <Card className="p-12 text-center">
            <CardContent>
              <CurrencyCircleDollar size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{vm.t('rateTemplates.noTemplates')}</h3>
              <p className="text-muted-foreground">{vm.t('rateTemplates.noTemplatesDescription')}</p>
            </CardContent>
          </Card>
        ) : vm.templates.map(template => (
          <RateTemplateCard
            key={template.id}
            template={template}
            onToggle={vm.toggleActive}
            onDuplicate={vm.handleDuplicate}
            onEdit={vm.handleEdit}
            onDelete={vm.handleDelete}
            t={vm.t}
          />
        ))}
      </div>
    </div>
  )
}
