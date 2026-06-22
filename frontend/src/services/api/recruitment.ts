/**
 * Discussion forum API
 */

import { get, post, del } from '../request'
import type { PaginatedResponse, Comment, DiscussionPost, DiscussionFilter } from '@/types'

/** List posts */
export const getDiscussionList = (
  page: number,
  pageSize: number,
  filter?: DiscussionFilter
): Promise<PaginatedResponse<DiscussionPost>> => {
  return get('/api/discussions', {
    page,
    pageSize,
    ...filter,
  })
}

/** Get post detail */
export const getDiscussionDetail = (id: string): Promise<DiscussionPost> => {
  return get(`/api/discussions/${id}`)
}

/** Create post */
export const createDiscussion = (data: {
  title: string
  content: string
  category: string
  images?: string[]
}): Promise<{ id: string; message: string }> => {
  return post('/api/discussions', data)
}

/** Delete post */
export const deleteDiscussion = (id: string): Promise<void> => {
  return del(`/api/discussions/${id}`)
}

/** Toggle like */
export const toggleLikeDiscussion = (id: string): Promise<{ liked: boolean; count: number }> => {
  return post(`/api/discussions/${id}/like`)
}

/** Add comment */
export const addComment = (postId: string, content: string): Promise<Comment> => {
  return post(`/api/discussions/${postId}/comments`, { content })
}

/** My posts */
export const getMyDiscussions = (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<DiscussionPost>> => {
  return get('/api/discussions/mine/list', { page, pageSize })
}
