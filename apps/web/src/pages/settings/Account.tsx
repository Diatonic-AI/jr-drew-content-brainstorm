import { useAuthStore } from '@/stores/authStore'

const AccountSettingsPage = () => {
  const { user } = useAuthStore()

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
      <h1 className="text-lg font-semibold text-foreground">Account</h1>
      <p className="mt-2">Manage profile details and account preferences.</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Name</dt>
          <dd>{user ? `${user.firstName} ${user.lastName}` : 'Not signed in'}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Email</dt>
          <dd>{user?.email ?? '—'}</dd>
        </div>
      </dl>
    </div>
  )
}

export default AccountSettingsPage
