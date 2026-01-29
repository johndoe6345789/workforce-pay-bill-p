import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SessionManager } from '@/components/SessionManager'
import { useAuth } from '@/hooks/use-auth'
import { useSessionTimeoutPreferences } from '@/hooks/use-session-timeout-preferences'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import {
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  Shield,
  Clock,
  Camera,
  FloppyDisk,
  X
} from '@phosphor-icons/react'

export function ProfileView() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const { preferences: timeoutPrefs, updateTimeout } = useSessionTimeoutPreferences()
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    jobTitle: 'System Administrator',
    department: 'Operations',
    location: 'London, UK',
  })

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    timesheetReminders: true,
    invoiceAlerts: true,
    language: 'en',
    timezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'GBP',
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginAlerts: true,
  })

  useEffect(() => {
    if (timeoutPrefs) {
      setSecurity(prev => ({
        ...prev,
        sessionTimeout: String(timeoutPrefs.timeoutMinutes)
      }))
    }
  }, [timeoutPrefs])

  const getUserInitials = () => {
    if (!user) return 'U'
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSaveProfile = () => {
    toast.success(t('profile.profileUpdated'))
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      jobTitle: 'System Administrator',
      department: 'Operations',
      location: 'London, UK',
    })
    setIsEditing(false)
  }

  const handleSaveSettings = () => {
    toast.success(t('profile.settingsSaved'))
  }

  const handleSaveSecurity = () => {
    updateTimeout(Number(security.sessionTimeout))
    toast.success(t('profile.securitySettingsUpdated'), {
      description: t('profile.sessionTimeoutSet', { minutes: security.sessionTimeout }),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">{t('profile.title')}</h2>
        <p className="text-muted-foreground mt-1">{t('profile.subtitle')}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User size={16} />
            {t('profile.profileTab')}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette size={16} />
            {t('profile.preferencesTab')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={16} />
            {t('profile.notificationsTab')}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={16} />
            {t('profile.securityTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.profileInformation')}</CardTitle>
              <CardDescription>{t('profile.profileInformationDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    disabled={!isEditing}
                  >
                    <Camera size={16} />
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{user?.role || 'Admin'}</Badge>
                    <Badge variant="secondary">{t('profile.active')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('profile.memberSince', { date: 'January 2024' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      {t('profile.editProfile')}
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        <X size={16} />
                        {t('common.cancel')}
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        <FloppyDisk size={16} />
                        {t('profile.saveChanges')}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('profile.fullName')}</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.emailAddress')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('profile.phoneNumber')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+44 20 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">{t('profile.jobTitle')}</Label>
                  <Input
                    id="jobTitle"
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{t('profile.department')}</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t('profile.location')}</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.changePassword')}</CardTitle>
              <CardDescription>{t('profile.changePasswordDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('profile.confirmNewPassword')}</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button variant="secondary">
                <Lock size={16} />
                {t('profile.updatePassword')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.regionalSettings')}</CardTitle>
              <CardDescription>{t('profile.regionalSettingsDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2">
                    <Globe size={16} />
                    {t('profile.language')}
                  </Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="flex items-center gap-2">
                    <Clock size={16} />
                    {t('profile.timezone')}
                  </Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="America/New_York">New York (EST)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Los Angeles (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">{t('profile.dateFormat')}</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}>
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">{t('profile.timeFormat')}</Label>
                  <Select value={settings.timeFormat} onValueChange={(value) => setSettings({ ...settings, timeFormat: value })}>
                    <SelectTrigger id="timeFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24-hour</SelectItem>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t('profile.defaultCurrency')}</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  <FloppyDisk size={16} />
                  {t('profile.savePreferences')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.notificationPreferences')}</CardTitle>
              <CardDescription>{t('profile.notificationPreferencesDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">{t('profile.emailNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('profile.emailNotificationsDescription')}</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">{t('profile.pushNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('profile.pushNotificationsDescription')}</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weeklyDigest">{t('profile.weeklyDigest')}</Label>
                    <p className="text-sm text-muted-foreground">{t('profile.weeklyDigestDescription')}</p>
                  </div>
                  <Switch
                    id="weeklyDigest"
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="timesheetReminders">{t('profile.timesheetReminders')}</Label>
                    <p className="text-sm text-muted-foreground">{t('profile.timesheetRemindersDescription')}</p>
                  </div>
                  <Switch
                    id="timesheetReminders"
                    checked={settings.timesheetReminders}
                    onCheckedChange={(checked) => setSettings({ ...settings, timesheetReminders: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="invoiceAlerts">{t('profile.invoiceAlerts')}</Label>
                    <p className="text-sm text-muted-foreground">{t('profile.invoiceAlertsDescription')}</p>
                  </div>
                  <Switch
                    id="invoiceAlerts"
                    checked={settings.invoiceAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, invoiceAlerts: checked })}
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  <FloppyDisk size={16} />
                  {t('profile.saveNotificationSettings')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.securitySettings')}</CardTitle>
              <CardDescription>{t('profile.securitySettingsDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactor">{t('profile.twoFactorAuth')}</Label>
                    <p className="text-sm text-muted-foreground">{t('profile.twoFactorAuthDescription')}</p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => {
                      setSecurity({ ...security, twoFactorEnabled: checked })
                      if (checked) {
                        toast.success(t('profile.twoFactorEnabled'))
                      } else {
                        toast.info(t('profile.twoFactorDisabled'))
                      }
                    }}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="flex items-center gap-2">
                    <Clock size={16} />
                    {t('profile.sessionTimeout')}
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('profile.sessionTimeoutDescription')}
                  </p>
                  <Select
                    value={security.sessionTimeout}
                    onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                  >
                    <SelectTrigger id="sessionTimeout">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">{t('profile.minutes15')}</SelectItem>
                      <SelectItem value="30">{t('profile.minutes30')}</SelectItem>
                      <SelectItem value="60">{t('profile.hour1')}</SelectItem>
                      <SelectItem value="120">{t('profile.hours2')}</SelectItem>
                      <SelectItem value="240">{t('profile.hours4')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="loginAlerts">{t('profile.loginAlerts')}</Label>
                    <p className="text-sm text-muted-foreground">{t('profile.loginAlertsDescription')}</p>
                  </div>
                  <Switch
                    id="loginAlerts"
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={handleSaveSecurity}>
                  <FloppyDisk size={16} />
                  {t('profile.saveSecuritySettings')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <SessionManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
