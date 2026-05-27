import { useState } from 'react'
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

export function useLoginScreen() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isDevelopment = import.meta.env.DEV

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const sanitizedEmail = sanitizeEmail(email)
    if (!sanitizedEmail || !password) { toast.error(t('login.enterEmailPassword')); return }
    if (!isValidEmail(sanitizedEmail)) { toast.error(t('login.invalidEmail')); return }
    setIsLoading(true)
    try {
      setTimeout(() => {
        const user = loginsData.users.find(u => u.email === sanitizedEmail && u.password === password)
        if (!user) { toast.error(t('login.invalidCredentials')); setIsLoading(false); return }
        const role = rolesData.roles.find(r => r.id === user.roleId)
        dispatch(login({ id: user.id, email: user.email, name: user.name, role: user.role, roleId: user.roleId, avatarUrl: user.avatarUrl || undefined, permissions: role?.permissions || [] }))
        toast.success(t('login.welcomeBack', { name: user.name }))
        setIsLoading(false)
      }, TIMEOUTS.LOGIN_DELAY)
    } catch (error) {
      handleError(error, 'Login')
      setIsLoading(false)
    }
  }

  const handleExpressAdminLogin = () => {
    const adminUser = loginsData.users.find(u => u.roleId === 'super-admin' || u.roleId === 'admin')
    if (!adminUser) { toast.error(t('login.adminNotFound')); console.error('Available users:', loginsData.users.map(u => ({ email: u.email, roleId: u.roleId }))); return }
    const role = rolesData.roles.find(r => r.id === adminUser.roleId)
    dispatch(login({ id: adminUser.id, email: adminUser.email, name: adminUser.name, role: adminUser.role, roleId: adminUser.roleId, avatarUrl: adminUser.avatarUrl || undefined, permissions: role?.permissions || [] }))
    toast.success(t('login.expressWelcome', { name: adminUser.name }))
  }

  return { t, email, setEmail, password, setPassword, rememberMe, setRememberMe, showPassword, setShowPassword, isLoading, isDevelopment, handleLogin, handleExpressAdminLogin }
}
