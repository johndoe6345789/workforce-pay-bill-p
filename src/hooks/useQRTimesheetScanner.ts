import { useState } from 'react'
import { toast } from 'sonner'
import type { QRTimesheetData, Timesheet } from '@/lib/types'
import { useTranslation } from '@/hooks/use-translation'

const MOCK_QR: QRTimesheetData = {
  workerId: '',
  workerName: 'John Smith',
  clientName: 'Acme Corp',
  weekEnding: new Date().toISOString().split('T')[0],
  hours: 40,
  rate: 25.5,
  signature: 'client_approval_hash',
}

export function useQRTimesheetScanner(onTimesheetScanned: (ts: Omit<Timesheet, 'id' | 'status' | 'submittedDate'>) => void) {
  const { t } = useTranslation()
  const [isScanning, setIsScanning] = useState(false)
  const [qrData, setQrData] = useState<QRTimesheetData | null>(null)
  const [manualInput, setManualInput] = useState('')

  const simulateScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setQrData({ ...MOCK_QR, workerId: `W-${Date.now()}` })
      setIsScanning(false)
      toast.success(t('qrScanner.scanSuccess'))
    }, 2000)
  }

  const parseManual = () => {
    try {
      setQrData(JSON.parse(manualInput) as QRTimesheetData)
      toast.success(t('qrScanner.parseSuccess'))
    } catch {
      toast.error(t('qrScanner.parseError'))
    }
  }

  const confirmTimesheet = () => {
    if (!qrData) return
    onTimesheetScanned({
      workerId: qrData.workerId,
      workerName: qrData.workerName,
      clientName: qrData.clientName,
      weekEnding: qrData.weekEnding,
      hours: qrData.hours,
      amount: qrData.hours * qrData.rate,
      rate: qrData.rate,
      submissionMethod: 'qr-scan',
    })
    setQrData(null)
    setManualInput('')
    toast.success(t('qrScanner.importSuccess'))
  }

  return { isScanning, qrData, manualInput, setManualInput, simulateScan, parseManual, confirmTimesheet, clearScan: () => setQrData(null) }
}
