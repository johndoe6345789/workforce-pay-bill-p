import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Envelope, Eye, Pencil, Trash } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { TYPE_COLORS } from '@/hooks/useEmailTemplateManager'
import type { EmailTemplate } from '@/lib/types'

interface Props {
  template: EmailTemplate
  onPreview: (t: EmailTemplate) => void
  onEdit: (t: EmailTemplate) => void
  onDelete: (id: string) => void
}

export function EmailTemplateCard({ template, onPreview, onEdit, onDelete }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Envelope size={20} className="text-primary" />
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <Badge className={cn('text-xs', TYPE_COLORS[template.type])}>{template.type}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Subject:</p>
                <p className="font-medium truncate">{template.subject}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Variables:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.variables.map(v => (
                    <Badge key={v} variant="outline" className="text-xs font-mono">{`{{${v}}}`}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={() => onPreview(template)}><Eye size={16} className="mr-2" />Preview</Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(template)}><Pencil size={16} /></Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(template.id)}><Trash size={16} /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
