import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChartBar, Download, Calendar, ChartLine, FilePdf } from '@phosphor-icons/react'
import { useReportsView } from '@/hooks/useReportsView'
import { MarginAnalysisTab } from '@/components/reports/MarginAnalysisTab'
import { ForecastingTab } from '@/components/reports/ForecastingTab'
import { ReportsMetricsGrid } from '@/components/reports/ReportsMetricsGrid'

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

      <ReportsMetricsGrid
        totalRevenue={vm.totalRevenue}
        totalCosts={vm.totalCosts}
        totalMargin={vm.totalMargin}
        avgMarginPercentage={vm.avgMarginPercentage}
        monthOverMonthChange={vm.monthOverMonthChange}
        t={vm.t}
      />

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
