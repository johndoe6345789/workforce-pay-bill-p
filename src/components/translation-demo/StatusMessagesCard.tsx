import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Warning, XCircle, Info } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'
import type React from 'react'

const STATUS_ICONS: { Icon: React.ElementType; colorClass: string; key: string }[] = [
  { Icon: CheckCircle, colorClass: 'text-success', key: 'common.success' },
  { Icon: Warning, colorClass: 'text-warning', key: 'common.warning' },
  { Icon: XCircle, colorClass: 'text-destructive', key: 'common.error' },
  { Icon: Info, colorClass: 'text-info', key: 'common.info' },
]

const TIMESHEET_STATUSES = ['draft', 'submitted', 'approved', 'rejected', 'processed'] as const

export function StatusMessagesCard() {
  const { t } = useTranslation()
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Status Messages</CardTitle>
          <CardDescription>System statuses and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {STATUS_ICONS.map(({ Icon, colorClass, key }) => (
              <div key={key} className="flex items-center gap-2">
                <Icon size={20} className={colorClass} />
                <span className="text-sm">{t(key)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timesheet Statuses</CardTitle>
          <CardDescription>Document lifecycle states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {TIMESHEET_STATUSES.map(status => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm capitalize">{status}</span>
                <Badge variant="secondary">{t(`timesheets.status.${status}`)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
