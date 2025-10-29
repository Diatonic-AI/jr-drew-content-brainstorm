import { AmbientSoundSelector } from '@/components/focus/AmbientSoundSelector'
import { FocusControls } from '@/components/focus/FocusControls'
import { FocusTimer } from '@/components/focus/FocusTimer'
import { useFocus } from '@/hooks/useFocus'

const FocusPage = () => {
  const {
    settings,
    ambientSounds,
    activeSession,
    timer,
    addAmbientSound,
    removeAmbientSound,
    setTimerSnapshot,
    isLoading,
  } = useFocus()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-72 animate-pulse rounded-xl border border-border bg-muted/40" />
        <div className="h-24 animate-pulse rounded-xl border border-border bg-muted/40" />
        <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/40" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FocusTimer session={activeSession} snapshot={timer} />
      <FocusControls
        isMuted={!(timer?.soundId)}
        onToggleMute={() => undefined}
        onExtend={() => undefined}
        onSkipBreak={() => undefined}
      />
      <AmbientSoundSelector
        sounds={ambientSounds}
        selectedSoundId={settings.defaultSoundId}
        onSelectSound={(sound) => setTimerSnapshot(timer ? { ...timer, soundId: sound.id } : undefined)}
        onPreviewSound={() => undefined}
      />
    </div>
  )
}

export default FocusPage
