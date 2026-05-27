import { toast } from 'sonner'
import { useDataExport } from '@/hooks/use-data-export'
import { usePDFExport } from '@/hooks/use-pdf-export'
import type { PDFSection } from '@/hooks/use-pdf-export'
import type { MarginAnalysis, ForecastData } from '@/lib/types'

interface ExportDeps {
  marginAnalysis: MarginAnalysis[]
  forecast: ForecastData[]
  selectedYear: string
  totalRevenue: number
  totalCosts: number
  totalMargin: number
  avgMarginPercentage: number
  t: (key: string) => string | undefined
}

export function useReportsExports(deps: ExportDeps) {
  const { exportToCSV, exportToExcel } = useDataExport()
  const { exportReportToPDF } = usePDFExport()
  const {
    marginAnalysis, forecast, selectedYear,
    totalRevenue, totalCosts, totalMargin, avgMarginPercentage, t,
  } = deps

  const handleExportMarginAnalysis = () => {
    try {
      exportToCSV(
        marginAnalysis.map((item) => ({
          Period: item.period, Year: selectedYear,
          Revenue: item.revenue, Costs: item.costs,
          Margin: item.margin, 'Margin %': item.marginPercentage.toFixed(2),
        })),
        { filename: `margin-analysis-${selectedYear}` }
      )
      toast.success(t('reports.exportSuccess') ?? 'Margin analysis exported successfully')
    } catch { toast.error(t('reports.exportError') ?? 'Failed to export') }
  }

  const handleExportForecast = () => {
    try {
      exportToCSV(
        forecast.map((item) => ({
          Period: item.period, Year: selectedYear,
          'Predicted Revenue': item.predictedRevenue,
          'Predicted Costs': item.predictedCosts,
          'Predicted Margin': item.predictedMargin,
          'Confidence %': item.confidence,
        })),
        { filename: `forecast-${selectedYear}` }
      )
      toast.success(t('reports.exportSuccess') ?? 'Forecast data exported successfully')
    } catch { toast.error(t('reports.exportError') ?? 'Failed to export') }
  }

  const handleExportAll = () => {
    try {
      const data = [
        ...marginAnalysis.map((item) => ({
          Type: 'Actual', Period: item.period, Year: selectedYear,
          Revenue: item.revenue, Costs: item.costs, Margin: item.margin,
          'Margin %': item.marginPercentage.toFixed(2), Confidence: 100,
        })),
        ...forecast.map((item) => ({
          Type: 'Forecast', Period: item.period, Year: selectedYear,
          Revenue: item.predictedRevenue, Costs: item.predictedCosts,
          Margin: item.predictedMargin,
          'Margin %': ((item.predictedMargin / item.predictedRevenue) * 100).toFixed(2),
          Confidence: item.confidence,
        })),
      ]
      exportToExcel(data, { filename: `financial-report-${selectedYear}` })
      toast.success(t('reports.exportSuccess') ?? 'Complete report exported successfully')
    } catch { toast.error(t('reports.exportError') ?? 'Failed to export') }
  }

  const handleExportPDF = () => {
    try {
      const sections: PDFSection[] = [
        { type: 'heading', content: 'Financial Summary' },
        { type: 'spacer', height: 10 },
        { type: 'paragraph', content: `Total Revenue: $${totalRevenue.toLocaleString()}` },
        { type: 'paragraph', content: `Total Costs: $${totalCosts.toLocaleString()}` },
        { type: 'paragraph', content: `Total Margin: $${totalMargin.toLocaleString()}` },
        { type: 'paragraph', content: `Average Margin: ${avgMarginPercentage.toFixed(2)}%` },
        { type: 'spacer', height: 20 }, { type: 'divider' }, { type: 'spacer', height: 15 },
        { type: 'heading', content: 'Margin Analysis' },
        { type: 'spacer', height: 10 },
        {
          type: 'table',
          data: marginAnalysis.map((item) => ({
            period: item.period,
            revenue: `$${item.revenue.toLocaleString()}`,
            costs: `$${item.costs.toLocaleString()}`,
            margin: `$${item.margin.toLocaleString()}`,
            percentage: `${item.marginPercentage.toFixed(2)}%`,
          })),
          columns: [
            { header: 'Period', key: 'period', align: 'left' },
            { header: 'Revenue', key: 'revenue', align: 'right' },
            { header: 'Costs', key: 'costs', align: 'right' },
            { header: 'Margin', key: 'margin', align: 'right' },
            { header: 'Margin %', key: 'percentage', align: 'right' },
          ],
        },
      ]
      if (forecast.length > 0) {
        sections.push(
          { type: 'spacer', height: 20 }, { type: 'divider' }, { type: 'spacer', height: 15 },
          { type: 'heading', content: 'Financial Forecast' },
          { type: 'spacer', height: 10 },
          {
            type: 'table',
            data: forecast.map((item) => ({
              period: item.period,
              revenue: `$${item.predictedRevenue.toLocaleString()}`,
              costs: `$${item.predictedCosts.toLocaleString()}`,
              margin: `$${item.predictedMargin.toLocaleString()}`,
              confidence: `${item.confidence}%`,
            })),
            columns: [
              { header: 'Period', key: 'period', align: 'left' },
              { header: 'Predicted Revenue', key: 'revenue', align: 'right' },
              { header: 'Predicted Costs', key: 'costs', align: 'right' },
              { header: 'Predicted Margin', key: 'margin', align: 'right' },
              { header: 'Confidence', key: 'confidence', align: 'right' },
            ],
          }
        )
      }
      exportReportToPDF(
        { title: `Financial Report ${selectedYear}`, summary: `Comprehensive financial analysis for the year ${selectedYear}`, sections },
        { filename: `financial-report-${selectedYear}`, orientation: 'portrait', pageSize: 'a4' }
      )
      toast.success(t('reports.exportSuccess') ?? 'PDF report exported successfully')
    } catch { toast.error(t('reports.exportError') ?? 'Failed to export PDF') }
  }

  return { handleExportMarginAnalysis, handleExportForecast, handleExportAll, handleExportPDF }
}
