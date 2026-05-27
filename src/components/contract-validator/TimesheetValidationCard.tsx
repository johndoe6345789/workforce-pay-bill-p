import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from '@/hooks/use-translation'
import type { Timesheet } from '@/lib/types'

type CardType = 'error' | 'warning'

const TYPE_CONFIG: Record<CardType, { bg: string; badgeVariant: 'destructive' | 'warning'; alertClass: string; badgeKey: string; primaryCtaKey: string }> = {
  error: { bg: 'bg-destructive/5', badgeVariant: 'destructive', alertClass: '', badgeKey: 'contractValidator.error', primaryCtaKey: 'contractValidator.fixIssues' },
  warning: { bg: 'bg-warning/5', badgeVariant: 'warning', alertClass: 'border-warning', badgeKey: 'contractValidator.warning', primaryCtaKey: 'contractValidator.review' },
}

interface Props {
  timesheet: Timesheet
  messages: string[]
  type: CardType
}

export function TimesheetValidationCard({ timesheet, messages, type }: Props) {
  const { t } = useTranslation()
  const cfg = TYPE_CONFIG[type]

  return (
    <Card className={cfg.bg}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold">{timesheet.workerName}</h3>
              <Badge variant={cfg.badgeVariant}>{t(cfg.badgeKey)}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-muted-foreground">{t('contractValidator.client')}</p><p className="font-medium">{timesheet.clientName}</p></div>
              <div><p className="text-muted-foreground">{t('contractValidator.weekEnding')}</p><p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p></div>
              <div><p className="text-muted-foreground">{t('contractValidator.hours')}</p><p className="font-medium font-mono">{timesheet.hours}</p></div>
            </div>
            <div className="space-y-1 mt-3">
              {messages.map((msg, idx) => (
                <Alert key={idx} variant={type === 'error' ? 'destructive' : 'default'} className={`py-2 ${cfg.alertClass}`}>
                  <AlertDescription className="text-sm">{msg}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline">{t(cfg.primaryCtaKey)}</Button>
            {type === 'warning' && (
              <Button size="sm" style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>
                {t('contractValidator.approveAnyway')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
