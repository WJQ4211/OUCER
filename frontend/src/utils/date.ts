/**
 * 日期工具函数
 * 基于 date-fns 封装
 */

import { format, formatDistanceToNow, isAfter, isBefore, parseISO, differenceInDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/** 日期格式常量 */
export const DATE_FORMAT = {
  full: 'yyyy-MM-dd HH:mm:ss',
  date: 'yyyy-MM-dd',
  time: 'HH:mm',
  monthDay: 'MM-dd',
  monthDayTime: 'MM-dd HH:mm',
  yearMonth: 'yyyy-MM',
  chineseDate: 'yyyy年MM月dd日',
  chineseDateTime: 'yyyy年MM月dd日 HH:mm',
} as const

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date, fmt: string = DATE_FORMAT.date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt, { locale: zhCN })
}

/**
 * 相对时间（如 "3分钟前"、"2天前"）
 */
export const timeAgo = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: zhCN })
}

/**
 * 是否已过期
 */
export const isExpired = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isBefore(d, new Date())
}

/**
 * 是否即将开始
 */
export const isUpcoming = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isAfter(d, new Date())
}

/**
 * 距离截止日期还剩多少天
 */
export const daysUntil = (date: string | Date): number => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return differenceInDays(d, new Date())
}

/**
 * 格式化截止日期显示
 */
export const formatDeadline = (deadline: string): { text: string; isUrgent: boolean } => {
  const days = daysUntil(deadline)
  if (days < 0) {
    return { text: '已截止', isUrgent: false }
  }
  if (days === 0) {
    return { text: '今天截止', isUrgent: true }
  }
  if (days <= 3) {
    return { text: `${days}天后截止`, isUrgent: true }
  }
  return { text: formatDate(deadline, DATE_FORMAT.monthDay), isUrgent: false }
}

/**
 * 格式化活动时间范围
 */
export const formatActivityTime = (startTime: string, endTime: string): string => {
  const start = formatDate(startTime, DATE_FORMAT.monthDayTime)
  const end = formatDate(endTime, DATE_FORMAT.monthDayTime)
  // 同一天只显示一个日期
  const startDate = formatDate(startTime, DATE_FORMAT.date)
  const endDate = formatDate(endTime, DATE_FORMAT.date)
  if (startDate === endDate) {
    return `${formatDate(startTime, DATE_FORMAT.chineseDate)} ${formatDate(startTime, DATE_FORMAT.time)} - ${formatDate(endTime, DATE_FORMAT.time)}`
  }
  return `${start} - ${end}`
}

/**
 * 获取日期分组标签（今天、昨天、更早）
 */
export const getDateGroup = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  const days = differenceInDays(now, d)
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return formatDate(d, DATE_FORMAT.date)
}
