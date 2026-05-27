import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Buildings, Lock, User, Eye, EyeSlash } from '@phosphor-icons/react'
import { useLoginScreen } from '@/hooks/useLoginScreen'
import { LoginBrandingPanel } from '@/components/login/LoginBrandingPanel'

export default function LoginScreen() {
  const vm = useLoginScreen()

  return (
    <div className="min-h-screen w-full flex">
      <LoginBrandingPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Buildings size={32} className="text-primary" weight="duotone" />
              <span className="text-2xl font-semibold text-foreground">{vm.t('login.workforcePro')}</span>
            </div>
            <h2 className="text-3xl font-semibold text-foreground mb-2">{vm.t('login.loginToAccount')}</h2>
            <p className="text-muted-foreground">{vm.t('login.enterCredentials')}</p>
          </div>

          <form onSubmit={vm.handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{vm.t('login.emailAddress')}</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><User size={18} /></div>
                <Input id="email" type="email" placeholder={vm.t('login.emailPlaceholder')} value={vm.email} onChange={e => vm.setEmail(e.target.value)} className="pl-10 h-11" autoComplete="email" disabled={vm.isLoading} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">{vm.t('login.password')}</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock size={18} /></div>
                <Input id="password" type={vm.showPassword ? 'text' : 'password'} placeholder={vm.t('login.passwordPlaceholder')} value={vm.password} onChange={e => vm.setPassword(e.target.value)} className="pl-10 pr-10 h-11" autoComplete="current-password" disabled={vm.isLoading} />
                <button type="button" onClick={() => vm.setShowPassword(!vm.showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                  {vm.showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={vm.rememberMe} onCheckedChange={checked => vm.setRememberMe(checked as boolean)} disabled={vm.isLoading} />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">{vm.t('login.rememberMe')}</Label>
              </div>
              <button type="button" className="text-sm text-accent hover:text-accent/80 font-medium transition-colors" disabled={vm.isLoading}>{vm.t('login.forgotPassword')}</button>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={vm.isLoading}>
              {vm.isLoading ? vm.t('login.loggingIn') : vm.t('login.logIn')}
            </Button>

            {vm.isDevelopment && (
              <Button type="button" onClick={vm.handleExpressAdminLogin} variant="outline" className="w-full h-11 text-base font-medium mt-3 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                🚀 {vm.t('login.expressAdminLogin')}
              </Button>
            )}
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <details className="group">
              <summary className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors">{vm.t('login.testAccounts')}</summary>
              <div className="mt-3 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { role: 'Admin', email: 'admin@workforce.com', pass: 'admin123' },
                    { role: 'Finance', email: 'finance@workforce.com', pass: 'finance123' },
                    { role: 'Payroll', email: 'payroll@workforce.com', pass: 'payroll123' },
                    { role: 'Compliance', email: 'compliance@workforce.com', pass: 'compliance123' },
                  ].map(({ role, email, pass }) => (
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

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {vm.t('login.dontHaveAccount')}{' '}
              <button className="text-accent hover:text-accent/80 font-medium transition-colors">{vm.t('login.contactSales')}</button>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              {vm.t('login.termsAgreement')}{' '}
              <button className="text-foreground hover:text-accent transition-colors">{vm.t('login.termsOfService')}</button>{' '}
              {vm.t('login.and')}{' '}
              <button className="text-foreground hover:text-accent transition-colors">{vm.t('login.privacyPolicy')}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
