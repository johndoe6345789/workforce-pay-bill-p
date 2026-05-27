import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import type { CurrencyRate } from '@/lib/types'

const DEFAULT_CURRENCIES: CurrencyRate[] = [
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToGBP: 1.0, lastUpdated: new Date().toISOString() },
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToGBP: 0.79, lastUpdated: new Date().toISOString() },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToGBP: 0.86, lastUpdated: new Date().toISOString() },
]

export const DEFAULT_NEW_CURRENCY = { code: '', name: '', symbol: '', rateToGBP: '' }
export type NewCurrencyForm = typeof DEFAULT_NEW_CURRENCY

export function useCurrencyManagement() {
  const { t } = useTranslation()
  const [currencies = DEFAULT_CURRENCIES, setCurrencies] = useKV<CurrencyRate[]>('currency-rates', DEFAULT_CURRENCIES)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCurrency, setNewCurrency] = useState<NewCurrencyForm>(DEFAULT_NEW_CURRENCY)

  const handleAddCurrency = () => {
    if (!newCurrency.code || !newCurrency.name || !newCurrency.symbol || !newCurrency.rateToGBP) {
      toast.error(t('currency.fillAllFields')); return
    }
    const rate = parseFloat(newCurrency.rateToGBP)
    if (isNaN(rate) || rate <= 0) { toast.error(t('currency.invalidRate')); return }
    if (currencies.some(c => c.code.toUpperCase() === newCurrency.code.toUpperCase())) {
      toast.error(t('currency.currencyExists')); return
    }
    const currency: CurrencyRate = {
      code: newCurrency.code.toUpperCase(),
      name: newCurrency.name,
      symbol: newCurrency.symbol,
      rateToGBP: rate,
      lastUpdated: new Date().toISOString()
    }
    setCurrencies(current => [...(current || []), currency])
    toast.success(t('currency.currencyAdded', { code: currency.code }))
    setNewCurrency(DEFAULT_NEW_CURRENCY)
    setIsAddDialogOpen(false)
  }

  const handleUpdateRate = (code: string) => {
    const randomVariation = (Math.random() - 0.5) * 0.04
    setCurrencies(current => (current || []).map(c =>
      c.code === code ? { ...c, rateToGBP: Math.max(0.1, c.rateToGBP * (1 + randomVariation)), lastUpdated: new Date().toISOString() } : c
    ))
    toast.success(t('currency.rateUpdated', { code }))
  }

  const handleRemoveCurrency = (code: string) => {
    if (code === 'GBP') { toast.error(t('currency.cannotRemoveBase')); return }
    setCurrencies(current => (current || []).filter(c => c.code !== code))
    toast.success(t('currency.currencyRemoved', { code }))
  }

  const handleUpdateAllRates = () => {
    currencies.forEach(c => { if (c.code !== 'GBP') handleUpdateRate(c.code) })
  }

  const getRateChange = (currency: CurrencyRate): number => {
    const variation = (Math.random() - 0.5) * 0.03
    const previousRate = currency.rateToGBP * (1 - variation)
    return previousRate === 0 ? 0 : ((currency.rateToGBP - previousRate) / previousRate) * 100
  }

  return {
    t, currencies,
    isAddDialogOpen, setIsAddDialogOpen,
    newCurrency, setNewCurrency,
    handleAddCurrency, handleUpdateRate, handleRemoveCurrency, handleUpdateAllRates, getRateChange,
  }
}
