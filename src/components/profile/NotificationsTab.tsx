import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { FloppyDisk } from '@phosphor-icons/react'
import type { ProfileSettings } from '@/hooks/useProfileView'

interface Props {
  settings: ProfileSettings
  setSettings: (s: ProfileSettings) => void
  onSave: () => void
  t: (key: string) => string
}

type BooleanSettingKey = { [K in keyof ProfileSettings]: ProfileSettings[K] extends boolean ? K : never }[keyof ProfileSettings]

function NotificationRow({ id, label, description, checked, onChange }: { id: string; label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export function NotificationsTab({ settings, setSettings, onSave, t }: Props) {
  const patch = (key: BooleanSettingKey) => (checked: boolean) => setSettings({ ...settings, [key]: checked })

  const rows: { id: BooleanSettingKey; label: string; description: string }[] = [
    { id: 'emailNotifications', label: t('profile.emailNotifications'), description: t('profile.emailNotificationsDescription') },
    { id: 'pushNotifications', label: t('profile.pushNotifications'), description: t('profile.pushNotificationsDescription') },
    { id: 'weeklyDigest', label: t('profile.weeklyDigest'), description: t('profile.weeklyDigestDescription') },
    { id: 'timesheetReminders', label: t('profile.timesheetReminders'), description: t('profile.timesheetRemindersDescription') },
    { id: 'invoiceAlerts', label: t('profile.invoiceAlerts'), description: t('profile.invoiceAlertsDescription') },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.notificationPreferences')}</CardTitle>
        <CardDescription>{t('profile.notificationPreferencesDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {rows.map((row, i) => (
            <div key={row.id}>
              <NotificationRow {...row} checked={settings[row.id]} onChange={patch(row.id)} />
              {i < rows.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
        <div className="pt-4">
          <Button onClick={onSave}><FloppyDisk size={16} />{t('profile.saveNotificationSettings')}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
