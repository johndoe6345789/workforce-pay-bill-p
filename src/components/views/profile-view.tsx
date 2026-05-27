import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Palette, Bell, Shield } from '@phosphor-icons/react'
import { ProfileTab } from '@/components/profile/ProfileTab'
import { PreferencesTab } from '@/components/profile/PreferencesTab'
import { NotificationsTab } from '@/components/profile/NotificationsTab'
import { SecurityTab } from '@/components/profile/SecurityTab'
import { useProfileView } from '@/hooks/useProfileView'

export function ProfileView() {
  const vm = useProfileView()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">{vm.t('profile.title')}</h2>
        <p className="text-muted-foreground mt-1">{vm.t('profile.subtitle')}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2"><User size={16} />{vm.t('profile.profileTab')}</TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2"><Palette size={16} />{vm.t('profile.preferencesTab')}</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell size={16} />{vm.t('profile.notificationsTab')}</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield size={16} />{vm.t('profile.securityTab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab
            user={vm.user}
            isEditing={vm.isEditing}
            profileData={vm.profileData}
            setProfileData={vm.setProfileData}
            getUserInitials={vm.getUserInitials}
            onEdit={() => vm.setIsEditing(true)}
            onSave={vm.handleSaveProfile}
            onCancel={vm.handleCancelEdit}
            t={vm.t}
          />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferencesTab settings={vm.settings} setSettings={vm.setSettings} onSave={vm.handleSaveSettings} t={vm.t} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationsTab settings={vm.settings} setSettings={vm.setSettings} onSave={vm.handleSaveSettings} t={vm.t} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab security={vm.security} setSecurity={vm.setSecurity} onSave={vm.handleSaveSecurity} onToggleTwoFactor={vm.toggleTwoFactor} t={vm.t} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
