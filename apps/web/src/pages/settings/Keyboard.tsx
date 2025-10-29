import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

const KeyboardSettingsPage = () => {
  const { shortcuts } = useKeyboardShortcuts()

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h1>
        <p className="text-sm text-muted-foreground">Manage global shortcuts across the app.</p>
      </div>
      <ul className="space-y-2">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2">
            <span>{shortcut.description}</span>
            <span className="text-xs font-semibold text-foreground">
              {shortcut.bindings.join(', ')}
            </span>
          </li>
        ))}
        {!shortcuts.length ? (
          <li className="rounded-lg border border-dashed border-border p-4 text-center">
            No shortcuts configured yet.
          </li>
        ) : null}
      </ul>
    </div>
  )
}

export default KeyboardSettingsPage
