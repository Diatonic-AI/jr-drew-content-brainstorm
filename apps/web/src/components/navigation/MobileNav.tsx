import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/productivity/focus', label: 'Focus' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
]

export const MobileNav = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
        onClick={() => setOpen((value) => !value)}
      >
        <Menu className="h-5 w-5" />
      </button>
      {open ? (
        <nav className="mt-3 space-y-2 rounded-lg border border-border bg-card p-3 text-sm">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block rounded-md px-3 py-2 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  )
}

export default MobileNav
