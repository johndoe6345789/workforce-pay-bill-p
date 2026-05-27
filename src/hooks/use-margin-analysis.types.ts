export interface MarginBreakdown {
  category: string
  amount: number
  percentage: number
}

export interface MarginCalculation {
  period: string
  revenue: number
  costs: number
  grossMargin: number
  marginPercentage: number
  breakdown: MarginBreakdown[]
}

export interface ClientProfitability {
  clientName: string
  revenue: number
  costs: number
  margin: number
  marginPercentage: number
  invoiceCount: number
  avgInvoiceValue: number
}

export interface WorkerUtilization {
  workerId: string
  workerName: string
  hoursWorked: number
  availableHours: number
  utilizationRate: number
  revenue: number
  avgRate: number
}

export interface PeriodComparison {
  current: MarginCalculation
  previous: MarginCalculation
  revenueChange: number
  revenueChangePercentage: number
  marginChange: number
  marginChangePercentage: number
}
