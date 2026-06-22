/**
 * 用户相关类型
 */
export interface User {
  id: string
  openId: string
  nickname: string
  avatar: string
  phone?: string
  email?: string
  wechat?: string
  city: string
  department?: string
  graduationYear?: number
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends Omit<User, 'id' | 'openId'> {
  id: string
}

/**
 * 内推相关类型
 */
export type Industry =
  | 'tech'
  | 'finance'
  | 'ecom'
  | 'estate'
  | 'other'

export type WorkYear = 'fresh' | '1-3' | '3-5' | '5+'

export type Degree = 'bachelor' | 'master' | 'phd' | 'unlimited'

export interface Recruitment {
  id: string
  company: string
  position: string
  industry: Industry
  city: string
  workYears: WorkYear
  minSalary: number
  maxSalary: number
  degree: Degree
  deadline: Date
  description: string
  referrerId: string
  referrer?: User
  views: number
  applications: number
  likes: number
  createdAt: Date
  updatedAt: Date
}

export type ApplicationStatus =
  | 'pending'
  | 'applied'
  | 'interviewed'
  | 'offered'
  | 'rejected'

export interface Application {
  id: string
  recruitmentId: string
  userId: string
  status: ApplicationStatus
  appliedAt: Date
  updatedAt: Date
}

/**
 * 城市据点相关类型
 */
export interface Location {
  id: string
  city: string
  name: string
  description: string
  memberCount: number
  createdAt: Date
  updatedAt: Date
}

export type ActivityCategory =
  | 'sport'
  | 'meal'
  | 'study'
  | 'dating'
  | 'travel'
  | 'other'

export interface Activity {
  id: string
  locationId: string
  title: string
  description: string
  category: ActivityCategory
  startTime: Date
  endTime: Date
  location: string
  capacity: number
  participantCount: number
  organizerId: string
  organizer?: User
  groupQrcode?: string
  createdAt: Date
  updatedAt: Date
}

export interface ActivityParticipant {
  id: string
  activityId: string
  userId: string
  status: 'joined' | 'cancelled'
  joinedAt: Date
  cancelledAt?: Date
}

/**
 * 评论/讨论相关类型
 */
export interface Comment {
  id: string
  targetType: 'recruitment' | 'activity' | 'discussion'
  targetId: string
  authorId: string
  author?: User
  content: string
  likes: number
  parentId?: string
  replies?: Comment[]
  createdAt: Date
  updatedAt: Date
}

/**
 * 通知相关类型
 */
export type NotificationType =
  | 'like'
  | 'comment'
  | 'application'
  | 'activity'
  | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  actorId: string
  actor?: User
  content: string
  targetType?: 'recruitment' | 'activity' | 'discussion'
  targetId?: string
  read: boolean
  createdAt: Date
  readAt?: Date
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * API 响应类型
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
  timestamp: Date
}

export interface ApiErrorResponse {
  code: string | number
  message: string
  details?: any
  timestamp: Date
}
