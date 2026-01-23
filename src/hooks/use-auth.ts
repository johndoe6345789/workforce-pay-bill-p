import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { setCurrentView } from '@/store/slices/uiSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, currentEntity } = useAppSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(setCurrentView('dashboard'))
  }

  return {
    user,
    isAuthenticated,
    currentEntity,
    logout: handleLogout,
  }
}
