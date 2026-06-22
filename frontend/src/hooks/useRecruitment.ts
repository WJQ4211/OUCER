/**
 * Discussion forum hooks
 */

import { useCallback, useState } from 'react'
import Taro from '@tarojs/taro'
import {
  getDiscussionList,
  getDiscussionDetail,
  createDiscussion,
  deleteDiscussion,
  toggleLikeDiscussion,
  addComment,
} from '@/services/api/recruitment'
import type { DiscussionPost, DiscussionFilter } from '@/types'

const PAGE_SIZE = 15

/** Discussion list */
export const useDiscussionList = () => {
  const [list, setList] = useState<DiscussionPost[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<DiscussionFilter>({})

  const refresh = useCallback(async (f?: DiscussionFilter) => {
    const activeFilter = f ?? filter
    setLoading(true)
    try {
      const result = await getDiscussionList(1, PAGE_SIZE, activeFilter)
      setList(result.list)
      setHasMore(result.hasMore)
      setPage(1)
    } catch {
      // error handled in request layer
    } finally {
      setLoading(false)
    }
  }, [filter])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const result = await getDiscussionList(nextPage, PAGE_SIZE, filter)
      setList((prev) => [...prev, ...result.list])
      setHasMore(result.hasMore)
      setPage(nextPage)
    } catch {
      // error handled
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, filter])

  const handleLike = useCallback(async (id: string) => {
    try {
      const { liked } = await toggleLikeDiscussion(id)
      setList((prev) => prev.map((p) =>
        p.id === id ? { ...p, isLiked: liked, likes: p.likes + (liked ? 1 : -1) } : p
      ))
    } catch { /* handled */ }
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    const res = await Taro.showModal({ title: 'Confirm', content: 'Delete this post?' })
    if (!res.confirm) return
    try {
      await deleteDiscussion(id)
      setList((prev) => prev.filter((p) => p.id !== id))
      Taro.showToast({ title: 'Deleted', icon: 'success' })
    } catch { /* handled */ }
  }, [])

  return {
    list, loading, hasMore, filter,
    refresh, loadMore, setFilter,
    handleLike, handleDelete,
  }
}

/** Publish post */
export const usePublishDiscussion = () => {
  const [submitting, setSubmitting] = useState(false)

  const publish = useCallback(async (data: {
    title: string; content: string; category: string; images?: string[]
  }) => {
    setSubmitting(true)
    try {
      const result = await createDiscussion(data)
      Taro.showToast({ title: 'Published!', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1500)
      return result
    } catch {
      return null
    } finally {
      setSubmitting(false)
    }
  }, [])

  return { publish, submitting }
}

/** Post detail */
export const useDiscussionDetail = () => {
  const [post, setPost] = useState<DiscussionPost | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const detail = await getDiscussionDetail(id)
      setPost(detail)
    } catch {
      setPost(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLike = useCallback(async () => {
    if (!post) return
    try {
      const { liked } = await toggleLikeDiscussion(post.id)
      setPost((prev) => prev ? { ...prev, isLiked: liked, likes: prev.likes + (liked ? 1 : -1) } : prev)
    } catch { /* handled */ }
  }, [post])

  const handleComment = useCallback(async (content: string) => {
    if (!post) return null
    try {
      const comment = await addComment(post.id, content)
      setPost((prev) => prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev)
      // Refetch detail to get updated comments
      await load(post.id)
      return comment
    } catch {
      return null
    }
  }, [post, load])

  return { post, loading, load, handleLike, handleComment }
}

// Re-export for backward compatibility
export { useDiscussionList as useRecruitmentList }
export { usePublishDiscussion as usePublishRecruitment }
export { useDiscussionDetail as useRecruitmentDetail }
