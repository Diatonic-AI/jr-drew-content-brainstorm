import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { UserProfile, UserRole } from '@/types/user'

interface AuthStoreState {
  user?: UserProfile
  accessToken?: string
  refreshToken?: string
  roles: UserRole[]
  permissions: string[]
}

interface AuthStoreActions {
  login: (payload: {
    user: UserProfile
    accessToken: string
    refreshToken?: string
    permissions?: string[]
  }) => void
  logout: () => void
  updateUser: (user: Partial<UserProfile>) => void
  setPermissions: (permissions: string[]) => void
}

type AuthStore = AuthStoreState & AuthStoreActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      roles: [],
      permissions: [],
      login: ({ user, accessToken, refreshToken, permissions }) =>
        set(() => ({
          user,
          accessToken,
          refreshToken,
          roles: [user.role],
          permissions: permissions ?? [],
        })),
      logout: () =>
        set(() => ({
          user: undefined,
          accessToken: undefined,
          refreshToken: undefined,
          roles: [],
          permissions: [],
        })),
      updateUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : undefined,
        })),
      setPermissions: (permissions) => set(() => ({ permissions })),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        permissions: state.permissions,
      }),
    }
  )
)

