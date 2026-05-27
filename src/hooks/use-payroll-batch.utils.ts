import type { PayrollDeduction } from './use-payroll-batch.types'

export function getPeriodStart(): string {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday.toISOString().split('T')[0]
}

export function getPeriodEnd(): string {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const sunday = new Date(today)
  sunday.setDate(today.getDate() + diff)
  return sunday.toISOString().split('T')[0]
}

export function calculateNetPay(grossPay: number): number {
  const taxRate = 0.20
  const niRate = 0.12
  const totalDeductions = grossPay * (taxRate + niRate)
  return grossPay - totalDeductions
}

export function calculateDeductions(grossPay: number): PayrollDeduction[] {
  const tax = grossPay * 0.20
  const ni = grossPay * 0.12

  return [
    {
      type: 'tax',
      description: 'Income Tax',
      amount: tax
    },
    {
      type: 'ni',
      description: 'National Insurance',
      amount: ni
    }
  ]
}
