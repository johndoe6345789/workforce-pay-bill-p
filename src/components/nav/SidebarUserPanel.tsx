import { Button } from '@/components/ui/button'
import { SignOut } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'

interface Props {
  /** Authenticated user, or null if not loaded. */
  user: { name: string; email: string } | null
  /** First two initials of the user's name. */
  userInitials: string
  /** Called when the user profile button is clicked. */
  onViewProfile: () => void
  /** Called when the logout button is clicked. */
  onLogout: () => void
}

/** Bottom sidebar panel: avatar, name, email, logout. */
export function SidebarUserPanel({ user, userInitials, onViewProfile, onLogout }: Props) {
  const { t } = useTranslation()
  const displayName = user?.name || t('common.user') || 'User'
  return (
    <div className="p-4 border-t border-border space-y-3">
      <button
        onClick={onViewProfile}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label={t('sidebar.viewProfileFor', { name: displayName })}
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium" aria-hidden="true">
          {userInitials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
        </div>
      </button>
      <Button variant="outline" size="sm" className="w-full justify-start gap-2"
        onClick={onLogout} aria-label={t('sidebar.logOut')}>
        <SignOut size={16} aria-hidden="true" />
        {t('sidebar.logOut')}
      </Button>
    </div>
  )
}
