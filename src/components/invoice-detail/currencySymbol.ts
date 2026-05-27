const SYMBOLS: Record<string, string> = { GBP: '£', USD: '$', EUR: '€' }

export function currencySymbol(currency: string): string {
  return SYMBOLS[currency] ?? currency
}
