import type { ComponentType, SVGProps } from 'react'
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlugZap, Timer, ChevronLeft, ChevronRight } from 'lucide-react'

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, cn } from '@diatonic/ui'

import { useUIStore } from '../stores/ui'

interface NavItem {
  label: string
  to: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  badge?: string
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard },
      { label: 'Sessions', to: '/sessions', icon: Timer, badge: 'live' },
      { label: 'Connections', to: '/settings/connections', icon: PlugZap }
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

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, to, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent/60 hover:text-accent-foreground',
                isActive && 'bg-primary/10 text-primary',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {!sidebarCollapsed && (
              <span className="flex items-center gap-2">
                {label}
                {badge ? <Badge variant="secondary" className="uppercase">{badge}</Badge> : null}
              </span>
            )}
          </NavLink>
        ))}
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
