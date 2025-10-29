import { useSettingsStore } from '@/stores/settingsStore'

const SystemSettingsPage = () => {
  const { settings, updateSettings } = useSettingsStore()

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
      <div>
        <h1 className="text-lg font-semibold text-foreground">System</h1>
        <p className="text-sm text-muted-foreground">
          Configure work hours, themes, and core system preferences.
        </p>
      </div>
      <div>
        <label className="flex items-center gap-3 text-sm text-foreground">
          Theme
          <select
            value={settings.theme}
            onChange={(event) => updateSettings({ theme: event.target.value as typeof settings.theme })}
            className="h-9 rounded-md border border-border bg-background px-3"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
    </div>
  )
}

export default SystemSettingsPage
