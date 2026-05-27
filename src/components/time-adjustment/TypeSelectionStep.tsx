import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Clock, CurrencyDollar, FileText } from '@phosphor-icons/react'

interface Props {
  value: 'time' | 'rate' | 'both'
  onChange: (v: 'time' | 'rate' | 'both') => void
}

const OPTIONS = [
  { value: 'time' as const, icon: Clock, title: 'Time Only', desc: 'Adjust the number of hours worked' },
  { value: 'rate' as const, icon: CurrencyDollar, title: 'Rate Only', desc: 'Adjust the hourly rate' },
  { value: 'both' as const, icon: FileText, title: 'Time & Rate', desc: 'Adjust both hours and rate' },
]

export function TypeSelectionStep({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <Label>What would you like to adjust?</Label>
      <div className="grid gap-3">
        {OPTIONS.map(({ value: v, icon: Icon, title, desc }) => (
          <Card key={v} className={`p-4 cursor-pointer transition-all hover:border-primary ${value === v ? 'border-primary bg-primary/5' : ''}`} onClick={() => onChange(v)}>
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 text-primary" size={20} />
              <div className="flex-1">
                <div className="font-medium">{title}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
