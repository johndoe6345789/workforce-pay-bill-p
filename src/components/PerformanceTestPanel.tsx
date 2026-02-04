import { useState } from 'react'
import { usePerformanceTest, DatasetType } from '@/hooks/use-performance-test'
import { performanceMonitor } from '@/lib/performance-monitor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Flask, Trash, ChartBar } from '@phosphor-icons/react'

export function PerformanceTestPanel() {
  const [datasetType, setDatasetType] = useState<DatasetType>('timesheets')
  const [count, setCount] = useState(1000)
  const { generateTestData, clearResults, getReport, isGenerating, results } = usePerformanceTest()

  const runTest = async () => {
    await generateTestData(datasetType, count)
  }

  const viewFullReport = () => {
    performanceMonitor.logReport()
  }

  const report = getReport()

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
            <Select value={datasetType} onValueChange={(v) => setDatasetType(v as DatasetType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timesheets">Timesheets</SelectItem>
                <SelectItem value="invoices">Invoices</SelectItem>
                <SelectItem value="payroll">Payroll</SelectItem>
                <SelectItem value="workers">Workers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Item Count</label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              min={100}
              max={100000}
              step={100}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={runTest} disabled={isGenerating} className="flex-1">
            {isGenerating ? (
              <>
                <Spinner className="mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Flask className="mr-2" />
                Run Test
              </>
            )}
          </Button>

          <Button variant="outline" onClick={viewFullReport}>
            <ChartBar className="mr-2" />
            View Report
          </Button>

          <Button variant="outline" onClick={clearResults}>
            <Trash className="mr-2" />
            Clear
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{report.totalTests}</div>
                  <div className="text-xs text-muted-foreground">Total Tests</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {report.averageGenerationTime.toFixed(2)}ms
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Generation Time</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {report.totalItemsGenerated.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Items</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Tests</h4>
              {results.slice(-5).reverse().map((result, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{result.datasetType}</Badge>
                    <span className="text-sm">{result.count.toLocaleString()} items</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {result.generationTime.toFixed(2)}ms
                    </span>
                    {result.memoryUsed && (
                      <span className="text-xs text-muted-foreground">
                        {(result.memoryUsed / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
