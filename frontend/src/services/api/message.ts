/**
 * Notification API
 */

import { get, put } from '../request'
import type { Notification, UnreadCount, PaginatedResponse } from '@/types'

/** Get notifications */
export const getNotifications = (
  page: number,
  pageSize: number,
  type?: string
): Promise<PaginatedResponse<Notification> & { unreadCount: UnreadCount }> => {
  return get('/api/notifications', { page, pageSize, type })
}

/** Mark as read */
export const markAsRead = (id: string): Promise<void> => {
  return put(`/api/notifications/${id}/read`)
}

/** Mark all as read */
export const markAllAsRead = (): Promise<void> => {
  return put('/api/notifications/read-all')
}
