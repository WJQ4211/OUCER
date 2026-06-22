/**
 * 求职圈 - 类型定义
 */

import type { Industry, WorkYears, Degree, ApplicationStatus, Comment, ImageAsset } from './common'

/** 招聘信息 */
export interface Recruitment {
  id: string
  company: string
  position: string
  industry: Industry
  city: string
  workYears: WorkYears
  minSalary: number // 单位：千元
  maxSalary: number // 单位：千元
  degree: Degree
  deadline: string // ISO 8601
  description: string
  requirements?: string
  benefits?: string
  contactInfo?: string
  referrer: Referrer
  views: number
  applications: number
  likes: number
  isLiked: boolean
  comments: Comment[]
  images?: ImageAsset[]
  createdAt: string
  updatedAt: string
}

/** 推荐人信息 */
export interface Referrer {
  id: string
  nickname: string
  avatar: string
  company: string
  position: string
  wechat?: string
}

/** 投递记录 */
export interface Application {
  id: string
  recruitmentId: string
  recruitment: Pick<Recruitment, 'id' | 'company' | 'position'>
  userId: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  note?: string
}

/** 招聘列表筛选条件 */
export interface RecruitmentFilter {
  keyword?: string
  industry?: Industry
  city?: string
  workYears?: WorkYears
  degree?: Degree
  salaryRange?: [number, number]
}

/** 招聘列表排序 */
export type RecruitmentSortBy = 'latest' | 'popular' | 'deadline'

/** 发布/编辑招聘表单 */
export interface RecruitmentForm {
  company: string
  position: string
  industry: Industry
  city: string
  workYears: WorkYears
  minSalary: number
  maxSalary: number
  degree: Degree
  deadline: string
  description: string
  requirements?: string
  benefits?: string
  contactInfo?: string
  images?: string[]
}

/** 招聘卡片 props */
export interface RecruitmentCardProps {
  recruitment: Recruitment
  onClick?: (id: string) => void
  onLike?: (id: string) => void
  onShare?: (id: string) => void
}
