import { useKV } from '@github/spark/hooks'
import type { Timesheet, Invoice, Expense } from '@/lib/types'
import { useMarginAnalysisPeriod } from './use-margin-analysis-period'
import { useMarginAnalysisClients } from './use-margin-analysis-clients'
import { useMarginAnalysisWorkers } from './use-margin-analysis-workers'
import { useMarginAnalysisForecast } from './use-margin-analysis-forecast'

export type {
  MarginBreakdown,
  MarginCalculation,
  ClientProfitability,
  WorkerUtilization,
  PeriodComparison
} from './use-margin-analysis.types'

export function useMarginAnalysis() {
  const [timesheets = []] = useKV<Timesheet[]>('timesheets', [])
  const [invoices = []] = useKV<Invoice[]>('invoices', [])
  const [expenses = []] = useKV<Expense[]>('expenses', [])

  const { calculateMarginForPeriod } = useMarginAnalysisPeriod(
    timesheets,
    invoices,
    expenses
  )

  const { analyzeClientProfitability } = useMarginAnalysisClients(
    timesheets,
    invoices
  )

  const { analyzeWorkerUtilization } = useMarginAnalysisWorkers(timesheets)

  const { comparePeriods, calculateBreakEvenPoint, forecastRevenue } =
    useMarginAnalysisForecast(calculateMarginForPeriod)

  return {
    calculateMarginForPeriod,
    analyzeClientProfitability,
    analyzeWorkerUtilization,
    comparePeriods,
    calculateBreakEvenPoint,
    forecastRevenue
  }
}
