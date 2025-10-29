import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/productivity/focus', label: 'Focus', icon: '🎯' },
  { to: '/productivity/breaks', label: 'Breaks', icon: '☕' },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/settings/account', label: 'Settings', icon: '⚙️' },
]

export const Sidebar = () => (
  <aside className="hidden h-full w-56 flex-col border-r border-border bg-card p-4 text-sm md:flex">
    <div className="mb-6 text-lg font-semibold text-foreground">Rize</div>
    <nav className="flex-1 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2 transition hover:bg-muted ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground'}`
          }
        >
          <span>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
)

export default Sidebar
