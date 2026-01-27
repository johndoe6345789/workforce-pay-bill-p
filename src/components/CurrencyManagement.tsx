import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  CurrencyDollar, 
  Plus, 
  ArrowsClockwise,
  TrendUp,
  TrendDown,
  Globe,
  CheckCircle
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { CurrencyRate } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

const DEFAULT_CURRENCIES: CurrencyRate[] = [
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToGBP: 1.0, lastUpdated: new Date().toISOString() },
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToGBP: 0.79, lastUpdated: new Date().toISOString() },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToGBP: 0.86, lastUpdated: new Date().toISOString() },
]

export function CurrencyManagement() {
  const { t } = useTranslation()
  const [currencies = DEFAULT_CURRENCIES, setCurrencies] = useKV<CurrencyRate[]>('currency-rates', DEFAULT_CURRENCIES)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    rateToGBP: ''
  })

  const handleAddCurrency = () => {
    if (!newCurrency.code || !newCurrency.name || !newCurrency.symbol || !newCurrency.rateToGBP) {
      toast.error(t('currency.fillAllFields'))
      return
    }

    const rate = parseFloat(newCurrency.rateToGBP)
    if (isNaN(rate) || rate <= 0) {
      toast.error(t('currency.invalidRate'))
      return
    }

    const exists = currencies.some(c => c.code.toUpperCase() === newCurrency.code.toUpperCase())
    if (exists) {
      toast.error(t('currency.currencyExists'))
      return
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

    setNewCurrency({ code: '', name: '', symbol: '', rateToGBP: '' })
    setIsAddDialogOpen(false)
  }

  const handleUpdateRate = (code: string) => {
    const randomVariation = (Math.random() - 0.5) * 0.04
    
    setCurrencies(current => 
      (current || []).map(c => 
        c.code === code 
          ? { ...c, rateToGBP: Math.max(0.1, c.rateToGBP * (1 + randomVariation)), lastUpdated: new Date().toISOString() }
          : c
      )
    )
    
    toast.success(t('currency.rateUpdated', { code }))
  }

  const handleRemoveCurrency = (code: string) => {
    if (code === 'GBP') {
      toast.error(t('currency.cannotRemoveBase'))
      return
    }

    setCurrencies(current => (current || []).filter(c => c.code !== code))
    toast.success(t('currency.currencyRemoved', { code }))
  }

  const convertAmount = (amount: number, fromCode: string, toCode: string): number => {
    const fromCurrency = currencies.find(c => c.code === fromCode)
    const toCurrency = currencies.find(c => c.code === toCode)
    
    if (!fromCurrency || !toCurrency) return amount
    
    const amountInGBP = amount * fromCurrency.rateToGBP
    return amountInGBP / toCurrency.rateToGBP
  }

  const getPreviousRate = (code: string): number => {
    const currency = currencies.find(c => c.code === code)
    if (!currency) return 0
    
    const variation = (Math.random() - 0.5) * 0.03
    return currency.rateToGBP * (1 - variation)
  }

  const getRateChange = (currency: CurrencyRate): number => {
    const previousRate = getPreviousRate(currency.code)
    if (previousRate === 0) return 0
    return ((currency.rateToGBP - previousRate) / previousRate) * 100
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('currency.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('currency.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              currencies.forEach(c => {
                if (c.code !== 'GBP') {
                  handleUpdateRate(c.code)
                }
              })
            }}
          >
            <ArrowsClockwise size={18} className="mr-2" />
            {t('currency.updateAllRates')}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                {t('currency.addCurrency')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('currency.addNewCurrency')}</DialogTitle>
                <DialogDescription>
                  {t('currency.addNewCurrencyDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">{t('currency.code')}</Label>
                    <Input
                      id="code"
                      placeholder={t('currency.currencyCodePlaceholder')}
                      value={newCurrency.code}
                      onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })}
                      maxLength={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symbol">{t('currency.symbol')}</Label>
                    <Input
                      id="symbol"
                      placeholder={t('currency.symbolPlaceholder')}
                      value={newCurrency.symbol}
                      onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t('currency.name')}</Label>
                  <Input
                    id="name"
                    placeholder={t('currency.namePlaceholder')}
                    value={newCurrency.name}
                    onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">{t('currency.exchangeRateToGBP')}</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.0001"
                    placeholder={t('currency.ratePlaceholder')}
                    value={newCurrency.rateToGBP}
                    onChange={(e) => setNewCurrency({ ...newCurrency, rateToGBP: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('currency.rateHint', { code: newCurrency.code || 'XXX', rate: newCurrency.rateToGBP || '0' })}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t('common.cancel')}</Button>
                <Button onClick={handleAddCurrency}>{t('currency.addCurrency')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Globe size={18} className="text-accent" />
              {t('currency.activeCurrencies')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{currencies.length}</div>
            <p className="text-sm text-muted-foreground mt-1">{t('currency.enabledForBilling')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t('currency.baseCurrency')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">GBP</div>
            <p className="text-sm text-muted-foreground mt-1">{t('currency.britishPound')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t('currency.lastUpdated')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{t('currency.today')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('currency.exchangeRates')}</CardTitle>
          <CardDescription>{t('currency.exchangeRatesDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currencies.map((currency) => {
              const rateChange = getRateChange(currency)
              const isBase = currency.code === 'GBP'

              return (
                <Card key={currency.code} className={cn(isBase && "border-primary/50")}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <CurrencyDollar size={24} weight="fill" className="text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{currency.code}</h3>
                            {isBase && <Badge variant="outline">{t('currency.baseCurrency')}</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{currency.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">{t('currency.exchangeRate')}</div>
                          <div className="font-mono font-semibold text-lg">
                            1 {currency.code} = {currency.rateToGBP.toFixed(4)} GBP
                          </div>
                          {!isBase && (
                            <div className={cn(
                              "flex items-center gap-1 text-xs mt-1",
                              rateChange >= 0 ? "text-success" : "text-destructive"
                            )}>
                              {rateChange >= 0 ? (
                                <TrendUp size={12} weight="bold" />
                              ) : (
                                <TrendDown size={12} weight="bold" />
                              )}
                              <span>{Math.abs(rateChange).toFixed(2)}% {t('currency.vsYesterday')}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">{t('currency.symbol')}</div>
                          <div className="font-semibold text-2xl">{currency.symbol}</div>
                        </div>

                        <div className="flex gap-2">
                          {!isBase && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateRate(currency.code)}
                              >
                                <ArrowsClockwise size={16} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRemoveCurrency(currency.code)}
                              >
                                {t('currency.remove')}
                              </Button>
                            </>
                          )}
                          {isBase && (
                            <Button size="sm" variant="outline" disabled>
                              <CheckCircle size={16} className="mr-2" />
                              {t('currency.active')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-2">{t('currency.quickConversions')}</div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">100 {currency.code}</span>
                          <span className="ml-2 font-mono font-medium">= £{(100 * currency.rateToGBP).toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">1,000 {currency.code}</span>
                          <span className="ml-2 font-mono font-medium">= £{(1000 * currency.rateToGBP).toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">£100</span>
                          <span className="ml-2 font-mono font-medium">= {currency.symbol}{(100 / currency.rateToGBP).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Globe size={20} className="text-accent" />
            {t('currency.multiCurrencyBillingFeatures')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5" weight="fill" />
              <div>
                <p className="font-medium">{t('currency.automaticConversion')}</p>
                <p className="text-muted-foreground">{t('currency.automaticConversionDescription')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5" weight="fill" />
              <div>
                <p className="font-medium">{t('currency.realTimeRates')}</p>
                <p className="text-muted-foreground">{t('currency.realTimeRatesDescription')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5" weight="fill" />
              <div>
                <p className="font-medium">{t('currency.rateLocking')}</p>
                <p className="text-muted-foreground">{t('currency.rateLockingDescription')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5" weight="fill" />
              <div>
                <p className="font-medium">{t('currency.multiCurrencyReporting')}</p>
                <p className="text-muted-foreground">{t('currency.multiCurrencyReportingDescription')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
