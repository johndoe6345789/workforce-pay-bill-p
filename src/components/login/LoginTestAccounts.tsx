const TEST_ACCOUNTS = [
  { role: 'Admin',      email: 'admin@workforce.com',      pass: 'admin123' },
  { role: 'Finance',    email: 'finance@workforce.com',    pass: 'finance123' },
  { role: 'Payroll',    email: 'payroll@workforce.com',    pass: 'payroll123' },
  { role: 'Compliance', email: 'compliance@workforce.com', pass: 'compliance123' },
]

interface Props {
  t: (key: string) => string
}

export function LoginTestAccounts({ t }: Props) {
  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
      <details className="group">
        <summary className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors">{t('login.testAccounts')}</summary>
        <div className="mt-3 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            {TEST_ACCOUNTS.map(({ role, email, pass }) => (
              <div key={role} className="font-mono">
                <div className="font-semibold mb-1">{role}:</div>
                <div>{email}</div>
                <div className="text-muted-foreground">{pass}</div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  )
}
