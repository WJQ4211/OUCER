/**
 * Discussion Forum types
 * Replaces the recruitment/job system with a community discussion platform
 */

import type { UserBrief, Comment } from './common'

/** Discussion category */
export type DiscussionCategory =
  | 'company'       // 聊聊公司
  | 'career'        // 学长去向
  | 'study'         // 深造/考研
  | 'life'          // 校园生活
  | 'other'         // 其他

/** Category display info */
export const CATEGORY_MAP: Record<DiscussionCategory, { label: string; icon: string }> = {
  company:  { label: '聊聊公司', icon: '🏢' },
  career:   { label: '学长去向', icon: '🎓' },
  study:    { label: '深造/考研', icon: '📚' },
  life:     { label: '校园生活', icon: '🏫' },
  other:    { label: '其他', icon: '💬' },
}

/** Discussion post */
export interface DiscussionPost {
  id: string
  title: string
  content: string
  category: DiscussionCategory
  author: UserBrief
  images?: string[]
  likes: number
  isLiked: boolean
  commentCount: number
  views: number
  isPinned: boolean
  isHot: boolean      // hot posts get special treatment
  createdAt: string
  updatedAt: string
}

/** Post list filter */
export interface DiscussionFilter {
  category?: DiscussionCategory
  sort?: 'latest' | 'hot' | 'most_comments'
  keyword?: string
}

/** Create post form */
export interface CreatePostForm {
  title: string
  content: string
  category: DiscussionCategory
  images?: string[]
}

/** Post card props */
export interface PostCardProps {
  post: DiscussionPost
  onClick?: (id: string) => void
  onLike?: (id: string) => void
}
