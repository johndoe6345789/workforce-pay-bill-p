import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import type { EmailTemplate } from '@/lib/types'

interface Props {
  template: EmailTemplate | null
  onClose: () => void
}

export function EmailTemplatePreviewDialog({ template, onClose }: Props) {
  if (!template) return null

  return (
    <Dialog open={!!template} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Template Preview</DialogTitle>
          <DialogDescription>Preview how this email will appear</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Subject</Label>
            <div className="mt-1 p-3 bg-muted rounded-lg text-sm">{template.subject}</div>
          </div>
          <div>
            <Label>Body</Label>
            <div className="mt-1 p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">{template.body}</div>
          </div>
          <div>
            <Label>Variables</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {template.variables.map(v => (
                <Badge key={v} variant="outline" className="font-mono">{`{{${v}}}`}</Badge>
              ))}
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
