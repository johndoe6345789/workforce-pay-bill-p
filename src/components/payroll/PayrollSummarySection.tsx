interface Props {
  totalAmount: number
  workersCount: number
}

export function PayrollSummarySection({ totalAmount, workersCount }: Props) {
  const rows = [
    { label: 'Gross Pay', value: `£${totalAmount.toLocaleString()}` },
    { label: 'Average per Worker', value: `£${(totalAmount / workersCount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
  ]

  return (
    <div>
      <h3 className="font-semibold mb-3">Payroll Summary</h3>
      <div className="space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <span className="text-sm">{label}</span>
            <span className="font-mono font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
