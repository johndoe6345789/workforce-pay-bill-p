import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Buildings, Lock, User, Eye, EyeSlash } from '@phosphor-icons/react'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import loginsData from '@/data/logins.json'
import rolesData from '@/data/roles-permissions.json'
import { TIMEOUTS } from '@/lib/constants'
import { sanitizeEmail } from '@/lib/sanitize'
import { isValidEmail } from '@/lib/type-guards'
import { handleError } from '@/lib/error-handler'

export default function LoginScreen() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const sanitizedEmail = sanitizeEmail(email)

    if (!sanitizedEmail || !password) {
      toast.error(t('login.enterEmailPassword'))
      return
    }

    if (!isValidEmail(sanitizedEmail)) {
      toast.error(t('login.invalidEmail'))
      return
    }

    setIsLoading(true)

    try {
      setTimeout(() => {
        const user = loginsData.users.find(u => u.email === sanitizedEmail && u.password === password)

        if (!user) {
          toast.error(t('login.invalidCredentials'))
          setIsLoading(false)
          return
        }

        const role = rolesData.roles.find(r => r.id === user.roleId)
        const permissions = role?.permissions || []

        dispatch(login({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          roleId: user.roleId,
          avatarUrl: user.avatarUrl || undefined,
          permissions
        }))

        toast.success(t('login.welcomeBack', { name: user.name }))
        setIsLoading(false)
      }, TIMEOUTS.LOGIN_DELAY)
    } catch (error) {
      handleError(error, 'Login')
      setIsLoading(false)
    }
  }

  const handleExpressAdminLogin = () => {
    const adminUser = loginsData.users.find(u =>
      u.roleId === 'super-admin' || u.roleId === 'admin'
    )

    if (!adminUser) {
      toast.error(t('login.adminNotFound'))
      console.error('Available users:', loginsData.users.map(u => ({ email: u.email, roleId: u.roleId })))
      return
    }

    const role = rolesData.roles.find(r => r.id === adminUser.roleId)
    const permissions = role?.permissions || []

    dispatch(login({
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      roleId: adminUser.roleId,
      avatarUrl: adminUser.avatarUrl || undefined,
      permissions
    }))

    toast.success(t('login.expressWelcome', { name: adminUser.name }))
  }

  const isDevelopment = import.meta.env.DEV

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-accent to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <Buildings size={64} weight="duotone" />
          </div>
          <h1 className="text-5xl font-semibold mb-6 leading-tight">
            {t('login.welcomeTo')}<br />{t('login.workforcePro')}
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-md">
            {t('login.platformDescription')}
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{t('login.streamlinedOperations')}</h3>
                <p className="text-white/80 text-sm">{t('login.streamlinedOperationsDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{t('login.realTimeInsights')}</h3>
                <p className="text-white/80 text-sm">{t('login.realTimeInsightsDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{t('login.enterpriseSecurity')}</h3>
                <p className="text-white/80 text-sm">{t('login.enterpriseSecurityDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Buildings size={32} className="text-primary" weight="duotone" />
              <span className="text-2xl font-semibold text-foreground">{t('login.workforcePro')}</span>
            </div>
            <h2 className="text-3xl font-semibold text-foreground mb-2">{t('login.loginToAccount')}</h2>
            <p className="text-muted-foreground">{t('login.enterCredentials')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t('login.emailAddress')}
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {t('login.password')}
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  {t('login.rememberMe')}
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                disabled={isLoading}
              >
                {t('login.forgotPassword')}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? t('login.loggingIn') : t('login.logIn')}
            </Button>

            {isDevelopment && (
              <Button
                type="button"
                onClick={handleExpressAdminLogin}
                variant="outline"
                className="w-full h-11 text-base font-medium mt-3 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                🚀 {t('login.expressAdminLogin')}
              </Button>
            )}
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <details className="group">
              <summary className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                {t('login.testAccounts')}
              </summary>
              <div className="mt-3 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-mono">
                    <div className="font-semibold mb-1">Admin:</div>
                    <div>admin@workforce.com</div>
                    <div className="text-muted-foreground">admin123</div>
                  </div>
                  <div className="font-mono">
                    <div className="font-semibold mb-1">Finance:</div>
                    <div>finance@workforce.com</div>
                    <div className="text-muted-foreground">finance123</div>
                  </div>
                  <div className="font-mono">
                    <div className="font-semibold mb-1">Payroll:</div>
                    <div>payroll@workforce.com</div>
                    <div className="text-muted-foreground">payroll123</div>
                  </div>
                  <div className="font-mono">
                    <div className="font-semibold mb-1">Compliance:</div>
                    <div>compliance@workforce.com</div>
                    <div className="text-muted-foreground">compliance123</div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t('login.dontHaveAccount')}{' '}
              <button className="text-accent hover:text-accent/80 font-medium transition-colors">
                {t('login.contactSales')}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              {t('login.termsAgreement')}{' '}
              <button className="text-foreground hover:text-accent transition-colors">
                {t('login.termsOfService')}
              </button>{' '}
              {t('login.and')}{' '}
              <button className="text-foreground hover:text-accent transition-colors">
                {t('login.privacyPolicy')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
