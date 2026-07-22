import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '-'
  return format(parseISO(date), 'yyyy-MM-dd')
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '-'
  return format(parseISO(date), 'yyyy-MM-dd HH:mm')
}

export function formatRelativeDate(date: string | null | undefined): string {
  if (!date) return '-'
  const d = parseISO(date)
  if (isToday(d)) return '今天'
  if (isTomorrow(d)) return '明天'
  if (isYesterday(d)) return '昨天'
  return format(d, 'MM-dd')
}

export function formatTimeAgo(date: string | null | undefined): string {
  if (!date) return '-'
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: zhCN })
}

export function formatShortDate(date: string | null | undefined): string {
  if (!date) return '-'
  return format(parseISO(date), 'MM/dd')
}
