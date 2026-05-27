export function calculateTaxMonth(date: Date): number {
  const month = date.getMonth() + 1
  const taxMonth = month >= 4 ? month - 3 : month + 9
  return taxMonth
}

export function calculateTaxYear(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  if (month >= 4) {
    return `${year}/${year + 1}`
  }
  return `${year - 1}/${year}`
}

export function calculateApprenticeshipLevy(totalPayroll: number): number {
  const allowance = 15000
  const levyRate = 0.005

  if (totalPayroll <= 3000000) return 0

  const levy = (totalPayroll * levyRate) - allowance
  return Math.max(0, levy)
}
