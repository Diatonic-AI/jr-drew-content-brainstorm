import { useSettingsStore } from '@/stores/settingsStore'

const AISettingsPage = () => {
  const { settings, updateSettings } = useSettingsStore()
  const { ai } = settings

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
      <div>
        <h1 className="text-lg font-semibold text-foreground">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Configure the realtime AI coach, preferred voice, and proactive nudges.
        </p>
      </div>
      <label className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm">
        Realtime voice
        <input
          type="checkbox"
          checked={ai.enableRealtimeVoice}
          onChange={(event) =>
            updateSettings({ ai: { ...ai, enableRealtimeVoice: event.target.checked } })
          }
        />
      </label>
    </div>
  )
}

export default AISettingsPage
