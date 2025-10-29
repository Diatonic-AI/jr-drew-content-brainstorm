import { BreakSlider } from '@/components/breaks/BreakSlider'
import { BreakTimePanel } from '@/components/breaks/BreakTimePanel'
import { BreakTimer } from '@/components/breaks/BreakTimer'
import { useBreaks } from '@/hooks/useBreaks'

const BreaksPage = () => {
  const { preference, analytics, activeSession, updatePreference } = useBreaks()

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <BreakTimer session={activeSession} remainingSeconds={0} />
        <BreakTimePanel analytics={analytics ?? undefined} preference={preference} />
      </div>
      <div className="space-y-4 rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Break configuration</h3>
        <BreakSlider
          label="Reminder Interval"
          min={15}
          max={120}
          value={preference.reminderIntervalMinutes}
          onChange={(value) => updatePreference({ reminderIntervalMinutes: value })}
        />
        <BreakSlider
          label="Minimum Break"
          min={5}
          max={45}
          value={preference.minimumBreakMinutes}
          onChange={(value) => updatePreference({ minimumBreakMinutes: value })}
        />
      </div>
    </div>
  )
}

export default BreaksPage
