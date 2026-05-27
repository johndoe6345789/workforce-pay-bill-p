import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BATCH_TYPES } from '@/hooks/useWorkflowTemplateEditor'
import type { WorkflowTemplate } from '@/hooks/use-approval-workflow-templates'

interface Props {
  template: WorkflowTemplate
  patch: (updates: Partial<WorkflowTemplate>) => void
}

export function WorkflowTemplateDetailsCard({ template, patch }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Template Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tmpl-name">Template Name</Label>
            <Input id="tmpl-name" value={template.name} onChange={e => patch({ name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-type">Batch Type</Label>
            <Select value={template.batchType} onValueChange={value => patch({ batchType: value as WorkflowTemplate['batchType'] })}>
              <SelectTrigger id="batch-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {BATCH_TYPES.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={template.description} onChange={e => patch({ description: e.target.value })} rows={2} />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch id="is-active" checked={template.isActive} onCheckedChange={checked => patch({ isActive: checked })} />
            <Label htmlFor="is-active" className="cursor-pointer">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="is-default" checked={template.isDefault} onCheckedChange={checked => patch({ isDefault: checked })} />
            <Label htmlFor="is-default" className="cursor-pointer">Set as Default</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
