import { toast } from 'sonner'
import { useDataExport } from '@/hooks/use-data-export'
import { usePDFExport } from '@/hooks/use-pdf-export'
import type { MarginAnalysis, ForecastData } from '@/lib/types'
import { buildPDFSections } from './use-reports-pdf-sections'

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
      const sections = buildPDFSections({
        totalRevenue, totalCosts, totalMargin, avgMarginPercentage,
        marginAnalysis, forecast,
      })
      exportReportToPDF(
        {
          title: `Financial Report ${selectedYear}`,
          summary: `Comprehensive financial analysis for the year ${selectedYear}`,
          sections,
        },
        { filename: `financial-report-${selectedYear}`, orientation: 'portrait', pageSize: 'a4' }
      )
      toast.success(t('reports.exportSuccess') ?? 'PDF report exported successfully')
    } catch { toast.error(t('reports.exportError') ?? 'Failed to export PDF') }
  }

  return { handleExportMarginAnalysis, handleExportForecast, handleExportAll, handleExportPDF }
}
