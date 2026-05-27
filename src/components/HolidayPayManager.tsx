import { Calendar, Airplane, Calculator } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HolidayRequestDialog } from '@/components/holiday-pay/HolidayRequestDialog'
import { HolidayAccrualCard } from '@/components/holiday-pay/HolidayAccrualCard'
import { HolidayRequestCard } from '@/components/holiday-pay/HolidayRequestCard'
import { useHolidayPayManager, STANDARD_ACCRUAL_RATE } from '@/hooks/useHolidayPayManager'

export function HolidayPayManager() {
  const vm = useHolidayPayManager()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('holidayPay.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('holidayPay.subtitle')}</p>
        </div>
        <HolidayRequestDialog
          open={vm.isRequestDialogOpen}
          onOpenChange={vm.setIsRequestDialogOpen}
          formData={vm.formData}
          setFormData={vm.setFormData}
          onSubmit={vm.handleRequestHoliday}
          t={vm.t}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('holidayPay.totalAccruedLabel')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.t('holidayPay.daysLabel', { count: vm.totalAccrued.toFixed(1) })}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('holidayPay.pendingRequests')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.pendingCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('holidayPay.daysTakenYTD')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.t('holidayPay.daysLabel', { count: vm.totalTaken.toFixed(1) })}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accruals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accruals">{vm.t('holidayPay.tabs.accruals', { count: vm.accruals.length })}</TabsTrigger>
          <TabsTrigger value="requests">{vm.t('holidayPay.tabs.requests', { count: vm.pendingCount })}</TabsTrigger>
        </TabsList>

        <TabsContent value="accruals" className="space-y-3">
          {!vm.accruals.length ? (
            <Card className="p-12 text-center">
              <CardContent>
                <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{vm.t('holidayPay.noAccruals')}</h3>
                <p className="text-muted-foreground">{vm.t('holidayPay.noAccrualsDescription')}</p>
              </CardContent>
            </Card>
          ) : vm.accruals.map(accrual => <HolidayAccrualCard key={accrual.id} accrual={accrual} t={vm.t} />)}
        </TabsContent>

        <TabsContent value="requests" className="space-y-3">
          {!vm.requests.length ? (
            <Card className="p-12 text-center">
              <CardContent>
                <Airplane size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{vm.t('holidayPay.noRequests')}</h3>
                <p className="text-muted-foreground">{vm.t('holidayPay.noRequestsDescription')}</p>
              </CardContent>
            </Card>
          ) : vm.requests.map(request => (
            <HolidayRequestCard key={request.id} request={request} onApprove={vm.handleApproveRequest} onReject={vm.handleRejectRequest} t={vm.t} />
          ))}
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Calculator size={24} className="text-primary" />
            <div>
              <p className="font-medium">{vm.t('holidayPay.accrualCalculation')}</p>
              <p className="text-sm text-muted-foreground">{vm.t('holidayPay.accrualCalculationDescription', { rate: STANDARD_ACCRUAL_RATE })}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
