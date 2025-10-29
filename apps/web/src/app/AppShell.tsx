import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="relative flex flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.15),transparent_55%)]" aria-hidden />
        <Topbar />
        <main className="relative z-10 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-12 pt-8">
            <Outlet />
          </div>
        </main>
        <Toaster position="bottom-right" theme="system" richColors />
      </div>
    </div>
  )
}
