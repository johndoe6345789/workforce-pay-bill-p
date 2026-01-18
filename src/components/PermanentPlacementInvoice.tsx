import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { UserPlus, Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Invoice, PlacementDetails } from '@/lib/types'

interface PermanentPlacementInvoiceProps {
  onCreateInvoice: (invoice: Invoice) => void
}

export function PermanentPlacementInvoice({ onCreateInvoice }: PermanentPlacementInvoiceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    candidateName: '',
    position: '',
    startDate: '',
    salary: '',
    feePercentage: '20',
    guaranteePeriod: '90'
  })

  const handleSubmit = () => {
    if (!formData.clientName || !formData.candidateName || !formData.position || !formData.startDate || !formData.salary) {
      toast.error('Please fill in all required fields')
      return
    }

    const salary = parseFloat(formData.salary)
    const feePercentage = parseFloat(formData.feePercentage)
    const feeAmount = (salary * feePercentage) / 100

    const placementDetails: PlacementDetails = {
      candidateName: formData.candidateName,
      position: formData.position,
      startDate: formData.startDate,
      salary: salary,
      feePercentage: feePercentage,
      guaranteePeriod: parseInt(formData.guaranteePeriod)
    }

    const invoice: Invoice = {
      id: `INV-PP-${Date.now()}`,
      invoiceNumber: `PP-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      clientName: formData.clientName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: feeAmount,
      status: 'draft',
      currency: 'GBP',
      type: 'permanent-placement',
      placementDetails: placementDetails,
      lineItems: [{
        id: `LI-${Date.now()}`,
        description: `Permanent placement fee: ${formData.candidateName} - ${formData.position}`,
        quantity: 1,
        rate: feeAmount,
        amount: feeAmount
      }],
      notes: `${feePercentage}% placement fee on annual salary of £${salary.toLocaleString()}. ${formData.guaranteePeriod} day guarantee period.`
    }

    onCreateInvoice(invoice)
    toast.success(`Placement invoice ${invoice.invoiceNumber} created for £${feeAmount.toLocaleString()}`)
    
    setFormData({
      clientName: '',
      candidateName: '',
      position: '',
      startDate: '',
      salary: '',
      feePercentage: '20',
      guaranteePeriod: '90'
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus size={18} className="mr-2" />
          Permanent Placement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Permanent Placement Invoice</DialogTitle>
          <DialogDescription>
            Generate an invoice for a permanent placement fee
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="pp-client">Client Name *</Label>
            <Input
              id="pp-client"
              placeholder="Enter client name"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pp-candidate">Candidate Name *</Label>
            <Input
              id="pp-candidate"
              placeholder="Enter candidate name"
              value={formData.candidateName}
              onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pp-position">Position *</Label>
            <Input
              id="pp-position"
              placeholder="e.g. Senior Developer"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pp-start">Start Date *</Label>
            <Input
              id="pp-start"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pp-salary">Annual Salary (£) *</Label>
            <Input
              id="pp-salary"
              type="number"
              step="1000"
              placeholder="50000"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pp-fee">Fee Percentage *</Label>
            <Input
              id="pp-fee"
              type="number"
              step="1"
              placeholder="20"
              value={formData.feePercentage}
              onChange={(e) => setFormData({ ...formData, feePercentage: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pp-guarantee">Guarantee Period (days) *</Label>
            <Input
              id="pp-guarantee"
              type="number"
              placeholder="90"
              value={formData.guaranteePeriod}
              onChange={(e) => setFormData({ ...formData, guaranteePeriod: e.target.value })}
            />
          </div>
        </div>
        {formData.salary && formData.feePercentage && (
          <div className="bg-accent/10 rounded-lg p-4 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Calculated Fee:</span>
              <span className="text-2xl font-semibold font-mono">
                £{((parseFloat(formData.salary) * parseFloat(formData.feePercentage)) / 100).toLocaleString()}
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Placement Invoice</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
