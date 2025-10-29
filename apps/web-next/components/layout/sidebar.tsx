'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, FolderKanban, Goal, Settings, BookOpenText } from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/goals', label: 'Goals', icon: Goal },
  { href: '/vault', label: 'Vault', icon: BookOpenText },
  { href: '/settings', label: 'Settings', icon: Settings }
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="border-r p-4 hidden md:block">
      <div className="text-lg font-semibold mb-4">Diatonic</div>
      <nav className="space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent',
              pathname?.startsWith(href) ? 'bg-accent' : 'bg-transparent'
            )}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
