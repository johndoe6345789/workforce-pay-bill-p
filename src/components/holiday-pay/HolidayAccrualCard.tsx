import { Card, CardContent } from '@/components/ui/card'
import { Airplane } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { HolidayAccrual } from '@/hooks/useHolidayPayManager'

interface Props {
  accrual: HolidayAccrual
  t: (key: string, params?: Record<string, unknown>) => string
}

export function HolidayAccrualCard({ accrual, t }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <Airplane size={24} className="text-primary" weight="fill" />
          <div>
            <h3 className="font-semibold text-lg">{accrual.workerName}</h3>
            <p className="text-sm text-muted-foreground">
              {t('holidayPay.lastUpdated', { date: new Date(accrual.lastUpdated).toLocaleDateString() })}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">{t('holidayPay.accrued')}</p>
            <p className="font-semibold font-mono text-lg">{t('holidayPay.daysLabel', { count: accrual.accruedDays.toFixed(1) })}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('holidayPay.taken')}</p>
            <p className="font-semibold font-mono text-lg">{t('holidayPay.daysLabel', { count: accrual.takenDays.toFixed(1) })}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('holidayPay.remaining')}</p>
            <p className={cn('font-semibold font-mono text-lg', accrual.remainingDays < 5 ? 'text-warning' : 'text-success')}>
              {t('holidayPay.daysLabel', { count: accrual.remainingDays.toFixed(1) })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
