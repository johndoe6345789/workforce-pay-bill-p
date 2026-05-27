import { Card, CardContent } from '@/components/ui/card'
import { CalendarBlank, Users, CurrencyDollar } from '@phosphor-icons/react'

interface Props {
  workerCount: number
  timesheetCount: number
  totalAmount: number
}

export function PayrollSummaryCard({ workerCount, timesheetCount, totalAmount }: Props) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground" size={20} />
            <div><div className="text-2xl font-semibold">{workerCount}</div><div className="text-xs text-muted-foreground">Workers</div></div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarBlank className="text-muted-foreground" size={20} />
            <div><div className="text-2xl font-semibold">{timesheetCount}</div><div className="text-xs text-muted-foreground">Timesheets</div></div>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyDollar className="text-muted-foreground" size={20} />
            <div>
              <div className="text-2xl font-semibold">£{totalAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
              <div className="text-xs text-muted-foreground">Total Amount</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
