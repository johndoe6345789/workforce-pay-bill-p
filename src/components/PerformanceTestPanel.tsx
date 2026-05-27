import { usePerformanceTestPanel } from '@/hooks/usePerformanceTestPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Flask, Trash, ChartBar } from '@phosphor-icons/react'
import { PerformanceTestResults } from '@/components/performance/PerformanceTestResults'
import type { DatasetType } from '@/hooks/use-performance-test'

const DATASET_OPTIONS: { value: DatasetType; label: string }[] = [
  { value: 'timesheets', label: 'Timesheets' },
  { value: 'invoices', label: 'Invoices' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'workers', label: 'Workers' },
]

export function PerformanceTestPanel() {
  const vm = usePerformanceTestPanel()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flask className="text-accent" />
          Performance Testing
        </CardTitle>
        <CardDescription>
          Generate large datasets to test performance and memory usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Dataset Type</label>
            <Select value={vm.datasetType} onValueChange={v => vm.setDatasetType(v as DatasetType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DATASET_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Item Count</label>
            <Input
              type="number"
              value={vm.count}
              onChange={e => vm.setCount(Number(e.target.value))}
              min={100} max={100000} step={100}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={vm.runTest} disabled={vm.isGenerating} className="flex-1">
            {vm.isGenerating ? <><Spinner className="mr-2" />Generating...</> : <><Flask className="mr-2" />Run Test</>}
          </Button>
          <Button variant="outline" onClick={vm.viewFullReport}>
            <ChartBar className="mr-2" />View Report
          </Button>
          <Button variant="outline" onClick={vm.clearResults}>
            <Trash className="mr-2" />Clear
          </Button>
        </div>

        <PerformanceTestResults report={vm.report} />
      </CardContent>
    </Card>
  )
}
