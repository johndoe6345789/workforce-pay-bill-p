import { CheckCircle, Warning, XCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import type { ComplianceDocument } from '@/lib/types'

const STATUS_CONFIG = {
  valid: { Icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
  expiring: { Icon: Warning, color: 'text-warning', bgColor: 'bg-warning/10' },
  expired: { Icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
} as const

interface Props {
  document: ComplianceDocument
  onViewDetails?: (document: ComplianceDocument) => void
}

export function ComplianceCard({ document, onViewDetails }: Props) {
  const { t } = useTranslation()
  const { Icon, color, bgColor } = STATUS_CONFIG[document.status]

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails?.(document)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <Stack spacing={3} className="flex-1">
            <Stack direction="horizontal" spacing={3} align="start">
              <div className={cn('p-2 rounded-lg', bgColor)}>
                <Icon size={20} weight="fill" className={color} />
              </div>
              <div className="flex-1">
                <Stack direction="horizontal" spacing={3} align="center" className="mb-1">
                  <h3 className="font-semibold">{document.workerName}</h3>
                  <Badge variant={document.status === 'valid' ? 'success' : document.status === 'expiring' ? 'warning' : 'destructive'}>
                    {t(`compliance.status.${document.status}`)}
                  </Badge>
                </Stack>
                <Grid cols={3} gap={4} className="text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('compliance.card.documentType')}</p>
                    <p className="font-medium">{document.documentType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('compliance.card.expiryDate')}</p>
                    <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('compliance.card.daysUntilExpiry')}</p>
                    <p className={cn('font-medium font-mono',
                      document.daysUntilExpiry < 0 ? 'text-destructive' :
                      document.daysUntilExpiry < 30 ? 'text-warning' : 'text-success'
                    )}>
                      {document.daysUntilExpiry < 0
                        ? t('compliance.card.expired')
                        : t('compliance.card.daysLabel', { days: document.daysUntilExpiry })}
                    </p>
                  </div>
                </Grid>
              </div>
            </Stack>
          </Stack>
          <Stack direction="horizontal" spacing={2} className="ml-4" onClick={e => e.stopPropagation()}>
            <Button size="sm" variant="outline">{t('compliance.card.view')}</Button>
            <Button size="sm">{t('compliance.card.uploadNew')}</Button>
          </Stack>
        </div>
      </CardContent>
    </Card>
  )
}
