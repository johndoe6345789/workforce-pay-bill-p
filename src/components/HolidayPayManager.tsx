import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  Calendar, 
  Plus,
  Airplane,
  CheckCircle,
  Clock,
  Calculator
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface HolidayAccrual {
  id: string
  workerId: string
  workerName: string
  accruedDays: number
  takenDays: number
  remainingDays: number
  lastUpdated: string
}

interface HolidayRequest {
  id: string
  workerId: string
  workerName: string
  startDate: string
  endDate: string
  days: number
  status: 'pending' | 'approved' | 'rejected'
  requestedDate: string
  approvedDate?: string
}

export function HolidayPayManager() {
  const [accruals = [], setAccruals] = useKV<HolidayAccrual[]>('holiday-accruals', [])
  const [requests = [], setRequests] = useKV<HolidayRequest[]>('holiday-requests', [])
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    workerId: '',
    workerName: '',
    startDate: '',
    endDate: '',
    days: 0
  })

  const STANDARD_ACCRUAL_RATE = 5.6

  const calculateAccrual = (hoursWorked: number) => {
    return (hoursWorked * STANDARD_ACCRUAL_RATE) / 100
  }

  const addAccrualForWorker = (workerId: string, workerName: string, hoursWorked: number) => {
    const accrualDays = calculateAccrual(hoursWorked)
    
    setAccruals((current) => {
      const existing = (current || []).find(a => a.workerId === workerId)
      
      if (existing) {
        return (current || []).map(a => 
          a.workerId === workerId
            ? { ...a, accruedDays: a.accruedDays + accrualDays, lastUpdated: new Date().toISOString() }
            : a
        )
      } else {
        return [
          ...(current || []),
          {
            id: `ACC-${Date.now()}`,
            workerId,
            workerName,
            accruedDays: accrualDays,
            takenDays: 0,
            remainingDays: accrualDays,
            lastUpdated: new Date().toISOString()
          }
        ]
      }
    })
  }

  const handleRequestHoliday = () => {
    if (!formData.workerName || !formData.startDate || !formData.endDate || formData.days <= 0) {
      toast.error('Please fill in all fields')
      return
    }

    const newRequest: HolidayRequest = {
      id: `HR-${Date.now()}`,
      workerId: formData.workerId || `W-${Date.now()}`,
      workerName: formData.workerName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: formData.days,
      status: 'pending',
      requestedDate: new Date().toISOString()
    }

    setRequests((current) => [...(current || []), newRequest])
    toast.success('Holiday request submitted')
    
    setFormData({
      workerId: '',
      workerName: '',
      startDate: '',
      endDate: '',
      days: 0
    })
    setIsRequestDialogOpen(false)
  }

  const handleApproveRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId)
    if (!request) return

    const accrual = accruals.find(a => a.workerId === request.workerId)
    if (!accrual || accrual.remainingDays < request.days) {
      toast.error('Insufficient holiday balance')
      return
    }

    setRequests((current) =>
      (current || []).map(r =>
        r.id === requestId
          ? { ...r, status: 'approved' as const, approvedDate: new Date().toISOString() }
          : r
      )
    )

    setAccruals((current) =>
      (current || []).map(a =>
        a.workerId === request.workerId
          ? {
              ...a,
              takenDays: a.takenDays + request.days,
              remainingDays: a.remainingDays - request.days,
              lastUpdated: new Date().toISOString()
            }
          : a
      )
    )

    toast.success('Holiday request approved')
  }

  const handleRejectRequest = (requestId: string) => {
    setRequests((current) =>
      (current || []).map(r =>
        r.id === requestId ? { ...r, status: 'rejected' as const } : r
      )
    )
    toast.error('Holiday request rejected')
  }

  const calculateDaysBetweenDates = (start: string, end: string) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Holiday Pay Management</h2>
          <p className="text-muted-foreground mt-1">Track accruals, requests, and balances</p>
        </div>
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" />
              New Holiday Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Holiday Request</DialogTitle>
              <DialogDescription>
                Submit a new holiday request for approval
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reqWorker">Worker Name</Label>
                <Input
                  id="reqWorker"
                  placeholder="Enter worker name"
                  value={formData.workerName}
                  onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        startDate: e.target.value,
                        days: calculateDaysBetweenDates(e.target.value, formData.endDate)
                      })
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        endDate: e.target.value,
                        days: calculateDaysBetweenDates(formData.startDate, e.target.value)
                      })
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="days">Days Requested</Label>
                <Input
                  id="days"
                  type="number"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleRequestHoliday}>Submit Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Accrued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {accruals.reduce((sum, a) => sum + a.accruedDays, 0).toFixed(1)} days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {requests.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Days Taken (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {accruals.reduce((sum, a) => sum + a.takenDays, 0).toFixed(1)} days
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accruals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accruals">
            Accruals ({accruals.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests ({requests.filter(r => r.status === 'pending').length} pending)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accruals" className="space-y-3">
          {accruals.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No holiday accruals</h3>
              <p className="text-muted-foreground">Accruals are calculated automatically from timesheets</p>
            </Card>
          ) : (
            accruals.map((accrual) => (
              <Card key={accrual.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Airplane size={24} className="text-primary" weight="fill" />
                        <div>
                          <h3 className="font-semibold text-lg">{accrual.workerName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Last updated {new Date(accrual.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Accrued</p>
                          <p className="font-semibold font-mono text-lg">{accrual.accruedDays.toFixed(1)} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Taken</p>
                          <p className="font-semibold font-mono text-lg">{accrual.takenDays.toFixed(1)} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Remaining</p>
                          <p className={cn(
                            "font-semibold font-mono text-lg",
                            accrual.remainingDays < 5 ? "text-warning" : "text-success"
                          )}>
                            {accrual.remainingDays.toFixed(1)} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-3">
          {requests.length === 0 ? (
            <Card className="p-12 text-center">
              <Airplane size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No holiday requests</h3>
              <p className="text-muted-foreground">Create a new holiday request to get started</p>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        {request.status === 'pending' && <Clock size={24} className="text-warning" weight="fill" />}
                        {request.status === 'approved' && <CheckCircle size={24} className="text-success" weight="fill" />}
                        {request.status === 'rejected' && <Clock size={24} className="text-destructive" weight="fill" />}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{request.workerName}</h3>
                            <Badge variant={
                              request.status === 'approved' ? 'success' :
                              request.status === 'rejected' ? 'destructive' : 'warning'
                            }>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Requested on {new Date(request.requestedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Start Date</p>
                          <p className="font-medium">{new Date(request.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">End Date</p>
                          <p className="font-medium">{new Date(request.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Days</p>
                          <p className="font-semibold font-mono">{request.days}</p>
                        </div>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" onClick={() => handleApproveRequest(request.id)}
                          style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>
                          <CheckCircle size={16} className="mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(request.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Calculator size={24} className="text-primary" />
            <div>
              <p className="font-medium">Accrual Calculation</p>
              <p className="text-sm text-muted-foreground">
                Holiday pay accrues at {STANDARD_ACCRUAL_RATE}% of hours worked (5.6 weeks per year statutory minimum)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
