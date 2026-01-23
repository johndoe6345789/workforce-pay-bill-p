import { useMemo } from 'react'

export interface CurrencyFormatOptions {
  locale?: string
  showSymbol?: boolean
  showCode?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export function useCurrency(currency: string = 'GBP', options: CurrencyFormatOptions = {}) {
  const {
    locale = 'en-GB',
    showSymbol = true,
    showCode = false,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    })
  }, [locale, currency, showSymbol, minimumFractionDigits, maximumFractionDigits])

  const format = (amount: number): string => {
    const formatted = formatter.format(amount)
    return showCode ? `${formatted} ${currency}` : formatted
  }

  const parse = (value: string): number => {
    const cleaned = value.replace(/[^0-9.-]/g, '')
    return parseFloat(cleaned) || 0
  }

  return {
    format,
    parse,
    symbol: showSymbol ? formatter.formatToParts(0).find(part => part.type === 'currency')?.value : '',
    code: currency
  }
}
