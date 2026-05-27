import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FilterField } from '@/components/AdvancedSearch'

const OPERATORS = [
  { op: ':', desc: 'contains text' },
  { op: '=', desc: 'equals exactly' },
  { op: '> <', desc: 'greater/less than' },
  { op: 'in', desc: 'in list (comma-separated)' },
]

const EXAMPLES = [
  'status = pending',
  'workerName : Smith hours > 40',
  'status in pending,approved',
  'amount > 1000 sort amount desc',
]

interface Props {
  fields: FilterField[]
}

export function QueryHelp({ fields }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-1">Query Language Help</h4>
        <p className="text-xs text-muted-foreground">Build powerful queries using simple syntax</p>
      </div>
      <Card className="bg-muted/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm">Available Fields</CardTitle></CardHeader>
        <CardContent className="space-y-1">
          {fields.map(field => (
            <div key={field.name} className="flex items-center justify-between text-xs">
              <code className="bg-background px-1.5 py-0.5 rounded">{field.name}</code>
              <span className="text-muted-foreground">{field.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="space-y-2">
        <h5 className="text-sm font-semibold">Operators</h5>
        <div className="space-y-1 text-xs">
          {OPERATORS.map(({ op, desc }) => (
            <div key={op} className="flex items-center gap-2">
              <code className="bg-muted px-1.5 py-0.5 rounded">{op}</code>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h5 className="text-sm font-semibold">Examples</h5>
        <div className="space-y-1.5">
          {EXAMPLES.map(ex => (
            <div key={ex} className="bg-muted p-2 rounded text-xs font-mono">{ex}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
