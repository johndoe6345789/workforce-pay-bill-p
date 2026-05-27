import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PerformanceReport } from '@/hooks/use-performance-test'

interface Props {
  report: PerformanceReport
}

export function PerformanceTestResults({ report }: Props) {
  if (report.totalTests === 0) return null

  return (
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
            <div className="text-2xl font-bold">{report.averageGenerationTime.toFixed(2)}ms</div>
            <div className="text-xs text-muted-foreground">Avg Generation Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{report.totalItemsGenerated.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Items</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Recent Tests</h4>
        {report.results.slice(-5).reverse().map((result, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="outline">{result.datasetType}</Badge>
              <span className="text-sm">{result.count.toLocaleString()} items</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{result.generationTime.toFixed(2)}ms</span>
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
  )
}
