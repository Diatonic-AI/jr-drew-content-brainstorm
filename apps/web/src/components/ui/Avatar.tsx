import * as React from 'react'

import { cn } from '@/lib/utils'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy'

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const statusClasses: Record<AvatarStatus, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-muted-foreground',
  away: 'bg-amber-400',
  busy: 'bg-destructive',
}

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  src?: string
  alt?: string
  fallback?: string
  size?: AvatarSize
  status?: AvatarStatus
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', status, ...props }, ref) => {
    const [isError, setIsError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted text-foreground/80',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !isError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setIsError(true)}
          />
        ) : (
          <span className="uppercase">
            {fallback ?? (alt ? alt.slice(0, 2) : '?')}
          </span>
        )}

        {status ? (
          <span
            className={cn(
              'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background',
              statusClasses[status]
            )}
          />
        ) : null}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

