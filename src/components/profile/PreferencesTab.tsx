import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, Clock, FloppyDisk } from '@phosphor-icons/react'
import type { ProfileSettings } from '@/hooks/useProfileView'

interface SelectDef { id: keyof ProfileSettings; label: string; icon?: React.ReactNode; options: { value: string; label: string }[] }

interface Props {
  settings: ProfileSettings
  setSettings: (s: ProfileSettings) => void
  onSave: () => void
  t: (key: string) => string
}

export function PreferencesTab({ settings, setSettings, onSave, t }: Props) {
  const patch = (updates: Partial<ProfileSettings>) => setSettings({ ...settings, ...updates })

  const selects: SelectDef[] = [
    { id: 'language', label: t('profile.language'), icon: <Globe size={16} />, options: [{ value: 'en', label: 'English' }, { value: 'es', label: 'Español' }, { value: 'fr', label: 'Français' }, { value: 'de', label: 'Deutsch' }] },
    { id: 'timezone', label: t('profile.timezone'), icon: <Clock size={16} />, options: [{ value: 'Europe/London', label: 'London (GMT)' }, { value: 'Europe/Paris', label: 'Paris (CET)' }, { value: 'America/New_York', label: 'New York (EST)' }, { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' }] },
    { id: 'dateFormat', label: t('profile.dateFormat'), options: [{ value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }, { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }] },
    { id: 'timeFormat', label: t('profile.timeFormat'), options: [{ value: '24h', label: '24-hour' }, { value: '12h', label: '12-hour (AM/PM)' }] },
    { id: 'currency', label: t('profile.defaultCurrency'), options: [{ value: 'GBP', label: 'GBP (£)' }, { value: 'EUR', label: 'EUR (€)' }, { value: 'USD', label: 'USD ($)' }] },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.regionalSettings')}</CardTitle>
        <CardDescription>{t('profile.regionalSettingsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {selects.map(({ id, label, icon, options }) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id} className={icon ? 'flex items-center gap-2' : ''}>{icon}{label}</Label>
              <Select value={settings[id] as string} onValueChange={value => patch({ [id]: value })}>
                <SelectTrigger id={id}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="pt-4">
          <Button onClick={onSave}><FloppyDisk size={16} />{t('profile.savePreferences')}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
