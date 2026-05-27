import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useSessionTimeoutPreferences } from '@/hooks/use-session-timeout-preferences'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'

export interface ProfileData { name: string; email: string; phone: string; jobTitle: string; department: string; location: string }
export interface ProfileSettings { emailNotifications: boolean; pushNotifications: boolean; weeklyDigest: boolean; timesheetReminders: boolean; invoiceAlerts: boolean; language: string; timezone: string; dateFormat: string; timeFormat: string; currency: string }
export interface SecuritySettings { twoFactorEnabled: boolean; sessionTimeout: string; loginAlerts: boolean }

export function useProfileView() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { preferences: timeoutPrefs, updateTimeout } = useSessionTimeoutPreferences()
  const [isEditing, setIsEditing] = useState(false)

  const defaultProfile = (): ProfileData => ({
    name: user?.name || '', email: user?.email || '', phone: '',
    jobTitle: 'System Administrator', department: 'Operations', location: 'London, UK',
  })

  const [profileData, setProfileData] = useState<ProfileData>(defaultProfile)
  const [settings, setSettings] = useState<ProfileSettings>({
    emailNotifications: true, pushNotifications: false, weeklyDigest: true,
    timesheetReminders: true, invoiceAlerts: true,
    language: 'en', timezone: 'Europe/London', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', currency: 'GBP',
  })
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false, sessionTimeout: '30', loginAlerts: true,
  })

  useEffect(() => {
    if (timeoutPrefs) setSecurity(prev => ({ ...prev, sessionTimeout: String(timeoutPrefs.timeoutMinutes) }))
  }, [timeoutPrefs])

  const getUserInitials = () =>
    user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'

  const handleSaveProfile = () => { toast.success(t('profile.profileUpdated')); setIsEditing(false) }
  const handleCancelEdit = () => { setProfileData(defaultProfile()); setIsEditing(false) }
  const handleSaveSettings = () => toast.success(t('profile.settingsSaved'))
  const handleSaveSecurity = () => {
    updateTimeout(Number(security.sessionTimeout))
    toast.success(t('profile.securitySettingsUpdated'), { description: t('profile.sessionTimeoutSet', { minutes: security.sessionTimeout }) })
  }

  const toggleTwoFactor = (checked: boolean) => {
    setSecurity(s => ({ ...s, twoFactorEnabled: checked }))
    if (checked) toast.success(t('profile.twoFactorEnabled'))
    else toast.info(t('profile.twoFactorDisabled'))
  }

  return {
    t, user, isEditing, setIsEditing,
    profileData, setProfileData,
    settings, setSettings,
    security, setSecurity,
    getUserInitials,
    handleSaveProfile, handleCancelEdit, handleSaveSettings, handleSaveSecurity, toggleTwoFactor,
  }
}
