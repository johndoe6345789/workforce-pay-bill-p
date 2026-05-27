import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendUp, TrendDown, ChartBar, Download, Calendar, CurrencyDollar, ChartLine, FilePdf } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useReportsView } from '@/hooks/useReportsView'
import { MarginAnalysisTab } from '@/components/reports/MarginAnalysisTab'
import { ForecastingTab } from '@/components/reports/ForecastingTab'

export function ReportsView() {
  const vm = useReportsView()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('reports.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('reports.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Select value={vm.selectedYear} onValueChange={vm.setSelectedYear}>
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
          <Button variant="outline" onClick={vm.handleExportPDF}>
            <FilePdf size={18} className="mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={vm.handleExportAll}>
            <Download size={18} className="mr-2" />
            {vm.t('reports.exportReport')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-success/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{vm.t('reports.totalRevenueYTD')}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">£{vm.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-success"><TrendUp size={14} weight="bold" /><span>{vm.t('reports.yearToDate')}</span></div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-warning/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{vm.t('reports.totalCostsYTD')}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">£{vm.totalCosts.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><TrendUp size={14} weight="bold" /><span>{vm.t('reports.yearToDate')}</span></div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-accent/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{vm.t('reports.grossMarginYTD')}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">£{vm.totalMargin.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-accent"><span className="font-medium">{vm.avgMarginPercentage.toFixed(1)}%</span></div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-primary/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{vm.t('reports.momChange')}</CardTitle></CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-semibold font-mono', vm.monthOverMonthChange >= 0 ? 'text-success' : 'text-destructive')}>
              {vm.monthOverMonthChange >= 0 ? '+' : ''}{vm.monthOverMonthChange.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              {vm.monthOverMonthChange >= 0
                ? <TrendUp size={14} weight="bold" className="text-success" />
                : <TrendDown size={14} weight="bold" className="text-destructive" />}
              <span>{vm.t('reports.vsLastMonth')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="margin-analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="margin-analysis">
            <ChartBar size={16} className="mr-2" />
            {vm.t('reports.tabs.marginAnalysis')}
          </TabsTrigger>
          <TabsTrigger value="forecasting">
            <ChartLine size={16} className="mr-2" />
            {vm.t('reports.tabs.forecasting')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="margin-analysis" className="space-y-4">
          <MarginAnalysisTab
            marginAnalysis={vm.marginAnalysis}
            maxValue={vm.maxValue}
            selectedYear={vm.selectedYear}
            onExport={vm.handleExportMarginAnalysis}
            t={vm.t}
          />
        </TabsContent>
        <TabsContent value="forecasting" className="space-y-4">
          <ForecastingTab
            marginAnalysis={vm.marginAnalysis}
            forecast={vm.forecast}
            maxValue={vm.maxValue}
            selectedYear={vm.selectedYear}
            onExport={vm.handleExportForecast}
            t={vm.t}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
