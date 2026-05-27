import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface Template { id: string; name: string; batchType: string }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  parallelTemplates: Template[]
  selectedTemplateId: string
  onTemplateChange: (id: string) => void
  entityId: string
  onEntityIdChange: (id: string) => void
  onSubmit: () => void
}

export function CreateWorkflowDialog({ open, onOpenChange, parallelTemplates, selectedTemplateId, onTemplateChange, entityId, onEntityIdChange, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Test Workflow</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-select">Select Template with Parallel Steps</Label>
            <Select value={selectedTemplateId} onValueChange={onTemplateChange}>
              <SelectTrigger id="template-select"><SelectValue placeholder="Choose a template..." /></SelectTrigger>
              <SelectContent>
                {parallelTemplates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name} ({t.batchType})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="entity-id">Entity ID</Label>
            <Input id="entity-id" placeholder="e.g., INV-12345" value={entityId} onChange={e => onEntityIdChange(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!selectedTemplateId || !entityId}>Create Workflow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
