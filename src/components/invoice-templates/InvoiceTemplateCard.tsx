import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Receipt, Eye, Pencil, Trash } from '@phosphor-icons/react'
import type { InvoiceTemplate } from '@/lib/types'

interface Props {
  template: InvoiceTemplate
  onPreview: (t: InvoiceTemplate) => void
  onEdit: (t: InvoiceTemplate) => void
  onDelete: (id: string) => void
}

export function InvoiceTemplateCard({ template, onPreview, onEdit, onDelete }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: template.accentColor + '20' }}>
                <Receipt size={20} weight="fill" style={{ color: template.accentColor }} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <Badge variant="outline" className="mt-1">{template.defaultPaymentTerms}</Badge>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div><p className="text-muted-foreground">Header:</p><p className="font-medium">{template.headerText || 'None'}</p></div>
            <div><p className="text-muted-foreground">Footer:</p><p className="font-medium line-clamp-2">{template.footerText || 'None'}</p></div>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Accent Color:</p>
              <div className="w-6 h-6 rounded border" style={{ backgroundColor: template.accentColor }} />
              <code className="text-xs">{template.accentColor}</code>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => onPreview(template)} className="flex-1"><Eye size={16} className="mr-2" />Preview</Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(template)}><Pencil size={16} /></Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(template.id)}><Trash size={16} /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
