import { Slider } from '@/components/ui/Slider'

export interface BreakSliderProps {
  label: string
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
}

export const BreakSlider = ({
  label,
  min,
  max,
  step = 5,
  value,
  onChange,
}: BreakSliderProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{value} min</span>
    </div>
    <Slider
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={(vals) => onChange(vals[0])}
    />
  </div>
)

