import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/settings/account', label: 'Account' },
  { to: '/settings/system', label: 'System' },
  { to: '/settings/ai', label: 'AI Assistant' },
  { to: '/settings/billing', label: 'Billing' },
  { to: '/settings/usage', label: 'Usage' },
  { to: '/settings/keyboard', label: 'Keyboard' },
  { to: '/settings/features', label: 'Features' },
  { to: '/settings/integrations', label: 'Integrations' },
]

const SettingsLayout = () => (
  <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
    <nav className="rounded-xl border border-border bg-card p-4 text-sm">
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 transition hover:bg-muted ${isActive ? 'bg-muted font-semibold text-foreground' : 'text-muted-foreground'}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
    <section className="space-y-4">
      <Outlet />
    </section>
  </div>
)

export default SettingsLayout
