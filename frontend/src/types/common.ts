/**
 * Common type definitions
 */

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

export type ActivityStatus = 'upcoming' | 'ongoing' | 'ended' | 'cancelled'

export type NotificationType = 'like' | 'comment' | 'reply' | 'activity' | 'system' | 'verify'

export interface SelectOption<T = string> {
  label: string
  value: T
}

export interface ImageAsset {
  id: string
  url: string
  thumbUrl?: string
}

export interface Address {
  province: string
  city: string
  district?: string
  detail: string
}

/** Post/comment author brief */
export interface AuthorBrief {
  id: string
  nickname: string
  avatar: string
  identityDisplay: string    // formatted: "2020级-计算机学院-张三 男"
  ipProvince?: string        // e.g. "山东"
  isVerified: boolean
}

/** Comment */
export interface Comment {
  id: string
  author: AuthorBrief
  content: string
  likes: number
  isLiked: boolean
  replies: Comment[]
  createdAt: string
}

export interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionText?: string
  onAction?: () => void
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'
