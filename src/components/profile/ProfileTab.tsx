import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Camera, FloppyDisk, Lock, X } from '@phosphor-icons/react'
import type { ProfileData } from '@/hooks/useProfileView'

interface Props {
  user: { name: string; email: string; role?: string; avatarUrl?: string } | null
  isEditing: boolean
  profileData: ProfileData
  setProfileData: (data: ProfileData) => void
  getUserInitials: () => string
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ProfileTab({ user, isEditing, profileData, setProfileData, getUserInitials, onEdit, onSave, onCancel, t }: Props) {
  const patch = (updates: Partial<ProfileData>) => setProfileData({ ...profileData, ...updates })

  const fields: { id: keyof ProfileData; label: string; type?: string; placeholder?: string }[] = [
    { id: 'name', label: t('profile.fullName') },
    { id: 'email', label: t('profile.emailAddress'), type: 'email' },
    { id: 'phone', label: t('profile.phoneNumber'), type: 'tel', placeholder: '+44 20 1234 5678' },
    { id: 'jobTitle', label: t('profile.jobTitle') },
    { id: 'department', label: t('profile.department') },
    { id: 'location', label: t('profile.location') },
  ]

  return (
    <>
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
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0" disabled={!isEditing}>
                <Camera size={16} />
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{user?.role || 'Admin'}</Badge>
                <Badge variant="secondary">{t('profile.active')}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t('profile.memberSince', { date: 'January 2024' })}</p>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={onEdit}>{t('profile.editProfile')}</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={onCancel}><X size={16} />{t('common.cancel')}</Button>
                  <Button onClick={onSave}><FloppyDisk size={16} />{t('profile.saveChanges')}</Button>
                </>
              )}
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-6">
            {fields.map(({ id, label, type, placeholder }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} type={type} placeholder={placeholder} value={profileData[id] as string} onChange={e => patch({ [id]: e.target.value })} disabled={!isEditing} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.changePassword')}</CardTitle>
          <CardDescription>{t('profile.changePasswordDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[['currentPassword', t('profile.currentPassword')], ['newPassword', t('profile.newPassword')], ['confirmPassword', t('profile.confirmNewPassword')]].map(([id, label]) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id}>{label}</Label>
              <Input id={id} type="password" />
            </div>
          ))}
          <Button variant="secondary"><Lock size={16} />{t('profile.updatePassword')}</Button>
        </CardContent>
      </Card>
    </>
  )
}
