import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string
  role: string
  roleId?: string
  avatarUrl?: string
  permissions?: string[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  currentEntity: string
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  currentEntity: 'Main Agency',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setCurrentEntity: (state, action: PayloadAction<string>) => {
      state.currentEntity = action.payload
    },
    updateUserRole: (state, action: PayloadAction<{ roleId: string; roleName: string; permissions: string[] }>) => {
      if (state.user) {
        state.user.roleId = action.payload.roleId
        state.user.role = action.payload.roleName
        state.user.permissions = action.payload.permissions
      }
    },
  },
})

export const { login, logout, setCurrentEntity, updateUserRole } = authSlice.actions
export default authSlice.reducer
