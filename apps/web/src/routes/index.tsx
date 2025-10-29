import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import ProtectedRoute from '@/routes/ProtectedRoute'
import { RoleGuard } from '@/routes/RoleGuard'

const LandingPage = lazy(() => import('@/pages/public/Landing'))
const LoginPage = lazy(() => import('@/pages/public/Login'))
const RegisterPage = lazy(() => import('@/pages/public/Register'))
const ForgotPasswordPage = lazy(() => import('@/pages/public/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('@/pages/public/ResetPassword'))

const DashboardOverviewPage = lazy(() => import('@/pages/dashboard/Overview'))
const DashboardTimelinePage = lazy(() => import('@/pages/dashboard/Timeline'))
const DashboardAnalyticsPage = lazy(() => import('@/pages/dashboard/Analytics'))
const DashboardReportsPage = lazy(() => import('@/pages/dashboard/Reports'))

const FocusPage = lazy(() => import('@/pages/productivity/Focus'))
const BreaksPage = lazy(() => import('@/pages/productivity/Breaks'))
const GoalsPage = lazy(() => import('@/pages/productivity/Goals'))

const ProjectsListPage = lazy(() => import('@/pages/projects/ProjectsList'))
const ProjectDetailsPage = lazy(() => import('@/pages/projects/ProjectDetails'))
const ProjectCreatePage = lazy(() => import('@/pages/projects/ProjectCreate'))
const ProjectEditPage = lazy(() => import('@/pages/projects/ProjectEdit'))

const TasksListPage = lazy(() => import('@/pages/tasks/TasksList'))
const TaskBoardPage = lazy(() => import('@/pages/tasks/TaskBoard'))
const TaskDetailsPage = lazy(() => import('@/pages/tasks/TaskDetails'))
const TaskCreatePage = lazy(() => import('@/pages/tasks/TaskCreate'))

const DocsHomePage = lazy(() => import('@/pages/documentation/DocsHome'))
const APIReferencePage = lazy(() => import('@/pages/documentation/APIReference'))
const SDKGuidesPage = lazy(() => import('@/pages/documentation/SDKGuides'))
const TutorialsPage = lazy(() => import('@/pages/documentation/Tutorials'))

const SettingsLayout = lazy(() => import('@/pages/settings/SettingsLayout'))
const AccountSettingsPage = lazy(() => import('@/pages/settings/Account'))
const SystemSettingsPage = lazy(() => import('@/pages/settings/System'))
const AISettingsPage = lazy(() => import('@/pages/settings/AI'))
const BillingSettingsPage = lazy(() => import('@/pages/settings/Billing'))
const UsageSettingsPage = lazy(() => import('@/pages/settings/Usage'))
const KeyboardSettingsPage = lazy(() => import('@/pages/settings/Keyboard'))
const FeaturesSettingsPage = lazy(() => import('@/pages/settings/Features'))
const IntegrationsSettingsPage = lazy(() => import('@/pages/settings/Integrations'))

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminUserManagementPage = lazy(() => import('@/pages/admin/UserManagement'))
const AdminSystemHealthPage = lazy(() => import('@/pages/admin/SystemHealth'))
const AdminAuditLogsPage = lazy(() => import('@/pages/admin/AuditLogs'))

const TeamDashboardPage = lazy(() => import('@/pages/team/TeamDashboard'))
const TeamMembersPage = lazy(() => import('@/pages/team/TeamMembers'))
const TeamProjectsPage = lazy(() => import('@/pages/team/TeamProjects'))
const TeamReportsPage = lazy(() => import('@/pages/team/TeamReports'))

const MemberProfilePage = lazy(() => import('@/pages/member/Profile'))
const MemberPreferencesPage = lazy(() => import('@/pages/member/Preferences'))
const MemberNotificationsPage = lazy(() => import('@/pages/member/Notifications'))

const DeveloperDashboardPage = lazy(() => import('@/pages/developer/DeveloperDashboard'))
const DeveloperAPIKeysPage = lazy(() => import('@/pages/developer/APIKeys'))
const DeveloperWebhooksPage = lazy(() => import('@/pages/developer/Webhooks'))
const DeveloperSDKPlaygroundPage = lazy(() => import('@/pages/developer/SDKPlayground'))

export const publicRoutes: RouteObject[] = [
  // Redirect root to dashboard for now (can add proper landing page later)
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/landing', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
]

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard', element: <DashboardOverviewPage /> },
      { path: '/dashboard/timeline', element: <DashboardTimelinePage /> },
      { path: '/dashboard/analytics', element: <DashboardAnalyticsPage /> },
      { path: '/dashboard/reports', element: <DashboardReportsPage /> },
      { path: '/productivity/focus', element: <FocusPage /> },
      { path: '/productivity/breaks', element: <BreaksPage /> },
      { path: '/productivity/goals', element: <GoalsPage /> },
      { path: '/projects', element: <ProjectsListPage /> },
      { path: '/projects/:projectId', element: <ProjectDetailsPage /> },
      { path: '/projects/:projectId/edit', element: <ProjectEditPage /> },
      { path: '/projects/new', element: <ProjectCreatePage /> },
      { path: '/tasks', element: <TasksListPage /> },
      { path: '/tasks/board', element: <TaskBoardPage /> },
      { path: '/tasks/:taskId', element: <TaskDetailsPage /> },
      { path: '/tasks/new', element: <TaskCreatePage /> },
      { path: '/docs', element: <DocsHomePage /> },
      { path: '/docs/api', element: <APIReferencePage /> },
      { path: '/docs/sdk', element: <SDKGuidesPage /> },
      { path: '/docs/tutorials', element: <TutorialsPage /> },
      {
        path: '/settings',
        element: <SettingsLayout />,
        children: [
          { path: 'account', element: <AccountSettingsPage /> },
          { path: 'system', element: <SystemSettingsPage /> },
          { path: 'ai', element: <AISettingsPage /> },
          { path: 'billing', element: <BillingSettingsPage /> },
          { path: 'usage', element: <UsageSettingsPage /> },
          { path: 'keyboard', element: <KeyboardSettingsPage /> },
          { path: 'features', element: <FeaturesSettingsPage /> },
          { path: 'integrations', element: <IntegrationsSettingsPage /> },
        ],
      },
      { path: '/team', element: <TeamDashboardPage /> },
      { path: '/team/members', element: <TeamMembersPage /> },
      { path: '/team/projects', element: <TeamProjectsPage /> },
      { path: '/team/reports', element: <TeamReportsPage /> },
      { path: '/profile', element: <MemberProfilePage /> },
      { path: '/profile/preferences', element: <MemberPreferencesPage /> },
      { path: '/profile/notifications', element: <MemberNotificationsPage /> },
    ],
  },
]

export const adminRoutes: RouteObject[] = [
  {
    element: <RoleGuard allowedRoles={['admin', 'owner']} redirectTo="/dashboard" />,
    children: [
      { path: '/admin', element: <AdminDashboardPage /> },
      { path: '/admin/users', element: <AdminUserManagementPage /> },
      { path: '/admin/system', element: <AdminSystemHealthPage /> },
      { path: '/admin/audit', element: <AdminAuditLogsPage /> },
    ],
  },
]

export const developerRoutes: RouteObject[] = [
  {
    element: <RoleGuard allowedRoles={['developer', 'admin', 'owner']} redirectTo="/dashboard" />,
    children: [
      { path: '/developer', element: <DeveloperDashboardPage /> },
      { path: '/developer/api-keys', element: <DeveloperAPIKeysPage /> },
      { path: '/developer/webhooks', element: <DeveloperWebhooksPage /> },
      { path: '/developer/sdk', element: <DeveloperSDKPlaygroundPage /> },
    ],
  },
]

export const appRouteConfig = {
  publicRoutes,
  protectedRoutes,
  adminRoutes,
  developerRoutes,
}

export type AppRouteConfig = typeof appRouteConfig
