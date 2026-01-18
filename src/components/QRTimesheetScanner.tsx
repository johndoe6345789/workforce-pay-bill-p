import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Camera, QrCode, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { QRTimesheetData, Timesheet } from '@/lib/types'

interface QRTimesheetScannerProps {
  onTimesheetScanned: (timesheet: Omit<Timesheet, 'id' | 'status' | 'submittedDate'>) => void
}

export function QRTimesheetScanner({ onTimesheetScanned }: QRTimesheetScannerProps) {
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
      toast.success('QR code scanned successfully')
    }, 2000)
  }

  const handleManualQRParse = () => {
    try {
      const parsed = JSON.parse(manualQRInput) as QRTimesheetData
      setQrData(parsed)
      toast.success('QR data parsed successfully')
    } catch (error) {
      toast.error('Invalid QR code data format')
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
    toast.success('Timesheet imported from QR code')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode size={24} weight="fill" />
            QR Code Timesheet Scanner
          </CardTitle>
          <CardDescription>
            Scan paper timesheets with QR codes for instant digital capture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/30">
            {isScanning ? (
              <div className="flex flex-col items-center gap-4">
                <Camera size={64} className="text-accent animate-pulse" />
                <p className="text-sm text-muted-foreground">Scanning QR code...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <QrCode size={64} className="text-muted-foreground" />
                <Button onClick={simulateScan} size="lg">
                  <Camera size={20} className="mr-2" />
                  Start Camera Scan
                </Button>
                <p className="text-xs text-muted-foreground">
                  Position QR code within camera frame
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qr-manual">Paste QR Data Manually</Label>
              <Textarea
                id="qr-manual"
                placeholder='{"workerId":"W-123","workerName":"John Smith",...}'
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
                Parse QR Data
              </Button>
            </div>
          </div>

          {qrData && (
            <Card className="bg-accent/10 border-accent">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle size={20} weight="fill" className="text-success" />
                  Scanned Timesheet Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Worker</p>
                    <p className="font-medium">{qrData.workerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{qrData.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Week Ending</p>
                    <p className="font-medium">{new Date(qrData.weekEnding).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hours</p>
                    <p className="font-medium font-mono">{qrData.hours}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rate</p>
                    <p className="font-medium font-mono">£{qrData.rate.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-semibold font-mono">£{(qrData.hours * qrData.rate).toFixed(2)}</p>
                  </div>
                </div>

                {qrData.signature && (
                  <div className="flex items-center gap-2 text-xs text-success">
                    <CheckCircle size={16} weight="fill" />
                    <span>Client approval signature verified</span>
                  </div>
                )}

                {!qrData.signature && (
                  <div className="flex items-center gap-2 text-xs text-warning">
                    <Warning size={16} weight="fill" />
                    <span>No client signature - will require manual approval</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleConfirmTimesheet} className="flex-1">
                    Import Timesheet
                  </Button>
                  <Button onClick={() => setQrData(null)} variant="outline">
                    Cancel
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
