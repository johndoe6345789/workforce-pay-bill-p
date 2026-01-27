import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Camera, QrCode, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { QRTimesheetData, Timesheet } from '@/lib/types'
import { useTranslation } from '@/hooks/use-translation'

interface QRTimesheetScannerProps {
  onTimesheetScanned: (timesheet: Omit<Timesheet, 'id' | 'status' | 'submittedDate'>) => void
}

export function QRTimesheetScanner({ onTimesheetScanned }: QRTimesheetScannerProps) {
  const { t } = useTranslation()
  const [isScanning, setIsScanning] = useState(false)
  const [qrData, setQrData] = useState<QRTimesheetData | null>(null)
  const [manualQRInput, setManualQRInput] = useState('')

  const simulateScan = () => {
    setIsScanning(true)
    
    setTimeout(() => {
      const mockQRData: QRTimesheetData = {
        workerId: `W-${Date.now()}`,
        workerName: 'John Smith',
        clientName: 'Acme Corp',
        weekEnding: new Date().toISOString().split('T')[0],
        hours: 40,
        rate: 25.50,
        signature: 'client_approval_hash'
      }
      
      setQrData(mockQRData)
      setIsScanning(false)
      toast.success(t('qrScanner.scanSuccess'))
    }, 2000)
  }

  const handleManualQRParse = () => {
    try {
      const parsed = JSON.parse(manualQRInput) as QRTimesheetData
      setQrData(parsed)
      toast.success(t('qrScanner.parseSuccess'))
    } catch (error) {
      toast.error(t('qrScanner.parseError'))
    }
  }

  const handleConfirmTimesheet = () => {
    if (!qrData) return

    const timesheet: Omit<Timesheet, 'id' | 'status' | 'submittedDate'> = {
      workerId: qrData.workerId,
      workerName: qrData.workerName,
      clientName: qrData.clientName,
      weekEnding: qrData.weekEnding,
      hours: qrData.hours,
      amount: qrData.hours * qrData.rate,
      rate: qrData.rate,
      submissionMethod: 'qr-scan'
    }

    onTimesheetScanned(timesheet)
    setQrData(null)
    setManualQRInput('')
    toast.success(t('qrScanner.importSuccess'))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode size={24} weight="fill" />
            {t('qrScanner.title')}
          </CardTitle>
          <CardDescription>
            {t('qrScanner.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/30">
            {isScanning ? (
              <div className="flex flex-col items-center gap-4">
                <Camera size={64} className="text-accent animate-pulse" />
                <p className="text-sm text-muted-foreground">{t('qrScanner.scanning')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <QrCode size={64} className="text-muted-foreground" />
                <Button onClick={simulateScan} size="lg">
                  <Camera size={20} className="mr-2" />
                  {t('qrScanner.startCameraScan')}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {t('qrScanner.positionQR')}
                </p>
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
                value={manualQRInput}
                onChange={(e) => setManualQRInput(e.target.value)}
                rows={4}
                className="font-mono text-xs"
              />
              <Button 
                onClick={handleManualQRParse} 
                variant="outline" 
                className="w-full"
                disabled={!manualQRInput.trim()}
              >
                {t('qrScanner.parseQRData')}
              </Button>
            </div>
          </div>

          {qrData && (
            <Card className="bg-accent/10 border-accent">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle size={20} weight="fill" className="text-success" />
                  {t('qrScanner.scannedData')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('qrScanner.worker')}</p>
                    <p className="font-medium">{qrData.workerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('qrScanner.client')}</p>
                    <p className="font-medium">{qrData.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('qrScanner.weekEnding')}</p>
                    <p className="font-medium">{new Date(qrData.weekEnding).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('qrScanner.hours')}</p>
                    <p className="font-medium font-mono">{qrData.hours}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('qrScanner.rate')}</p>
                    <p className="font-medium font-mono">£{qrData.rate.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('qrScanner.total')}</p>
                    <p className="font-semibold font-mono">£{(qrData.hours * qrData.rate).toFixed(2)}</p>
                  </div>
                </div>

                {qrData.signature && (
                  <div className="flex items-center gap-2 text-xs text-success">
                    <CheckCircle size={16} weight="fill" />
                    <span>{t('qrScanner.clientSignatureVerified')}</span>
                  </div>
                )}

                {!qrData.signature && (
                  <div className="flex items-center gap-2 text-xs text-warning">
                    <Warning size={16} weight="fill" />
                    <span>{t('qrScanner.noClientSignature')}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleConfirmTimesheet} className="flex-1">
                    {t('qrScanner.importTimesheet')}
                  </Button>
                  <Button onClick={() => setQrData(null)} variant="outline">
                    {t('common.cancel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
