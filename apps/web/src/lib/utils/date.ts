import { format, parseISO } from 'date-fns'

export const formatDate = (iso: string, pattern = 'MMM d, yyyy') => format(parseISO(iso), pattern)

export const formatDateRange = (startIso: string, endIso: string) => {
  const start = parseISO(startIso)
  const end = parseISO(endIso)
  return `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`
}

export const isToday = (iso: string) => {
  const date = parseISO(iso)
  const now = new Date()
  return date.toDateString() === now.toDateString()
}

export default {
  formatDate,
  formatDateRange,
  isToday,
}
