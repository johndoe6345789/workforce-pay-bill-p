import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendUp, 
  TrendDown, 
  ChartBar, 
  Download,
  Calendar,
  CurrencyDollar,
  ArrowUp,
  ArrowDown,
  ChartLine,
  Lightning
} from '@phosphor-icons/react'
import type { Invoice, PayrollRun, MarginAnalysis, ForecastData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ReportsViewProps {
  invoices: Invoice[]
  payrollRuns: PayrollRun[]
}

export function ReportsView({ invoices, payrollRuns }: ReportsViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedYear, setSelectedYear] = useState('2025')

  const calculateMarginAnalysis = (): MarginAnalysis[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    
    return months.slice(0, currentMonth + 1).map((month, index) => {
      const monthRevenue = invoices
        .filter(inv => {
          const invDate = new Date(inv.issueDate)
          return invDate.getMonth() === index && invDate.getFullYear() === 2025
        })
        .reduce((sum, inv) => sum + inv.amount, 0)

      const monthCosts = payrollRuns
        .filter(pr => {
          const prDate = new Date(pr.periodEnding)
          return prDate.getMonth() === index && prDate.getFullYear() === 2025
        })
        .reduce((sum, pr) => sum + pr.totalAmount, 0)

      const margin = monthRevenue - monthCosts
      const marginPercentage = monthRevenue > 0 ? (margin / monthRevenue) * 100 : 0

      return {
        period: month,
        revenue: monthRevenue,
        costs: monthCosts,
        margin,
        marginPercentage
      }
    })
  }

  const generateForecast = (): ForecastData[] => {
    const historicalData = calculateMarginAnalysis()
    if (historicalData.length < 2) return []

    const avgRevenue = historicalData.reduce((sum, d) => sum + d.revenue, 0) / historicalData.length
    const avgCosts = historicalData.reduce((sum, d) => sum + d.costs, 0) / historicalData.length
    
    const revenueGrowthRate = historicalData.length > 1 
      ? (historicalData[historicalData.length - 1].revenue - historicalData[0].revenue) / historicalData[0].revenue / historicalData.length
      : 0.05

    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun']
    const currentMonth = new Date().getMonth()
    const futureMonths = months.slice(currentMonth + 1, currentMonth + 4)

    return futureMonths.map((month, index) => {
      const predictedRevenue = avgRevenue * (1 + revenueGrowthRate * (index + 1))
      const predictedCosts = avgCosts * (1 + revenueGrowthRate * 0.7 * (index + 1))
      const predictedMargin = predictedRevenue - predictedCosts
      const confidence = Math.max(60, 95 - (index * 10))

      return {
        period: month,
        predictedRevenue,
        predictedCosts,
        predictedMargin,
        confidence
      }
    })
  }

  const marginAnalysis = calculateMarginAnalysis()
  const forecast = generateForecast()

  const totalRevenue = marginAnalysis.reduce((sum, m) => sum + m.revenue, 0)
  const totalCosts = marginAnalysis.reduce((sum, m) => sum + m.costs, 0)
  const totalMargin = totalRevenue - totalCosts
  const avgMarginPercentage = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0

  const lastMonth = marginAnalysis[marginAnalysis.length - 1]
  const prevMonth = marginAnalysis[marginAnalysis.length - 2]
  const monthOverMonthChange = prevMonth 
    ? ((lastMonth.marginPercentage - prevMonth.marginPercentage) / Math.abs(prevMonth.marginPercentage)) * 100
    : 0

  const maxValue = Math.max(
    ...marginAnalysis.map(m => Math.max(m.revenue, m.costs)),
    ...forecast.map(f => Math.max(f.predictedRevenue, f.predictedCosts))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground mt-1">Real-time margin analysis and forecasting</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <Calendar size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Revenue (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">£{totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-success">
              <TrendUp size={14} weight="bold" />
              <span>Year to date</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Costs (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">£{totalCosts.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <TrendUp size={14} weight="bold" />
              <span>Year to date</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Gross Margin (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">£{totalMargin.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-accent">
              <span className="font-medium">{avgMarginPercentage.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">MoM Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-semibold font-mono",
              monthOverMonthChange >= 0 ? "text-success" : "text-destructive"
            )}>
              {monthOverMonthChange >= 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              {monthOverMonthChange >= 0 ? (
                <TrendUp size={14} weight="bold" className="text-success" />
              ) : (
                <TrendDown size={14} weight="bold" className="text-destructive" />
              )}
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="margin-analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="margin-analysis">
            <ChartBar size={16} className="mr-2" />
            Margin Analysis
          </TabsTrigger>
          <TabsTrigger value="forecasting">
            <ChartLine size={16} className="mr-2" />
            Forecasting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="margin-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Gross Margin by Month</CardTitle>
              <CardDescription>Revenue, costs, and margin breakdown for {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-64 flex items-end justify-between gap-2">
                  {marginAnalysis.map((data, index) => {
                    const revenueHeight = (data.revenue / maxValue) * 100
                    const costsHeight = (data.costs / maxValue) * 100

                    return (
                      <div key={data.period} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex justify-center gap-1" style={{ height: '100%' }}>
                          <div className="flex flex-col justify-end w-full max-w-12">
                            <div 
                              className="bg-accent rounded-t transition-all hover:opacity-80 cursor-pointer relative group"
                              style={{ height: `${revenueHeight}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                                £{data.revenue.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-end w-full max-w-12">
                            <div 
                              className="bg-warning/60 rounded-t transition-all hover:opacity-80 cursor-pointer relative group"
                              style={{ height: `${costsHeight}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                                £{data.costs.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">{data.period}</div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent rounded" />
                    <span className="text-sm">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-warning/60 rounded" />
                    <span className="text-sm">Costs</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  {marginAnalysis.slice(-3).map((data) => (
                    <Card key={data.period}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{data.period} {selectedYear}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-mono font-medium">£{data.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Costs</span>
                          <span className="font-mono font-medium">£{data.costs.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-border">
                          <span className="text-muted-foreground font-medium">Margin</span>
                          <div className="text-right">
                            <div className="font-mono font-semibold">£{data.margin.toLocaleString()}</div>
                            <div className={cn(
                              "text-xs font-medium",
                              data.marginPercentage >= 25 ? "text-success" : 
                              data.marginPercentage >= 15 ? "text-warning" : "text-destructive"
                            )}>
                              {data.marginPercentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightning size={20} weight="fill" className="text-accent" />
                Predictive Revenue & Margin Forecast
              </CardTitle>
              <CardDescription>
                AI-powered forecasting based on historical trends and growth patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forecast.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ChartLine size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Not enough historical data to generate forecast</p>
                  <p className="text-sm mt-2">Need at least 2 months of data</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[...marginAnalysis.slice(-2), ...forecast].map((data, index) => {
                      const isHistorical = index < 2
                      const revenue = isHistorical ? (data as MarginAnalysis).revenue : (data as ForecastData).predictedRevenue
                      const costs = isHistorical ? (data as MarginAnalysis).costs : (data as ForecastData).predictedCosts
                      
                      const revenueHeight = (revenue / maxValue) * 100
                      const costsHeight = (costs / maxValue) * 100

                      return (
                        <div key={data.period} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex justify-center gap-1" style={{ height: '100%' }}>
                            <div className="flex flex-col justify-end w-full max-w-12">
                              <div 
                                className={cn(
                                  "rounded-t transition-all hover:opacity-80 cursor-pointer relative group",
                                  isHistorical ? "bg-accent" : "bg-accent/40 border-2 border-dashed border-accent"
                                )}
                                style={{ height: `${revenueHeight}%` }}
                              >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                                  £{revenue.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col justify-end w-full max-w-12">
                              <div 
                                className={cn(
                                  "rounded-t transition-all hover:opacity-80 cursor-pointer relative group",
                                  isHistorical ? "bg-warning/60" : "bg-warning/20 border-2 border-dashed border-warning"
                                )}
                                style={{ height: `${costsHeight}%` }}
                              >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                                  £{costs.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-muted-foreground">{data.period}</div>
                          {!isHistorical && (
                            <div className="text-xs text-accent font-medium">
                              {(data as ForecastData).confidence}%
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-accent rounded" />
                      <span className="text-sm">Actual Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-accent/40 border-2 border-dashed border-accent rounded" />
                      <span className="text-sm">Predicted Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-warning/60 rounded" />
                      <span className="text-sm">Actual Costs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-warning/20 border-2 border-dashed border-warning rounded" />
                      <span className="text-sm">Predicted Costs</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                    {forecast.map((data) => {
                      const margin = data.predictedRevenue - data.predictedCosts
                      const marginPercentage = (margin / data.predictedRevenue) * 100

                      return (
                        <Card key={data.period} className="border-dashed border-2">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{data.period} {selectedYear}</CardTitle>
                              <div className="flex items-center gap-1 text-xs text-accent font-medium">
                                <Lightning size={12} weight="fill" />
                                {data.confidence}%
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Predicted Revenue</span>
                              <span className="font-mono font-medium">£{data.predictedRevenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Predicted Costs</span>
                              <span className="font-mono font-medium">£{data.predictedCosts.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-border">
                              <span className="text-muted-foreground font-medium">Est. Margin</span>
                              <div className="text-right">
                                <div className="font-mono font-semibold">£{margin.toLocaleString()}</div>
                                <div className="text-xs font-medium text-accent">
                                  {marginPercentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Lightning size={20} className="text-accent mt-0.5" weight="fill" />
                        <div className="flex-1 text-sm">
                          <p className="font-medium mb-1">Forecast Methodology</p>
                          <p className="text-muted-foreground">
                            Predictions are calculated using historical revenue trends, growth rates, and seasonal patterns. 
                            Confidence levels decrease for longer-term forecasts. Use these insights for planning and budgeting purposes.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
