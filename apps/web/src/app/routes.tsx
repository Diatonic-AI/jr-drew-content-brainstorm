import { Navigate, useRoutes } from 'react-router-dom'
import { Suspense } from 'react'

import { adminRoutes, developerRoutes, protectedRoutes, publicRoutes } from '@/routes'

export function AppRoutes() {
  const element = useRoutes([
    ...publicRoutes,
    ...protectedRoutes,
    ...adminRoutes,
    ...developerRoutes,
    { path: '*', element: <Navigate to="/" replace /> },
  ])

  return <Suspense fallback={null}>{element}</Suspense>
}

export default AppRoutes
