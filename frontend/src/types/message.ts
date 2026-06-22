/**
 * 消息/通知类型定义
 */

import type { NotificationType } from './common'

/** 通知 */
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  actor: {
    id: string
    nickname: string
    avatar: string
  }
  content: string
  target: {
    type: 'recruitment' | 'activity' | 'discussion' | 'profile'
    id: string
  }
  read: boolean
  createdAt: string
}

/** 通知列表分组 */
export interface NotificationGroup {
  date: string
  notifications: Notification[]
}

/** 消息 Tab 项 */
export interface MessageTab {
  key: string
  label: string
  count?: number
}

/** 未读消息统计 */
export interface UnreadCount {
  total: number
  likes: number
  comments: number
  applications: number
  activities: number
  system: number
}
