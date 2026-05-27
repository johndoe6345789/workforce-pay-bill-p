import { CalendarBlank, Users, CurrencyDollar, CheckCircle } from '@phosphor-icons/react'
import type React from 'react'
import { cn } from '@/lib/utils'
import type { PayrollRun } from '@/lib/types'

const DATE_FORMAT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }

interface Cell {
  Icon: React.ElementType; iconBg: string; iconColor: string
  label: string; value: React.ReactNode
}

function buildCells(r: PayrollRun): Cell[] {
  return [
    { Icon: CalendarBlank, iconBg: 'bg-accent/10', iconColor: 'text-accent', label: 'Period Ending',
      value: <p className="font-semibold">{new Date(r.periodEnding).toLocaleDateString('en-GB', DATE_FORMAT)}</p> },
    { Icon: Users, iconBg: 'bg-accent/10', iconColor: 'text-accent', label: 'Workers Included',
      value: <p className="font-semibold font-mono">{r.workersCount}</p> },
    { Icon: CurrencyDollar, iconBg: 'bg-success/10', iconColor: 'text-success', label: 'Total Amount',
      value: <p className="text-2xl font-semibold font-mono">£{r.totalAmount.toLocaleString()}</p> },
    ...(r.processedDate ? [{
      Icon: CheckCircle, iconBg: 'bg-accent/10', iconColor: 'text-success', label: 'Processed Date',
      value: <p className="font-semibold">{new Date(r.processedDate).toLocaleDateString('en-GB', DATE_FORMAT)}</p>,
    }] : []),
  ]
}

interface Props { payrollRun: PayrollRun }

export function PayrollInfoGrid({ payrollRun }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {buildCells(payrollRun).map(({ Icon, iconBg, iconColor, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <div className={cn('p-2 rounded-lg', iconBg)}>
            <Icon size={20} weight="fill" className={iconColor} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}
