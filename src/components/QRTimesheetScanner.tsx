import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Camera, QrCode } from '@phosphor-icons/react'
import type { Timesheet } from '@/lib/types'
import { useTranslation } from '@/hooks/use-translation'
import { useQRTimesheetScanner } from '@/hooks/useQRTimesheetScanner'
import { QRScannedDataCard } from '@/components/qr-scanner/QRScannedDataCard'

interface Props {
  onTimesheetScanned: (timesheet: Omit<Timesheet, 'id' | 'status' | 'submittedDate'>) => void
}

export function QRTimesheetScanner({ onTimesheetScanned }: Props) {
  const { t } = useTranslation()
  const vm = useQRTimesheetScanner(onTimesheetScanned)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode size={24} weight="fill" />{t('qrScanner.title')}
          </CardTitle>
          <CardDescription>{t('qrScanner.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/30">
            {vm.isScanning ? (
              <div className="flex flex-col items-center gap-4">
                <Camera size={64} className="text-accent animate-pulse" />
                <p className="text-sm text-muted-foreground">{t('qrScanner.scanning')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <QrCode size={64} className="text-muted-foreground" />
                <Button onClick={vm.simulateScan} size="lg">
                  <Camera size={20} className="mr-2" />{t('qrScanner.startCameraScan')}
                </Button>
                <p className="text-xs text-muted-foreground">{t('qrScanner.positionQR')}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{t('common.or')}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-manual">{t('qrScanner.pasteManually')}</Label>
              <Textarea
                id="qr-manual"
                placeholder={t('qrScanner.pasteManuallyPlaceholder')}
                value={vm.manualInput}
                onChange={e => vm.setManualInput(e.target.value)}
                rows={4}
                className="font-mono text-xs"
              />
              <Button onClick={vm.parseManual} variant="outline" className="w-full" disabled={!vm.manualInput.trim()}>
                {t('qrScanner.parseQRData')}
              </Button>
            </div>
          </div>

          {vm.qrData && (
            <QRScannedDataCard qrData={vm.qrData} onConfirm={vm.confirmTimesheet} onClear={vm.clearScan} t={t} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
