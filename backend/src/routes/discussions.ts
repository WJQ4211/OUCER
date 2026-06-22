import { Router, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { authMiddleware, optionalAuth } from '@/middlewares/auth'

const router = Router()

// In-memory storage for dev
interface DevPost {
  id: string
  title: string
  content: string
  category: string
  authorOpenId: string
  authorNickname: string
  authorIdentityDisplay: string
  authorIpProvince: string | null
  images: string[]
  likes: number
  likedBy: string[]
  commentCount: number
  views: number
  isPinned: boolean
  isHot: boolean
  createdAt: string
  updatedAt: string
}
interface DevComment {
  id: string
  postId: string
  authorOpenId: string
  authorNickname: string
  authorIdentityDisplay: string
  content: string
  likes: number
  likedBy: string[]
  createdAt: string
}
const devPosts = new Map<string, DevPost>()
const devComments = new Map<string, DevComment[]>()

// Helper: format post for API
const formatPost = (p: DevPost, currentOpenId?: string) => ({
  id: p.id,
  title: p.title,
  content: p.content,
  category: p.category,
  author: {
    id: p.authorOpenId,
    openId: p.authorOpenId,
    nickname: p.authorNickname,
    identityDisplay: p.authorIdentityDisplay,
    ipProvince: p.authorIpProvince,
    isVerified: true,
  },
  images: p.images,
  likes: p.likes,
  isLiked: currentOpenId ? p.likedBy.includes(currentOpenId) : false,
  commentCount: p.commentCount,
  views: p.views,
  isPinned: p.isPinned,
  isHot: p.isHot,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
})

// ==================== List posts ====================

router.get('/', optionalAuth, async (req: Request, res: Response) => {
  const category = req.query.category as string
  const sort = (req.query.sort as string) || 'latest'
  const page = parseInt(req.query.page as string) || 1
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100)

  let posts = Array.from(devPosts.values())

  if (category) {
    posts = posts.filter((p) => p.category === category)
  }

  switch (sort) {
    case 'hot':
      posts.sort((a, b) => b.likes - a.likes || b.commentCount - a.commentCount)
      break
    case 'most_comments':
      posts.sort((a, b) => b.commentCount - a.commentCount)
      break
    default:
      posts.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }

  const total = posts.length
  const sliced = posts.slice((page - 1) * pageSize, page * pageSize)

  res.json({
    code: 0,
    data: {
      list: sliced.map((p) => formatPost(p, req.user?.openId)),
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    },
  })
})

// ==================== Get post detail ====================

router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  const post = devPosts.get(req.params.id)
  if (!post) {
    return res.status(404).json({ code: 404, message: 'Post not found' })
  }
  post.views += 1
  const comments = devComments.get(post.id) || []
  res.json({
    code: 0,
    data: {
      ...formatPost(post, req.user?.openId),
      content: post.content,
      comments: comments.map((c) => ({
        id: c.id,
        author: {
          id: c.authorOpenId,
          openId: c.authorOpenId,
          nickname: c.authorNickname,
          identityDisplay: c.authorIdentityDisplay,
          isVerified: true,
        },
        content: c.content,
        likes: c.likes,
        isLiked: req.user?.openId ? c.likedBy.includes(req.user.openId) : false,
        createdAt: c.createdAt,
      })),
    },
  })
})

// ==================== Create post ====================

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { title, content, category, images } = req.body
  if (!title?.trim() || !content?.trim() || !category) {
    return res.status(400).json({ code: 400, message: 'Fill title, content and category' })
  }

  // Get author info from user store (via auth module)
  const openId = req.user!.openId
  // Get user display info - for dev we'll reconstruct
  const authorNickname = `校友${openId.slice(-6)}`
  const authorIdentityDisplay = authorNickname

  const post: DevPost = {
    id: uuid(),
    title: title.trim(),
    content: content.trim(),
    category,
    authorOpenId: openId,
    authorNickname,
    authorIdentityDisplay,
    authorIpProvince: null,
    images: images || [],
    likes: 0,
    likedBy: [],
    commentCount: 0,
    views: 0,
    isPinned: false,
    isHot: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  devPosts.set(post.id, post)

  res.json({ code: 0, data: { id: post.id, message: 'Published' } })
})

// ==================== Delete post ====================

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const post = devPosts.get(req.params.id)
  if (!post) return res.status(404).json({ code: 404, message: 'Not found' })
  if (post.authorOpenId !== req.user!.openId) return res.status(403).json({ code: 403, message: 'Forbidden' })

  devComments.delete(post.id)
  devPosts.delete(post.id)
  res.json({ code: 0, data: { message: 'Deleted' } })
})

// ==================== Toggle like ====================

router.post('/:id/like', authMiddleware, async (req: Request, res: Response) => {
  const post = devPosts.get(req.params.id)
  if (!post) return res.status(404).json({ code: 404, message: 'Not found' })

  const openId = req.user!.openId
  const idx = post.likedBy.indexOf(openId)
  if (idx >= 0) {
    post.likedBy.splice(idx, 1)
    post.likes = Math.max(0, post.likes - 1)
  } else {
    post.likedBy.push(openId)
    post.likes += 1
  }
  res.json({ code: 0, data: { liked: idx < 0, count: post.likes } })
})

// ==================== Add comment ====================

router.post('/:id/comments', authMiddleware, async (req: Request, res: Response) => {
  const { content } = req.body
  if (!content?.trim()) {
    return res.status(400).json({ code: 400, message: 'Empty comment' })
  }

  const post = devPosts.get(req.params.id)
  if (!post) return res.status(404).json({ code: 404, message: 'Post not found' })

  const openId = req.user!.openId
  const comments = devComments.get(post.id) || []

  const comment: DevComment = {
    id: uuid(),
    postId: post.id,
    authorOpenId: openId,
    authorNickname: `校友${openId.slice(-6)}`,
    authorIdentityDisplay: `校友${openId.slice(-6)}`,
    content: content.trim(),
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
  }
  comments.push(comment)
  devComments.set(post.id, comments)
  post.commentCount = comments.length

  res.json({
    code: 0,
    data: {
      id: comment.id,
      author: {
        id: comment.authorOpenId,
        openId: comment.authorOpenId,
        nickname: comment.authorNickname,
        identityDisplay: comment.authorIdentityDisplay,
        isVerified: true,
      },
      content: comment.content,
      likes: 0,
      isLiked: false,
      createdAt: comment.createdAt,
    },
  })
})

// ==================== My posts ====================

router.get('/mine/list', authMiddleware, async (req: Request, res: Response) => {
  const posts = Array.from(devPosts.values())
    .filter((p) => p.authorOpenId === req.user!.openId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  res.json({
    code: 0,
    data: {
      list: posts.map((p) => ({
        id: p.id, title: p.title,
        content: p.content.slice(0, 200),
        category: p.category,
        likes: p.likes, commentCount: p.commentCount,
        views: p.views, createdAt: p.createdAt,
      })),
      total: posts.length,
      page: 1,
      pageSize: 100,
      hasMore: false,
    },
  })
})

export default router
