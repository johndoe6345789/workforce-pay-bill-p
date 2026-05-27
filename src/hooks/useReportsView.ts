import { useState } from 'react'
import { useInvoicesCrud } from '@/hooks/use-invoices-crud'
import { usePayrollCrud } from '@/hooks/use-payroll-crud'
import { useTranslation } from '@/hooks/use-translation'
import {
  calculateMarginAnalysis,
  generateForecast,
} from './use-reports-calculations'
import { deriveReportsSummary } from './use-reports-summary'
import { useReportsExports } from './use-reports-exports'

export function useReportsView() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter' | 'year'
  >('month')
  const [selectedYear, setSelectedYear] = useState('2025')
  const { t } = useTranslation()
  const { invoices } = useInvoicesCrud()
  const { payrollRuns } = usePayrollCrud()

  const marginAnalysis = calculateMarginAnalysis(invoices, payrollRuns)
  const forecast = generateForecast(marginAnalysis)
  const {
    totalRevenue,
    totalCosts,
    totalMargin,
    avgMarginPercentage,
    monthOverMonthChange,
    maxValue,
  } = deriveReportsSummary(marginAnalysis, forecast)

  const {
    handleExportMarginAnalysis,
    handleExportForecast,
    handleExportAll,
    handleExportPDF,
  } = useReportsExports({
    marginAnalysis,
    forecast,
    selectedYear,
    totalRevenue,
    totalCosts,
    totalMargin,
    avgMarginPercentage,
    t,
  })

  return {
    t, selectedPeriod, setSelectedPeriod, selectedYear, setSelectedYear,
    marginAnalysis, forecast,
    totalRevenue, totalCosts, totalMargin, avgMarginPercentage,
    monthOverMonthChange, maxValue,
    handleExportMarginAnalysis, handleExportForecast, handleExportAll, handleExportPDF,
  }
}
