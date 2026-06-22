/**
 * Date utility functions (date-fns based)
 */

import { format, formatDistanceToNow, isAfter, isBefore, parseISO, differenceInDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export const DATE_FORMAT = {
  full: 'yyyy-MM-dd HH:mm:ss', date: 'yyyy-MM-dd', time: 'HH:mm',
  monthDay: 'MM-dd', monthDayTime: 'MM-dd HH:mm', yearMonth: 'yyyy-MM',
  chineseDate: 'yyyy年MM月dd日', chineseDateTime: 'yyyy年MM月dd日 HH:mm',
} as const

/** Safe parse - returns null if invalid */
const safeParse = (date: string | Date): Date | null => {
  if (!date) return null
  if (date instanceof Date) return isNaN(date.getTime()) ? null : date
  try {
    const d = new Date(date as string)
    if (!isNaN(d.getTime())) return d
    const p = parseISO(date as string)
    return isNaN(p.getTime()) ? null : p
  } catch { return null }
}

export const formatDate = (date: string | Date, fmt: string = DATE_FORMAT.date): string => {
  const d = safeParse(date)
  if (!d) return '--'
  return format(d, fmt, { locale: zhCN })
}

export const timeAgo = (date: string | Date): string => {
  const d = safeParse(date)
  if (!d) return '--'
  try { return formatDistanceToNow(d, { addSuffix: true, locale: zhCN }) }
  catch { return '--' }
}

export const isExpired = (date: string | Date): boolean => {
  const d = safeParse(date)
  if (!d) return true
  return isBefore(d, new Date())
}

export const isUpcoming = (date: string | Date): boolean => {
  const d = safeParse(date)
  if (!d) return false
  return isAfter(d, new Date())
}

export const daysUntil = (date: string | Date): number => {
  const d = safeParse(date)
  if (!d) return -1
  return differenceInDays(d, new Date())
}

export const formatDeadline = (deadline: string): { text: string; isUrgent: boolean } => {
  const days = daysUntil(deadline)
  if (days < 0) return { text: '已截止', isUrgent: false }
  if (days === 0) return { text: '今天截止', isUrgent: true }
  if (days <= 3) return { text: `${days}天后截止`, isUrgent: true }
  return { text: formatDate(deadline, DATE_FORMAT.monthDay), isUrgent: false }
}

export const formatActivityTime = (startTime: string, endTime: string): string => {
  const start = formatDate(startTime, DATE_FORMAT.monthDayTime)
  const end = formatDate(endTime, DATE_FORMAT.monthDayTime)
  const startDate = formatDate(startTime, DATE_FORMAT.date)
  const endDate = formatDate(endTime, DATE_FORMAT.date)
  if (startDate === endDate) {
    return `${formatDate(startTime, DATE_FORMAT.chineseDate)} ${formatDate(startTime, DATE_FORMAT.time)} - ${formatDate(endTime, DATE_FORMAT.time)}`
  }
  return `${start} - ${end}`
}

export const getDateGroup = (date: string | Date): string => {
  const d = safeParse(date)
  if (!d) return '更早'
  const now = new Date()
  const days = differenceInDays(now, d)
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return formatDate(d, DATE_FORMAT.date)
}
