import { Sparkles, Bell, Command } from 'lucide-react'

import { Badge, Button, Input, ThemeToggle } from '@diatonic/ui'

import { useUIStore } from '../stores/ui'

export function Topbar() {
  const { setQuickActionsOpen } = useUIStore()

  return (
    <header className="relative z-10 flex h-20 items-center border-b border-border/60 bg-background/70 px-6 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative hidden w-full max-w-sm items-center md:flex">
          <Command className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input className="pl-10" placeholder="Search sessions, playbooks, teams" aria-label="Search" />
        </div>
        <Button variant="ghost" className="md:hidden" onClick={() => setQuickActionsOpen(true)}>
          Quick actions
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" onClick={() => setQuickActionsOpen(true)}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <Badge variant="secondary" className="absolute -right-1 -top-1 px-1 text-[10px]">
            new
          </Badge>
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
