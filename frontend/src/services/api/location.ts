/**
 * 校友据点 API 服务
 */

import { get, post, put, del } from '../request'
import type {
  Location,
  Activity,
  ActivityForm,
  Discussion,
  PaginatedResponse,
  Comment,
} from '@/types'

/** 获取据点列表 */
export const getLocationList = (): Promise<Location[]> => {
  return get('/api/locations')
}

/** 获取据点详情 */
export const getLocationDetail = (id: string): Promise<Location> => {
  return get(`/api/locations/${id}`)
}

/** 加入据点 */
export const joinLocation = (id: string): Promise<void> => {
  return post(`/api/locations/${id}/join`)
}

/** 退出据点 */
export const leaveLocation = (id: string): Promise<void> => {
  return del(`/api/locations/${id}/join`)
}

/** 获取据点成员 */
export const getLocationMembers = (
  id: string,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<{ id: string; nickname: string; avatar: string }>> => {
  return get(`/api/locations/${id}/members`, { page, pageSize })
}

/** 获取讨论列表 */
export const getDiscussions = (
  locationId: string,
  categoryId: string,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Discussion>> => {
  return get(`/api/locations/${locationId}/categories/${categoryId}/discussions`, {
    page,
    pageSize,
  })
}

/** 发布讨论 */
export const createDiscussion = (
  locationId: string,
  categoryId: string,
  data: { title: string; content: string; images?: string[] }
): Promise<Discussion> => {
  return post(`/api/locations/${locationId}/categories/${categoryId}/discussions`, data)
}

/** 获取活动列表 */
export const getActivityList = (
  locationId?: string,
  page?: number,
  pageSize?: number
): Promise<PaginatedResponse<Activity>> => {
  return get('/api/activities', {
    locationId,
    page: page || 1,
    pageSize: pageSize || 10,
  })
}

/** 获取活动详情 */
export const getActivityDetail = (id: string): Promise<Activity> => {
  return get(`/api/activities/${id}`)
}

/** 发布活动 */
export const publishActivity = (data: ActivityForm): Promise<Activity> => {
  return post('/api/activities', data)
}

/** 编辑活动 */
export const updateActivity = (
  id: string,
  data: Partial<ActivityForm>
): Promise<Activity> => {
  return put(`/api/activities/${id}`, data)
}

/** 取消活动 */
export const cancelActivity = (id: string): Promise<void> => {
  return del(`/api/activities/${id}`)
}

/** 报名活动 */
export const joinActivity = (id: string): Promise<void> => {
  return post(`/api/activities/${id}/join`)
}

/** 取消报名 */
export const leaveActivity = (id: string): Promise<void> => {
  return del(`/api/activities/${id}/join`)
}

/** 获取活动参与者 */
export const getActivityParticipants = (
  id: string,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<{
  id: string
  nickname: string
  avatar: string
  joinedAt: string
}>> => {
  return get(`/api/activities/${id}/participants`, { page, pageSize })
}

/** 发布活动评论 */
export const addActivityComment = (activityId: string, content: string): Promise<Comment> => {
  return post(`/api/activities/${activityId}/comments`, { content })
}

/** 获取活动评论 */
export const getActivityComments = (
  id: string,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Comment>> => {
  return get(`/api/activities/${id}/comments`, { page, pageSize })
}

/** 我报名的活动 */
export const getMyActivities = (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Activity>> => {
  return get('/api/users/activities', { page, pageSize })
}
