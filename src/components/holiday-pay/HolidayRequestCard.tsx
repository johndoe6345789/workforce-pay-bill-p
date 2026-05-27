import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle } from '@phosphor-icons/react'
import type { HolidayRequest } from '@/hooks/useHolidayPayManager'

interface Props {
  request: HolidayRequest
  onApprove: (id: string) => void
  onReject: (id: string) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

const STATUS_ICON: Record<HolidayRequest['status'], React.ReactNode> = {
  pending: <Clock size={24} className="text-warning" weight="fill" />,
  approved: <CheckCircle size={24} className="text-success" weight="fill" />,
  rejected: <Clock size={24} className="text-destructive" weight="fill" />,
}

export function HolidayRequestCard({ request, onApprove, onReject, t }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              {STATUS_ICON[request.status]}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{request.workerName}</h3>
                  <Badge variant={request.status === 'approved' ? 'success' : request.status === 'rejected' ? 'destructive' : 'warning'}>
                    {t(`holidayPay.status.${request.status}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('holidayPay.requestedOn', { date: new Date(request.requestedDate).toLocaleDateString() })}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-muted-foreground">{t('holidayPay.startDate')}</p><p className="font-medium">{new Date(request.startDate).toLocaleDateString()}</p></div>
              <div><p className="text-muted-foreground">{t('holidayPay.endDate')}</p><p className="font-medium">{new Date(request.endDate).toLocaleDateString()}</p></div>
              <div><p className="text-muted-foreground">{t('holidayPay.days')}</p><p className="font-semibold font-mono">{request.days}</p></div>
            </div>
          </div>
          {request.status === 'pending' && (
            <div className="flex gap-2 ml-4">
              <Button size="sm" onClick={() => onApprove(request.id)} style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>
                <CheckCircle size={16} className="mr-2" />{t('holidayPay.approve')}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onReject(request.id)}>{t('holidayPay.reject')}</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
