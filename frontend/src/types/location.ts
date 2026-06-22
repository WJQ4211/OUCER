/**
 * 校友据点 - 类型定义
 */

import type { ActivityStatus, Comment, ImageAsset } from './common'

/** 校友据点 */
export interface Location {
  id: string
  city: string
  name: string // 如 "北京校友据点"
  description: string
  coverImage?: string
  memberCount: number
  categories: LocationCategory[]
  hotTopics: Discussion[]
  createdAt: string
}

/** 据点分类（讨论区） */
export interface LocationCategory {
  id: string
  locationId: string
  name: string // 如 "运动圈"、"美食交流"
  icon: string
  discussions: Discussion[]
}

/** 讨论话题 */
export interface Discussion {
  id: string
  categoryId: string
  author: {
    id: string
    nickname: string
    avatar: string
  }
  title: string
  content: string
  images?: ImageAsset[]
  likes: number
  isLiked: boolean
  replyCount: number
  lastReplyAt?: string
  createdAt: string
}

/** 校友活动 */
export interface Activity {
  id: string
  locationId: string
  title: string
  description: string
  category: string // 活动分类：运动、聚餐、学习等
  coverImage?: string
  startTime: string // ISO 8601
  endTime: string // ISO 8601
  address: string
  capacity: number
  participantCount: number
  participants: ActivityParticipant[]
  organizer: {
    id: string
    nickname: string
    avatar: string
  }
  groupQrcode?: string // 微信群二维码 URL
  status: ActivityStatus
  comments: Comment[]
  createdAt: string
}

/** 活动参与者 */
export interface ActivityParticipant {
  id: string
  userId: string
  nickname: string
  avatar: string
  joinedAt: string
  status: 'joined' | 'cancelled'
}

/** 发布活动表单 */
export interface ActivityForm {
  title: string
  description: string
  category: string
  coverImage?: string
  startTime: string
  endTime: string
  address: string
  capacity: number
  groupQrcode?: string
}

/** 活动卡片 props */
export interface ActivityCardProps {
  activity: Activity
  onClick?: (id: string) => void
  onJoin?: (id: string) => void
}
