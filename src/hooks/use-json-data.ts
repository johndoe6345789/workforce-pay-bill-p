import { useState, useEffect } from 'react'
import appData from '@/data/app-data.json'
import type { AppData } from './use-json-data-extra.types'

export type {
  Shift,
  Timesheet,
  InvoiceItem,
  Invoice,
  PayrollEntry,
  PayrollRun,
  Worker,
} from './use-json-data.types'

export type {
  ComplianceDoc,
  Expense,
  RateCard,
  Client,
  AppData,
} from './use-json-data-extra.types'

export function useJsonData() {
  const [data, setData] = useState<AppData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      setData(appData as AppData)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'))
      setIsLoading(false)
    }
  }, [])

  return { data, isLoading, error }
}
