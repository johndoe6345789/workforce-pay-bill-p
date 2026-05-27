import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Warning, CheckCircle, XCircle } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'
import type React from 'react'

interface SummaryItem { Icon: React.ElementType; iconClass: string; borderClass: string; titleKey: string; noteKey: string; count: number }

interface Props { errorCount: number; warningCount: number; compliantCount: number }

export function ContractValidationSummary({ errorCount, warningCount, compliantCount }: Props) {
  const { t } = useTranslation()

  const items: SummaryItem[] = [
    { Icon: XCircle, iconClass: 'text-destructive', borderClass: 'border-destructive/20', titleKey: 'contractValidator.validationErrors', noteKey: 'contractValidator.validationErrorsBlocked', count: errorCount },
    { Icon: Warning, iconClass: 'text-warning', borderClass: 'border-warning/20', titleKey: 'contractValidator.warnings', noteKey: 'contractValidator.warningsReview', count: warningCount },
    { Icon: CheckCircle, iconClass: 'text-success', borderClass: 'border-success/20', titleKey: 'contractValidator.compliant', noteKey: 'contractValidator.compliantReady', count: compliantCount },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map(({ Icon, iconClass, borderClass, titleKey, noteKey, count }) => (
        <Card key={titleKey} className={`border-l-4 ${borderClass}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Icon size={18} className={iconClass} weight="fill" />
              {t(titleKey)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{count}</div>
            <p className="text-sm text-muted-foreground mt-1">{t(noteKey)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
