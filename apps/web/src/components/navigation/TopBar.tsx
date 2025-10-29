import { Link } from 'react-router-dom'

import { useNotificationStore } from '@/stores/notificationStore'

export const TopBar = () => {
  const { notifications } = useNotificationStore()

  return (
    <header className="flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
      <nav className="flex items-center gap-4 text-sm text-muted-foreground">
        <Link to="/dashboard" className="font-medium text-foreground">
          Dashboard
        </Link>
        <Link to="/reports">Reports</Link>
        <Link to="/settings/account">Settings</Link>
      </nav>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <Link to="/notifications">
          Notifications ({notifications.length})
        </Link>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          JD
        </div>
      </div>
    </header>
  )
}

export default TopBar
