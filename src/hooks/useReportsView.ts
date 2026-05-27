import { useState } from 'react'
import { toast } from 'sonner'
import { useInvoicesCrud } from '@/hooks/use-invoices-crud'
import { usePayrollCrud } from '@/hooks/use-payroll-crud'
import { useTranslation } from '@/hooks/use-translation'
import { useDataExport } from '@/hooks/use-data-export'
import { usePDFExport } from '@/hooks/use-pdf-export'
import type { PDFSection } from '@/hooks/use-pdf-export'
import type { MarginAnalysis, ForecastData } from '@/lib/types'

export function useReportsView() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedYear, setSelectedYear] = useState('2025')
  const { t } = useTranslation()
  const { invoices } = useInvoicesCrud()
  const { payrollRuns } = usePayrollCrud()
  const { exportToCSV, exportToExcel } = useDataExport()
  const { exportReportToPDF } = usePDFExport()

  const calculateMarginAnalysis = (): MarginAnalysis[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.slice(0, new Date().getMonth() + 1).map((month, index) => {
      const monthRevenue = invoices
        .filter(inv => { const d = new Date(inv.issueDate); return d.getMonth() === index && d.getFullYear() === 2025 })
        .reduce((sum, inv) => sum + inv.amount, 0)
      const monthCosts = payrollRuns
        .filter(pr => { const d = new Date(pr.periodEnding); return d.getMonth() === index && d.getFullYear() === 2025 })
        .reduce((sum, pr) => sum + pr.totalAmount, 0)
      const margin = monthRevenue - monthCosts
      return { period: month, revenue: monthRevenue, costs: monthCosts, margin, marginPercentage: monthRevenue > 0 ? (margin / monthRevenue) * 100 : 0 }
    })
  }

  const generateForecast = (historical: MarginAnalysis[]): ForecastData[] => {
    if (historical.length < 2) return []
    const avgRevenue = historical.reduce((sum, d) => sum + d.revenue, 0) / historical.length
    const avgCosts = historical.reduce((sum, d) => sum + d.costs, 0) / historical.length
    const revenueGrowthRate = historical[0].revenue > 0
      ? (historical[historical.length - 1].revenue - historical[0].revenue) / historical[0].revenue / historical.length
      : 0.05
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun']
    const currentMonth = new Date().getMonth()
    return months.slice(currentMonth + 1, currentMonth + 4).map((month, index) => ({
      period: month,
      predictedRevenue: avgRevenue * (1 + revenueGrowthRate * (index + 1)),
      predictedCosts: avgCosts * (1 + revenueGrowthRate * 0.7 * (index + 1)),
      predictedMargin: avgRevenue * (1 + revenueGrowthRate * (index + 1)) - avgCosts * (1 + revenueGrowthRate * 0.7 * (index + 1)),
      confidence: Math.max(60, 95 - (index * 10))
    }))
  }

  const marginAnalysis = calculateMarginAnalysis()
  const forecast = generateForecast(marginAnalysis)

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

  const handleExportMarginAnalysis = () => {
    try {
      exportToCSV(marginAnalysis.map(item => ({ Period: item.period, Year: selectedYear, Revenue: item.revenue, Costs: item.costs, Margin: item.margin, 'Margin %': item.marginPercentage.toFixed(2) })), { filename: `margin-analysis-${selectedYear}` })
      toast.success(t('reports.exportSuccess') || 'Margin analysis exported successfully')
    } catch { toast.error(t('reports.exportError') || 'Failed to export') }
  }

  const handleExportForecast = () => {
    try {
      exportToCSV(forecast.map(item => ({ Period: item.period, Year: selectedYear, 'Predicted Revenue': item.predictedRevenue, 'Predicted Costs': item.predictedCosts, 'Predicted Margin': item.predictedMargin, 'Confidence %': item.confidence })), { filename: `forecast-${selectedYear}` })
      toast.success(t('reports.exportSuccess') || 'Forecast data exported successfully')
    } catch { toast.error(t('reports.exportError') || 'Failed to export') }
  }

  const handleExportAll = () => {
    try {
      const data = [
        ...marginAnalysis.map(item => ({ Type: 'Actual', Period: item.period, Year: selectedYear, Revenue: item.revenue, Costs: item.costs, Margin: item.margin, 'Margin %': item.marginPercentage.toFixed(2), Confidence: 100 })),
        ...forecast.map(item => ({ Type: 'Forecast', Period: item.period, Year: selectedYear, Revenue: item.predictedRevenue, Costs: item.predictedCosts, Margin: item.predictedMargin, 'Margin %': ((item.predictedMargin / item.predictedRevenue) * 100).toFixed(2), Confidence: item.confidence }))
      ]
      exportToExcel(data, { filename: `financial-report-${selectedYear}` })
      toast.success(t('reports.exportSuccess') || 'Complete report exported successfully')
    } catch { toast.error(t('reports.exportError') || 'Failed to export') }
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
        { type: 'table', data: marginAnalysis.map(item => ({ period: item.period, revenue: `$${item.revenue.toLocaleString()}`, costs: `$${item.costs.toLocaleString()}`, margin: `$${item.margin.toLocaleString()}`, percentage: `${item.marginPercentage.toFixed(2)}%` })), columns: [{ header: 'Period', key: 'period', align: 'left' }, { header: 'Revenue', key: 'revenue', align: 'right' }, { header: 'Costs', key: 'costs', align: 'right' }, { header: 'Margin', key: 'margin', align: 'right' }, { header: 'Margin %', key: 'percentage', align: 'right' }] }
      ]
      if (forecast.length > 0) {
        sections.push(
          { type: 'spacer', height: 20 }, { type: 'divider' }, { type: 'spacer', height: 15 },
          { type: 'heading', content: 'Financial Forecast' },
          { type: 'spacer', height: 10 },
          { type: 'table', data: forecast.map(item => ({ period: item.period, revenue: `$${item.predictedRevenue.toLocaleString()}`, costs: `$${item.predictedCosts.toLocaleString()}`, margin: `$${item.predictedMargin.toLocaleString()}`, confidence: `${item.confidence}%` })), columns: [{ header: 'Period', key: 'period', align: 'left' }, { header: 'Predicted Revenue', key: 'revenue', align: 'right' }, { header: 'Predicted Costs', key: 'costs', align: 'right' }, { header: 'Predicted Margin', key: 'margin', align: 'right' }, { header: 'Confidence', key: 'confidence', align: 'right' }] }
        )
      }
      exportReportToPDF({ title: `Financial Report ${selectedYear}`, summary: `Comprehensive financial analysis for the year ${selectedYear}`, sections }, { filename: `financial-report-${selectedYear}`, orientation: 'portrait', pageSize: 'a4' })
      toast.success(t('reports.exportSuccess') || 'PDF report exported successfully')
    } catch { toast.error(t('reports.exportError') || 'Failed to export PDF') }
  }

  return {
    t, selectedPeriod, setSelectedPeriod, selectedYear, setSelectedYear,
    marginAnalysis, forecast,
    totalRevenue, totalCosts, totalMargin, avgMarginPercentage, monthOverMonthChange, maxValue,
    handleExportMarginAnalysis, handleExportForecast, handleExportAll, handleExportPDF,
  }
}
