import { Badge } from '@/components/ui/Badge'
import type { AmbientSound } from '@/types/focus'


export interface SoundCardProps {
  sound: AmbientSound
  isSelected?: boolean
  onSelect?: (sound: AmbientSound) => void
  onPreview?: (sound: AmbientSound) => void
}

export const SoundCard = ({
  sound,
  isSelected = false,
  onSelect,
  onPreview,
}: SoundCardProps) => (
  <button
    type="button"
    onClick={() => onSelect?.(sound)}
    className={`flex h-full flex-col justify-between rounded-lg border p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? 'border-primary shadow-md' : 'border-border'}`}
  >
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{sound.name}</h4>
        <Badge variant="outline" className="capitalize">
          {sound.category}
        </Badge>
      </div>
      {sound.description ? (
        <p className="text-xs text-muted-foreground">{sound.description}</p>
      ) : null}
    </div>
    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
      <span>{(sound.durationSeconds ?? 0) > 0 ? `${Math.round((sound.durationSeconds ?? 0) / 60)} min loop` : 'Loop'}</span>
      <button
        type="button"
        className="text-primary underline-offset-2 hover:underline"
        onClick={(event) => {
          event.stopPropagation()
          onPreview?.(sound)
        }}
      >
        Preview
      </button>
    </div>
  </button>
)

