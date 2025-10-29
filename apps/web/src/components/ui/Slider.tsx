import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValue?: boolean
  formatValue?: (value: number[]) => string
}

const thumbClassName =
  'block h-4 w-4 rounded-full border border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showValue = false, formatValue, ...props }, ref) => {
  const activeValue = React.useMemo<number[] | undefined>(() => {
    return Array.isArray(props.value)
      ? props.value
      : Array.isArray(props.defaultValue)
        ? props.defaultValue
        : undefined
  }, [props.value, props.defaultValue])

  const isRange = (activeValue?.length ?? 0) > 1

  const formattedValue = React.useMemo(() => {
    if (!showValue) return null
    if (!activeValue) return null
    return formatValue ? formatValue(activeValue) : activeValue.join(' – ')
  }, [showValue, formatValue, activeValue])

  return (
    <div className="flex w-full flex-col gap-2">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={thumbClassName} />
        {isRange ? (
          <SliderPrimitive.Thumb className={thumbClassName} />
        ) : null}
      </SliderPrimitive.Root>
      {showValue && formattedValue && (
        <span className="text-xs text-muted-foreground">{formattedValue}</span>
      )}
    </div>
  )
})

Slider.displayName = 'Slider'
