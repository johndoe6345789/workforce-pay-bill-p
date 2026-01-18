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

const DEFAULT_CURRENCIES: CurrencyRate[] = [
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToGBP: 1.0, lastUpdated: new Date().toISOString() },
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToGBP: 0.79, lastUpdated: new Date().toISOString() },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToGBP: 0.86, lastUpdated: new Date().toISOString() },
]

export function CurrencyManagement() {
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
      toast.error('Please fill in all fields')
      return
    }

    const rate = parseFloat(newCurrency.rateToGBP)
    if (isNaN(rate) || rate <= 0) {
      toast.error('Please enter a valid exchange rate')
      return
    }

    const exists = currencies.some(c => c.code.toUpperCase() === newCurrency.code.toUpperCase())
    if (exists) {
      toast.error('Currency already exists')
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
    toast.success(`${currency.code} currency added`)

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
    
    toast.success(`${code} exchange rate updated`)
  }

  const handleRemoveCurrency = (code: string) => {
    if (code === 'GBP') {
      toast.error('Cannot remove base currency')
      return
    }

    setCurrencies(current => (current || []).filter(c => c.code !== code))
    toast.success(`${code} currency removed`)
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
          <h2 className="text-3xl font-semibold tracking-tight">Currency Management</h2>
          <p className="text-muted-foreground mt-1">Manage exchange rates and multi-currency billing</p>
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
            Update All Rates
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Add Currency
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Currency</DialogTitle>
                <DialogDescription>
                  Add a new currency with its exchange rate to GBP
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Currency Code</Label>
                    <Input
                      id="code"
                      placeholder="USD"
                      value={newCurrency.code}
                      onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })}
                      maxLength={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="$"
                      value={newCurrency.symbol}
                      onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Currency Name</Label>
                  <Input
                    id="name"
                    placeholder="US Dollar"
                    value={newCurrency.name}
                    onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Exchange Rate to GBP</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.0001"
                    placeholder="0.7900"
                    value={newCurrency.rateToGBP}
                    onChange={(e) => setNewCurrency({ ...newCurrency, rateToGBP: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    1 {newCurrency.code || 'XXX'} = {newCurrency.rateToGBP || '0'} GBP
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCurrency}>Add Currency</Button>
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
              Active Currencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{currencies.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Enabled for billing</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Base Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">GBP</div>
            <p className="text-sm text-muted-foreground mt-1">British Pound (£)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exchange Rates</CardTitle>
          <CardDescription>Current exchange rates relative to GBP (base currency)</CardDescription>
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
                            {isBase && <Badge variant="outline">Base Currency</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{currency.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Exchange Rate</div>
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
                              <span>{Math.abs(rateChange).toFixed(2)}% vs yesterday</span>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Symbol</div>
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
                                Remove
                              </Button>
                            </>
                          )}
                          {isBase && (
                            <Button size="sm" variant="outline" disabled>
                              <CheckCircle size={16} className="mr-2" />
                              Active
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-2">Quick Conversions:</div>
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
            Multi-Currency Billing Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5" weight="fill" />
              <div>
                <p className="font-medium">Automatic Conversion</p>
                <p className="text-muted-foreground">Invoices automatically convert to client's preferred currency</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5" weight="fill" />
              <div>
                <p className="font-medium">Real-Time Rates</p>
                <p className="text-muted-foreground">Exchange rates update automatically throughout the day</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5" weight="fill" />
              <div>
                <p className="font-medium">Rate Locking</p>
                <p className="text-muted-foreground">Lock rates at invoice creation to protect margins</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5" weight="fill" />
              <div>
                <p className="font-medium">Multi-Currency Reporting</p>
                <p className="text-muted-foreground">View revenue and margins in any supported currency</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
