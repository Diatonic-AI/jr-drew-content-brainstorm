import { Badge, Button, Card, CardContent, CardHeader, CardTitle, cn } from '@diatonic/ui'
import {
  LayoutDashboard,
  PlugZap,
  Timer,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  FolderKanban,
  CheckSquare,
  Users,
  BookOpen,
  Settings,
  Code,
  ShieldAlert,
  BarChart3,
  Coffee,
  Zap,
  Calendar,
  TrendingUp,
  FileText
} from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { useUIStore } from '../stores/ui'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types/user'

interface NavItem {
  label: string
  to: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  badge?: string
  roles?: UserRole[]
}

interface NavSection {
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  items: NavItem[]
  defaultOpen?: boolean
  roles?: UserRole[]
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { userProfile } = useAuth()
  const location = useLocation()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    dashboard: true,
    timeTracking: true,
    productivity: true,
    projects: true,
    tasks: true
  })

  const userRole = userProfile?.role || 'member'

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
  }

  const hasRole = (allowedRoles?: UserRole[]) => {
    if (!allowedRoles || allowedRoles.length === 0) return true
    return allowedRoles.includes(userRole)
  }

  const navSections = useMemo<NavSection[]>(
    () => [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        defaultOpen: true,
        items: [
          { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
          { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
          { label: 'Timeline', to: '/dashboard/timeline', icon: Clock },
          { label: 'Reports', to: '/dashboard/reports', icon: FileText }
        ]
      },
      {
        label: 'Time Tracking',
        icon: Timer,
        defaultOpen: true,
        items: [
          { label: 'Active Session', to: '/sessions', icon: Timer, badge: 'live' },
          { label: 'History', to: '/sessions/history', icon: Clock },
          { label: 'Reports', to: '/sessions/reports', icon: FileText }
        ]
      },
      {
        label: 'Productivity',
        icon: Target,
        items: [
          { label: 'Focus Sessions', to: '/productivity/focus', icon: Zap },
          { label: 'Breaks', to: '/productivity/breaks', icon: Coffee },
          { label: 'Goals', to: '/productivity/goals', icon: Target }
        ]
      },
      {
        label: 'Projects',
        icon: FolderKanban,
        items: [
          { label: 'All Projects', to: '/projects', icon: FolderKanban },
          { label: 'Create Project', to: '/projects/new', icon: FolderKanban }
        ]
      },
      {
        label: 'Tasks',
        icon: CheckSquare,
        items: [
          { label: 'Task Board', to: '/tasks/board', icon: CheckSquare },
          { label: 'My Tasks', to: '/tasks', icon: CheckSquare },
          { label: 'Create Task', to: '/tasks/new', icon: CheckSquare }
        ]
      },
      {
        label: 'Team',
        icon: Users,
        items: [
          { label: 'Team Dashboard', to: '/team', icon: Users },
          { label: 'Members', to: '/team/members', icon: Users },
          { label: 'Team Projects', to: '/team/projects', icon: FolderKanban },
          { label: 'Team Reports', to: '/team/reports', icon: FileText }
        ]
      },
      {
        label: 'Documentation',
        icon: BookOpen,
        items: [
          { label: 'Home', to: '/docs', icon: BookOpen },
          { label: 'API Reference', to: '/docs/api', icon: Code },
          { label: 'SDK Guides', to: '/docs/sdk', icon: BookOpen },
          { label: 'Tutorials', to: '/docs/tutorials', icon: BookOpen }
        ]
      },
      {
        label: 'Settings',
        icon: Settings,
        items: [
          { label: 'Account', to: '/settings/account', icon: Settings },
          { label: 'Security', to: '/settings/security', icon: ShieldAlert },
          { label: 'Integrations', to: '/settings/integrations', icon: PlugZap },
          { label: 'AI Settings', to: '/settings/ai', icon: Zap },
          { label: 'Billing', to: '/settings/billing', icon: TrendingUp },
          { label: 'Usage', to: '/settings/usage', icon: BarChart3 },
          { label: 'Keyboard', to: '/settings/keyboard', icon: Settings },
          { label: 'Features', to: '/settings/features', icon: Settings },
          { label: 'System', to: '/settings/system', icon: Settings }
        ]
      },
      {
        label: 'Developer',
        icon: Code,
        roles: ['developer', 'admin', 'owner'],
        items: [
          { label: 'Dashboard', to: '/developer', icon: Code },
          { label: 'API Keys', to: '/developer/api-keys', icon: Code },
          { label: 'Webhooks', to: '/developer/webhooks', icon: Code },
          { label: 'SDK Playground', to: '/developer/sdk', icon: Code }
        ]
      },
      {
        label: 'Admin',
        icon: ShieldAlert,
        roles: ['admin', 'owner'],
        items: [
          { label: 'Dashboard', to: '/admin', icon: ShieldAlert },
          { label: 'User Management', to: '/admin/users', icon: Users },
          { label: 'System Health', to: '/admin/system', icon: BarChart3 },
          { label: 'Audit Logs', to: '/admin/audit', icon: FileText }
        ]
      }
    ],
    []
  )

  return (
    <aside
      className={cn(
        'glass relative z-20 flex h-screen shrink-0 flex-col border-r border-border/60 bg-background/60 backdrop-blur-xl transition-all duration-200',
        sidebarCollapsed ? 'w-20' : 'w-72'
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className={cn('flex items-center gap-2', sidebarCollapsed && 'justify-center')}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary">
            DA
          </span>
          {!sidebarCollapsed && (
            <div>
              <p className="text-sm font-semibold">Diatonic.ai</p>
              <p className="text-xs text-muted-foreground">Session intelligence</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ring-focus"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navSections
          .filter(section => hasRole(section.roles))
          .map((section, idx) => {
            const sectionKey = section.label.toLowerCase().replace(/\s+/g, '')
            const isOpen = openSections[sectionKey] ?? section.defaultOpen ?? false
            const isAnyChildActive = section.items.some(item => 
              location.pathname === item.to || location.pathname.startsWith(item.to + '/')
            )

            if (sidebarCollapsed) {
              // Collapsed view - show only icons
              return (
                <div key={idx} className="space-y-1">
                  {section.items
                    .filter(item => hasRole(item.roles))
                    .map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/dashboard'}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center justify-center rounded-xl px-2 py-2.5 text-sm font-medium transition-all hover:bg-accent/60 hover:text-accent-foreground',
                            isActive && 'bg-primary/10 text-primary'
                          )
                        }
                        title={item.label}
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                      </NavLink>
                    ))}
                </div>
              )
            }

            return (
              <div key={idx} className="space-y-1">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent/40',
                    isAnyChildActive && 'text-primary'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    <span>{section.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {/* Section Items */}
                {isOpen && (
                  <div className="ml-2 space-y-0.5 border-l border-border/50 pl-2">
                    {section.items
                      .filter(item => hasRole(item.roles))
                      .map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.to === '/dashboard'}
                          className={({ isActive }) =>
                            cn(
                              'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/60 hover:text-accent-foreground',
                              isActive && 'bg-primary/10 text-primary'
                            )
                          }
                        >
                          <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="flex items-center gap-2">
                            {item.label}
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs uppercase">
                                {item.badge}
                              </Badge>
                            )}
                          </span>
                        </NavLink>
                      ))}
                  </div>
                )}
              </div>
            )
          })}
      </nav>

      <div className="px-3 pb-6">
        <Card className={cn('bg-gradient-to-br from-violet-500/20 via-primary/10 to-cyan-500/20 text-sm', sidebarCollapsed && 'items-center text-center')}>
          <CardHeader>
            <CardTitle className="text-base">Workflow latency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-muted-foreground">
              Track meetings in real time and push automations into your CRM.
            </p>
            <Button variant="secondary" className="w-full">
              Upgrade workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
