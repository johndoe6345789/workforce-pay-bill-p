import { PageHeader } from '@/components/ui/page-header'
import { PerformanceTestPanel } from '@/components/PerformanceTestPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Flask, Info } from '@phosphor-icons/react'

export default function PerformanceTestView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Testing"
        description="Test system performance with large datasets and measure response times"
      />

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This testing suite helps identify performance bottlenecks by generating large datasets
          and measuring rendering times, memory usage, and system responsiveness. Use this to
          validate optimizations like virtual scrolling and adaptive polling.
        </AlertDescription>
      </Alert>

      <PerformanceTestPanel />

      <Card>
        <CardHeader>
          <CardTitle>Performance Optimization Features</CardTitle>
          <CardDescription>
            Features implemented to improve performance at scale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Virtual Scrolling</h4>
              <p className="text-sm text-muted-foreground">
                Only renders visible items in large lists, dramatically reducing DOM nodes and
                improving render performance for lists with 10,000+ items.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Adaptive Polling</h4>
              <p className="text-sm text-muted-foreground">
                Intelligently adjusts polling intervals based on success/error rates and network
                status, reducing unnecessary requests and battery usage.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Performance Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                Built-in performance measurement tools track render times, memory usage, and
                operation durations to identify bottlenecks.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Batch Data Generation</h4>
              <p className="text-sm text-muted-foreground">
                Generates large datasets in batches to prevent UI blocking, allowing for smooth
                testing of 100,000+ records.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
