import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  label?: string
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const variantClasses: Record<
  NonNullable<ProgressProps['variant']>,
  string
> = {
  default: 'bg-primary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-400',
  danger: 'bg-destructive',
}

const variantStrokeClasses: Record<
  NonNullable<ProgressProps['variant']>,
  string
> = {
  default: 'text-primary',
  success: 'text-emerald-500',
  warning: 'text-amber-400',
  danger: 'text-destructive',
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, label, showLabel = false, variant = 'default', ...props }, ref) => {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="flex w-full items-center gap-2">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-muted',
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 transition-all',
            variantClasses[variant]
          )}
          style={{ transform: `translateX(-${100 - clamped}%)` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {label ?? `${clamped}%`}
        </span>
      )}
    </div>
  )
})

Progress.displayName = 'Progress'

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  size?: number
  strokeWidth?: number
  variant?: NonNullable<ProgressProps['variant']>
  showLabel?: boolean
}

export const CircularProgress = ({
  value = 0,
  size = 120,
  strokeWidth = 10,
  variant = 'default',
  showLabel = true,
  className,
  ...props
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          className="stroke-current text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn(
            'transition-all duration-300 ease-out',
            variantStrokeClasses[variant]
          )}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showLabel ? (
        <span className="absolute text-sm font-semibold tabular-nums text-foreground">
          {Math.round(clamped)}%
        </span>
      ) : null}
    </div>
  )
}
