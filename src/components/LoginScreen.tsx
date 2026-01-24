import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Buildings, Lock, User, Eye, EyeSlash } from '@phosphor-icons/react'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { toast } from 'sonner'
import loginsData from '@/data/logins.json'
import rolesData from '@/data/roles-permissions.json'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter your email and password')
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      const user = loginsData.users.find(u => u.email === email && u.password === password)
      
      if (!user) {
        toast.error('Invalid credentials')
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
      
      toast.success(`Welcome back, ${user.name}!`)
      setIsLoading(false)
    }, 800)
  }

  const handleExpressAdminLogin = () => {
    const adminUser = loginsData.users.find(u => 
      u.role === 'Super Administrator' || u.role === 'Administrator' || u.roleId === 'super-admin' || u.roleId === 'admin'
    )
    
    if (!adminUser) {
      toast.error('Admin user not found')
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
    
    toast.success(`Express login: Welcome ${adminUser.name}!`)
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
            Welcome to<br />WorkForce Pro
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-md">
            Your complete back-office platform for workforce management, billing, and compliance.
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Streamlined Operations</h3>
                <p className="text-white/80 text-sm">Automate timesheets, billing, and payroll in one unified platform</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Real-Time Insights</h3>
                <p className="text-white/80 text-sm">Monitor KPIs and make data-driven decisions instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Enterprise Security</h3>
                <p className="text-white/80 text-sm">Bank-level encryption and compliance-ready audit trails</p>
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
              <span className="text-2xl font-semibold text-foreground">WorkForce Pro</span>
            </div>
            <h2 className="text-3xl font-semibold text-foreground mb-2">Log in to your account</h2>
            <p className="text-muted-foreground">Enter your credentials to access the platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
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
                Password
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>

            {isDevelopment && (
              <Button
                type="button"
                onClick={handleExpressAdminLogin}
                variant="outline"
                className="w-full h-11 text-base font-medium mt-3 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                🚀 Express Admin Login (Dev Only)
              </Button>
            )}
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <details className="group">
              <summary className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                Test Accounts (Click to expand)
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
              Don't have an account?{' '}
              <button className="text-accent hover:text-accent/80 font-medium transition-colors">
                Contact Sales
              </button>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              By logging in, you agree to our{' '}
              <button className="text-foreground hover:text-accent transition-colors">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-foreground hover:text-accent transition-colors">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
