import { ArrowsClockwise, Globe, CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AddCurrencyDialog } from '@/components/currency/AddCurrencyDialog'
import { CurrencyRateCard } from '@/components/currency/CurrencyRateCard'
import { useCurrencyManagement } from '@/hooks/useCurrencyManagement'

const FEATURES = [
  { key: 'automaticConversion', descKey: 'automaticConversionDescription' },
  { key: 'realTimeRates', descKey: 'realTimeRatesDescription' },
  { key: 'rateLocking', descKey: 'rateLockingDescription' },
  { key: 'multiCurrencyReporting', descKey: 'multiCurrencyReportingDescription' },
]

export function CurrencyManagement() {
  const vm = useCurrencyManagement()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('currency.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('currency.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={vm.handleUpdateAllRates}>
            <ArrowsClockwise size={18} className="mr-2" />{vm.t('currency.updateAllRates')}
          </Button>
          <AddCurrencyDialog
            open={vm.isAddDialogOpen}
            onOpenChange={vm.setIsAddDialogOpen}
            form={vm.newCurrency}
            setForm={vm.setNewCurrency}
            onSubmit={vm.handleAddCurrency}
            t={vm.t}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-accent/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Globe size={18} className="text-accent" />{vm.t('currency.activeCurrencies')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.currencies.length}</div><p className="text-sm text-muted-foreground mt-1">{vm.t('currency.enabledForBilling')}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-success/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{vm.t('currency.baseCurrency')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">GBP</div><p className="text-sm text-muted-foreground mt-1">{vm.t('currency.britishPound')}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-primary/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{vm.t('currency.lastUpdated')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div><p className="text-sm text-muted-foreground mt-1">{vm.t('currency.today')}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{vm.t('currency.exchangeRates')}</CardTitle>
          <CardDescription>{vm.t('currency.exchangeRatesDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vm.currencies.map(currency => (
              <CurrencyRateCard
                key={currency.code}
                currency={currency}
                rateChange={vm.getRateChange(currency)}
                onUpdateRate={vm.handleUpdateRate}
                onRemove={vm.handleRemoveCurrency}
                t={vm.t}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Globe size={20} className="text-accent" />
            {vm.t('currency.multiCurrencyBillingFeatures')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {FEATURES.map(f => (
              <div key={f.key} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-success mt-0.5" weight="fill" />
                <div>
                  <p className="font-medium">{vm.t(`currency.${f.key}`)}</p>
                  <p className="text-muted-foreground">{vm.t(`currency.${f.descKey}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
