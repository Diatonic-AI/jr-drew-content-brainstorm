import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/stores/authStore'

export interface RoleGuardProps {
  allowedRoles: string[]
  redirectTo?: string
}

export const RoleGuard = ({ allowedRoles, redirectTo = '/' }: RoleGuardProps) => {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

export default RoleGuard
