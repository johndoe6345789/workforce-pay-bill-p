import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CurrencyCircleDollar, Pencil, Trash, Copy } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { RateTemplate } from '@/hooks/useRateTemplateManager'

interface Props {
  template: RateTemplate
  onToggle: (id: string) => void
  onDuplicate: (t: RateTemplate) => void
  onEdit: (t: RateTemplate) => void
  onDelete: (id: string) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function RateTemplateCard({ template, onToggle, onDuplicate, onEdit, onDelete, t }: Props) {
  return (
    <Card className={cn(!template.isActive && 'opacity-60')}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <CurrencyCircleDollar size={24} className="text-primary" weight="fill" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <Badge variant={template.isActive ? 'success' : 'outline'}>{template.isActive ? t('rateTemplates.active') : t('rateTemplates.inactive')}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.role}{template.client && ` • ${template.client}`}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              {[
                { label: t('rateTemplates.standard'), value: template.standardRate },
                { label: t('rateTemplates.overtime'), value: template.overtimeRate },
                { label: t('rateTemplates.weekend'), value: template.weekendRate },
                { label: t('rateTemplates.night'), value: template.nightShiftRate },
                { label: t('rateTemplates.holiday'), value: template.holidayRate },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-muted-foreground">{label}</p>
                  <p className="font-semibold font-mono">£{value.toFixed(2)}{t('rateTemplates.perHour')}</p>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('rateTemplates.effectiveFromDate', { date: new Date(template.effectiveFrom).toLocaleDateString() })} • {t('rateTemplates.currency')}: {template.currency}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={() => onToggle(template.id)}>{template.isActive ? t('rateTemplates.deactivate') : t('rateTemplates.activate')}</Button>
            <Button size="sm" variant="outline" onClick={() => onDuplicate(template)}><Copy size={16} /></Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(template)}><Pencil size={16} /></Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(template.id)}><Trash size={16} /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
