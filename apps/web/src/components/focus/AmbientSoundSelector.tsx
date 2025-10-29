import type { AmbientSound } from '@/types/focus'

import { SoundCard } from './SoundCard'

export interface AmbientSoundSelectorProps {
  sounds: AmbientSound[]
  selectedSoundId?: string
  onSelectSound?: (sound: AmbientSound) => void
  onPreviewSound?: (sound: AmbientSound) => void
}

export const AmbientSoundSelector = ({
  sounds,
  selectedSoundId,
  onSelectSound,
  onPreviewSound,
}: AmbientSoundSelectorProps) => (
  <div className="space-y-4">
    <header className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Ambient Sounds</h3>
        <p className="text-xs text-muted-foreground">
          Choose a background sound to boost focus. Preview before starting.
        </p>
      </div>
    </header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {sounds.map((sound) => (
        <SoundCard
          key={sound.id}
          sound={sound}
          isSelected={sound.id === selectedSoundId}
          onSelect={onSelectSound}
          onPreview={onPreviewSound}
        />
      ))}
      {!sounds.length ? (
        <div className="col-span-full rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No ambient sounds yet. Add sounds in settings.
        </div>
      ) : null}
    </div>
  </div>
)

