import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Clock, FloppyDisk } from '@phosphor-icons/react'
import { SessionManager } from '@/components/SessionManager'
import type { SecuritySettings } from '@/hooks/useProfileView'

interface Props {
  security: SecuritySettings
  setSecurity: (s: SecuritySettings) => void
  onSave: () => void
  onToggleTwoFactor: (checked: boolean) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function SecurityTab({ security, setSecurity, onSave, onToggleTwoFactor, t }: Props) {
  const patch = (updates: Partial<SecuritySettings>) => setSecurity({ ...security, ...updates })

  const timeoutOptions = [
    { value: '15', label: t('profile.minutes15') },
    { value: '30', label: t('profile.minutes30') },
    { value: '60', label: t('profile.hour1') },
    { value: '120', label: t('profile.hours2') },
    { value: '240', label: t('profile.hours4') },
  ]

  return (
    <>
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
              <Switch id="twoFactor" checked={security.twoFactorEnabled} onCheckedChange={onToggleTwoFactor} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout" className="flex items-center gap-2">
                <Clock size={16} />{t('profile.sessionTimeout')}
              </Label>
              <p className="text-sm text-muted-foreground mb-2">{t('profile.sessionTimeoutDescription')}</p>
              <Select value={security.sessionTimeout} onValueChange={value => patch({ sessionTimeout: value })}>
                <SelectTrigger id="sessionTimeout"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timeoutOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="loginAlerts">{t('profile.loginAlerts')}</Label>
                <p className="text-sm text-muted-foreground">{t('profile.loginAlertsDescription')}</p>
              </div>
              <Switch id="loginAlerts" checked={security.loginAlerts} onCheckedChange={checked => patch({ loginAlerts: checked })} />
            </div>
          </div>
          <div className="pt-4">
            <Button onClick={onSave}><FloppyDisk size={16} />{t('profile.saveSecuritySettings')}</Button>
          </div>
        </CardContent>
      </Card>
      <SessionManager />
    </>
  )
}
