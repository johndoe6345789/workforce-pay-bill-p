import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { UserPlus } from '@phosphor-icons/react'
import type { Invoice } from '@/lib/types'
import { usePermanentPlacementInvoice } from '@/hooks/usePermanentPlacementInvoice'

interface PermanentPlacementInvoiceProps {
  onCreateInvoice: (invoice: Invoice) => void
}

type FieldKey = 'clientName' | 'candidateName' | 'position' | 'startDate' | 'salary' | 'feePercentage' | 'guaranteePeriod'

const FIELDS: { id: string; label: string; key: FieldKey; type?: string; step?: string; placeholder: string; colSpan?: boolean }[] = [
  { id: 'pp-client', label: 'Client Name *', key: 'clientName', placeholder: 'Enter client name', colSpan: true },
  { id: 'pp-candidate', label: 'Candidate Name *', key: 'candidateName', placeholder: 'Enter candidate name' },
  { id: 'pp-position', label: 'Position *', key: 'position', placeholder: 'e.g. Senior Developer' },
  { id: 'pp-start', label: 'Start Date *', key: 'startDate', type: 'date', placeholder: '' },
  { id: 'pp-salary', label: 'Annual Salary (£) *', key: 'salary', type: 'number', step: '1000', placeholder: '50000' },
  { id: 'pp-fee', label: 'Fee Percentage *', key: 'feePercentage', type: 'number', step: '1', placeholder: '20' },
  { id: 'pp-guarantee', label: 'Guarantee Period (days) *', key: 'guaranteePeriod', type: 'number', placeholder: '90' },
]

export function PermanentPlacementInvoice({ onCreateInvoice }: PermanentPlacementInvoiceProps) {
  const vm = usePermanentPlacementInvoice(onCreateInvoice)

  return (
    <Dialog open={vm.isOpen} onOpenChange={vm.setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><UserPlus size={18} className="mr-2" />Permanent Placement</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Permanent Placement Invoice</DialogTitle>
          <DialogDescription>Generate an invoice for a permanent placement fee</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {FIELDS.map(f => (
            <div key={f.id} className={`space-y-2${f.colSpan ? ' col-span-2' : ''}`}>
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input
                id={f.id}
                type={f.type}
                step={f.step}
                placeholder={f.placeholder}
                value={vm.formData[f.key]}
                onChange={e => vm.patch({ [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        {vm.calculatedFee !== null && (
          <div className="bg-accent/10 rounded-lg p-4 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Calculated Fee:</span>
              <span className="text-2xl font-semibold font-mono">£{vm.calculatedFee.toLocaleString()}</span>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => vm.setIsOpen(false)}>Cancel</Button>
          <Button onClick={vm.handleSubmit}>Create Placement Invoice</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
