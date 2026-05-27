import type { PDFSection } from '@/hooks/use-pdf-export'
import type { MarginAnalysis, ForecastData } from '@/lib/types'

interface PDFSectionsArgs {
  totalRevenue: number
  totalCosts: number
  totalMargin: number
  avgMarginPercentage: number
  marginAnalysis: MarginAnalysis[]
  forecast: ForecastData[]
}

export function buildPDFSections(args: PDFSectionsArgs): PDFSection[] {
  const {
    totalRevenue, totalCosts, totalMargin,
    avgMarginPercentage, marginAnalysis, forecast,
  } = args

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

  return sections
}
