import { Navigate, Outlet } from 'react-router-dom'

import { AppShell } from '@/app/AppShell'
import { useAuthStore } from '@/stores/authStore'

const ProtectedRoute = () => {
  const { user } = useAuthStore()

  // TEMPORARY: For development, bypass auth check
  // TODO: Remove this bypass once authentication flow is implemented
  const isDevelopment = import.meta.env.DEV

  if (!user && !isDevelopment) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export default ProtectedRoute
