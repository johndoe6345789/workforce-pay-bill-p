import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Warning } from '@phosphor-icons/react'

interface QRData {
  workerName: string
  clientName: string
  weekEnding: string
  hours: number
  rate: number
  signature?: string
}

interface Props {
  qrData: QRData
  onConfirm: () => void
  onClear: () => void
  t: (key: string) => string
}

export function QRScannedDataCard({ qrData, onConfirm, onClear, t }: Props) {
  const cells = [
    { label: t('qrScanner.worker'),     value: qrData.workerName },
    { label: t('qrScanner.client'),     value: qrData.clientName },
    { label: t('qrScanner.weekEnding'), value: new Date(qrData.weekEnding).toLocaleDateString() },
    { label: t('qrScanner.hours'),      value: String(qrData.hours), mono: true },
    { label: t('qrScanner.rate'),       value: `£${qrData.rate.toFixed(2)}`, mono: true },
    { label: t('qrScanner.total'),      value: `£${(qrData.hours * qrData.rate).toFixed(2)}`, mono: true, bold: true },
  ]

  return (
    <Card className="bg-accent/10 border-accent">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle size={20} weight="fill" className="text-success" />{t('qrScanner.scannedData')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {cells.map(({ label, value, mono, bold }) => (
            <div key={label}>
              <p className="text-muted-foreground">{label}</p>
              <p className={`font-${bold ? 'semibold' : 'medium'}${mono ? ' font-mono' : ''}`}>{value}</p>
            </div>
          ))}
        </div>
        <div className={`flex items-center gap-2 text-xs ${qrData.signature ? 'text-success' : 'text-warning'}`}>
          {qrData.signature ? <CheckCircle size={16} weight="fill" /> : <Warning size={16} weight="fill" />}
          <span>{qrData.signature ? t('qrScanner.clientSignatureVerified') : t('qrScanner.noClientSignature')}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={onConfirm} className="flex-1">{t('qrScanner.importTimesheet')}</Button>
          <Button onClick={onClear} variant="outline">{t('common.cancel')}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
