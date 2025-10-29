export const secondsToDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return { hours, minutes, seconds: secs }
}

export const formatDuration = (seconds: number) => {
  const { hours, minutes, seconds: secs } = secondsToDuration(seconds)
  const parts = []
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (secs && !hours) parts.push(`${secs}s`)
  return parts.join(' ') || '0m'
}

export default {
  secondsToDuration,
  formatDuration,
}
