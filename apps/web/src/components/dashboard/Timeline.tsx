import {
  differenceInMinutes,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns'
import * as React from 'react'

import type { ActivityTimelineBlock } from '@/types/activity'

import { TimelineBlock } from './TimelineBlock'

export interface TimelineProps {
  blocks: ActivityTimelineBlock[]
  startHour?: number
  endHour?: number
  now?: string
  onBlockClick?: (block: ActivityTimelineBlock) => void
}

const createBaseDate = (isoString?: string) => {
  const reference = isoString ? parseISO(isoString) : new Date()
  return setSeconds(setMinutes(reference, 0), 0)
}

export const Timeline: React.FC<TimelineProps> = ({
  blocks,
  startHour = 6,
  endHour = 22,
  now,
  onBlockClick,
}) => {
  const baseDate = React.useMemo(() => createBaseDate(blocks[0]?.startTime ?? now), [blocks, now])
  const timelineStart = React.useMemo(
    () => setHours(setMinutes(baseDate, 0), startHour),
    [baseDate, startHour]
  )
  const timelineEnd = React.useMemo(
    () => setHours(setMinutes(baseDate, 0), endHour),
    [baseDate, endHour]
  )
  const totalMinutes = Math.max(
    1,
    differenceInMinutes(timelineEnd, timelineStart)
  )

  const hourMarkers = React.useMemo(() => {
    const markers: Date[] = []
    for (let hour = startHour; hour <= endHour; hour += 1) {
      markers.push(setHours(setMinutes(baseDate, 0), hour))
    }
    return markers
  }, [baseDate, startHour, endHour])

  const currentTimePercent = React.useMemo(() => {
    if (!now) return undefined
    const nowDate = parseISO(now)
    const diff = differenceInMinutes(nowDate, timelineStart)
    return Math.min(100, Math.max(0, (diff / totalMinutes) * 100))
  }, [now, timelineStart, totalMinutes])

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Timeline</h3>
          <p className="text-xs text-muted-foreground">
            {startHour}:00 – {endHour}:00
          </p>
        </div>
      </header>
      <div className="relative h-32 overflow-hidden rounded-lg bg-muted/50">
        <div className="absolute inset-0">
          {hourMarkers.map((marker, index) => (
            <div
              key={marker.toISOString()}
              className="absolute top-0 flex h-full w-px -translate-x-1/2 border-l border-border/50"
              style={{
                left: `${(index / (hourMarkers.length - 1 || 1)) * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 flex justify-between px-2 text-[10px] text-muted-foreground">
          {hourMarkers.map((marker) => (
            <span key={marker.toISOString()} className="-translate-x-1/2">
              {marker.getHours().toString().padStart(2, '0')}:00
            </span>
          ))}
        </div>

        <div className="relative mt-5 h-20">
          {blocks.map((block) => {
            const startDiff = differenceInMinutes(
              parseISO(block.startTime),
              timelineStart
            )
            const endDiff = differenceInMinutes(
              parseISO(block.endTime),
              timelineStart
            )
            const offsetPercent = (Math.max(0, startDiff) / totalMinutes) * 100
            const widthPercent =
              ((Math.min(totalMinutes, endDiff) - Math.max(0, startDiff)) /
                totalMinutes) *
              100

            return (
              <TimelineBlock
                key={block.id}
                block={block}
                offsetPercent={offsetPercent}
                widthPercent={widthPercent}
                isCurrent={Boolean(now && startDiff <= 0 && endDiff >= 0)}
                onClick={onBlockClick}
              />
            )
          })}
        </div>

        {currentTimePercent !== undefined ? (
          <div
            className="absolute inset-y-0 w-px bg-primary"
            style={{ left: `${currentTimePercent}%` }}
          />
        ) : null}
      </div>
    </div>
  )
}
