import { useState } from 'react'
import { toast } from 'sonner'
import type { Invoice } from '@/lib/types'

interface FormData {
  clientName: string
  candidateName: string
  position: string
  startDate: string
  salary: string
  feePercentage: string
  guaranteePeriod: string
}

const EMPTY: FormData = {
  clientName: '', candidateName: '', position: '',
  startDate: '', salary: '',
  feePercentage: '20', guaranteePeriod: '90',
}

/** Manages form state and invoice creation for permanent placement. */
export function usePermanentPlacementInvoice(
  onCreateInvoice: (invoice: Invoice) => void,
) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>(EMPTY)
  const patch = (updates: Partial<FormData>) =>
    setFormData(prev => ({ ...prev, ...updates }))

  const calculatedFee =
    formData.salary && formData.feePercentage
      ? (parseFloat(formData.salary) * parseFloat(formData.feePercentage)) / 100
      : null

  const handleSubmit = () => {
    const { clientName, candidateName, position, startDate, salary } = formData
    if (!clientName || !candidateName || !position || !startDate || !salary) {
      toast.error('Please fill in all required fields')
      return
    }
    const salaryNum = parseFloat(salary)
    const feeNum = parseFloat(formData.feePercentage)
    const feeAmount = (salaryNum * feeNum) / 100
    const invoice: Invoice = {
      id: `INV-PP-${Date.now()}`,
      invoiceNumber: `PP-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      clientName, issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: feeAmount, status: 'draft', currency: 'GBP',
      type: 'permanent-placement',
      placementDetails: {
        candidateName, position, startDate: formData.startDate,
        salary: salaryNum, feePercentage: feeNum,
        guaranteePeriod: parseInt(formData.guaranteePeriod),
      },
      lineItems: [{ id: `LI-${Date.now()}`, description: `Permanent placement fee: ${candidateName} - ${position}`, quantity: 1, rate: feeAmount, amount: feeAmount }],
      notes: `${feeNum}% placement fee on annual salary of £${salaryNum.toLocaleString()}. ${formData.guaranteePeriod} day guarantee period.`,
    }
    onCreateInvoice(invoice)
    toast.success(`Placement invoice ${invoice.invoiceNumber} created for £${feeAmount.toLocaleString()}`)
    setFormData(EMPTY)
    setIsOpen(false)
  }

  return { isOpen, setIsOpen, formData, patch, calculatedFee, handleSubmit }
}
