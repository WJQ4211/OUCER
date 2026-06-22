import { Router, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { authMiddleware, optionalAuth } from '@/middlewares/auth'
import { load, save } from '@/utils/devStore'

const router = Router()

interface DevPost {
  id: string; title: string; content: string; category: string
  authorOpenId: string; authorNickname: string; authorIdentityDisplay: string; authorIpProvince: string | null
  images: string[]; likes: number; likedBy: string[]; commentCount: number; views: number
  isPinned: boolean; isHot: boolean; createdAt: string; updatedAt: string
}
interface DevComment {
  id: string; postId: string; authorOpenId: string; authorNickname: string; authorIdentityDisplay: string
  content: string; likes: number; likedBy: string[]; createdAt: string
}

// Persistent storage
const devPosts = load<DevPost>('discussions')
const devComments = load<DevComment[]>('comments')

const persist = () => {
  save('discussions', devPosts)
  save('comments', devComments)
}

// Load users for identity
let devUsers: Map<string, any>
try { devUsers = load<any>('users') } catch { devUsers = new Map() }

function getUserDisplay(openId: string): { nickname: string; identityDisplay: string } {
  const u = devUsers.get(openId)
  if (!u) return { nickname: `校友${openId.slice(-6)}`, identityDisplay: `未知级-校友${openId.slice(-6)}` }
  const parts: string[] = [`${u.graduationYear || '未知'}级`]
  if (u.showDepartment && u.department) parts.push(u.department)
  if (u.showMajor && u.major) parts.push(u.major)
  parts.push(u.showRealName && u.realName ? u.realName : u.nickname || `校友${openId.slice(-6)}`)
  if (u.gender !== 'hidden') parts.push(u.gender === 'male' ? '男' : '女')
  return { nickname: u.nickname, identityDisplay: parts.join('-') }
}

function formatPost(p: DevPost, currentOpenId?: string) {
  const author = getUserDisplay(p.authorOpenId)
  return {
    id: p.id, title: p.title, content: p.content, category: p.category,
    author: { id: p.authorOpenId, openId: p.authorOpenId, ...author, ipProvince: p.authorIpProvince, isVerified: true },
    images: p.images, likes: p.likes, isLiked: currentOpenId ? p.likedBy.includes(currentOpenId) : false,
    commentCount: p.commentCount, views: p.views,
    isPinned: p.isPinned, isHot: p.isHot, createdAt: p.createdAt, updatedAt: p.updatedAt,
  }
}

// List
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string
    const sort = (req.query.sort as string) || 'latest'
    const page = parseInt(req.query.page as string) || 1
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100)

    let posts = Array.from(devPosts.values())
    if (category) posts = posts.filter((p) => p.category === category)

    switch (sort) {
      case 'hot': posts.sort((a, b) => b.likes - a.likes || b.commentCount - a.commentCount); break
      case 'most_comments': posts.sort((a, b) => b.commentCount - a.commentCount); break
      default: posts.sort((a, b) => a.isPinned === b.isPinned ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : a.isPinned ? -1 : 1)
    }

    const total = posts.length
    res.json({
      code: 0,
      data: {
        list: posts.slice((page - 1) * pageSize, page * pageSize).map((p) => formatPost(p, req.user?.openId)),
        total, page, pageSize, hasMore: page * pageSize < total,
      },
    })
  } catch (e) { res.status(500).json({ code: 500, message: 'List failed' }) }
})

// Detail
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  const post = devPosts.get(req.params.id)
  if (!post) return res.status(404).json({ code: 404, message: 'Not found' })
  post.views += 1; persist()
  const comments = devComments.get(post.id) || []
  res.json({
    code: 0,
    data: {
      ...formatPost(post, req.user?.openId),
      content: post.content,
      comments: comments.map((c) => ({
        id: c.id,
        author: { id: c.authorOpenId, openId: c.authorOpenId, ...getUserDisplay(c.authorOpenId), isVerified: true },
        content: c.content, likes: c.likes,
        isLiked: req.user?.openId ? c.likedBy.includes(req.user.openId) : false,
        createdAt: c.createdAt,
      })),
    },
  })
})

// Create
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { title, content, category, images } = req.body
  if (!title?.trim() || !content?.trim() || !category) {
    return res.status(400).json({ code: 400, message: 'Fill title, content and category' })
  }
  const openId = req.user!.openId
  const display = getUserDisplay(openId)
  const post: DevPost = {
    id: uuid(), title: title.trim(), content: content.trim(), category,
    authorOpenId: openId, authorNickname: display.nickname, authorIdentityDisplay: display.identityDisplay, authorIpProvince: null,
    images: images || [], likes: 0, likedBy: [], commentCount: 0, views: 0,
    isPinned: false, isHot: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  }
  devPosts.set(post.id, post)
  persist()
  res.json({ code: 0, data: { id: post.id, message: 'Published' } })
})

// Delete
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const post = devPosts.get(req.params.id)
  if (!post) return res.status(404).json({ code: 404, message: 'Not found' })
  if (post.authorOpenId !== req.user!.openId) return res.status(403).json({ code: 403, message: 'Forbidden' })
  devComments.delete(post.id); devPosts.delete(post.id); persist()
  res.json({ code: 0, data: { message: 'Deleted' } })
})

// Like
router.post('/:id/like', authMiddleware, async (req: Request, res: Response) => {
  const post = devPosts.get(req.params.id)
  if (!post) return res.status(404).json({ code: 404, message: 'Not found' })
  const openId = req.user!.openId
  const idx = post.likedBy.indexOf(openId)
  if (idx >= 0) { post.likedBy.splice(idx, 1); post.likes = Math.max(0, post.likes - 1) }
  else { post.likedBy.push(openId); post.likes += 1 }
  persist()
  res.json({ code: 0, data: { liked: idx < 0, count: post.likes } })
})

// Comment
router.post('/:id/comments', authMiddleware, async (req: Request, res: Response) => {
  const { content } = req.body
  if (!content?.trim()) return res.status(400).json({ code: 400, message: 'Empty' })
  const post = devPosts.get(req.params.id)
  if (!post) return res.status(404).json({ code: 404, message: 'Not found' })
  const openId = req.user!.openId
  const display = getUserDisplay(openId)
  const comments = devComments.get(post.id) || []
  const c: DevComment = {
    id: uuid(), postId: post.id, authorOpenId: openId,
    authorNickname: display.nickname, authorIdentityDisplay: display.identityDisplay,
    content: content.trim(), likes: 0, likedBy: [], createdAt: new Date().toISOString(),
  }
  comments.push(c); devComments.set(post.id, comments)
  post.commentCount = comments.length; persist()
  res.json({ code: 0, data: { id: c.id, author: { id: c.authorOpenId, ...display, isVerified: true }, content: c.content, likes: 0, isLiked: false, createdAt: c.createdAt } })
})

// My posts
router.get('/mine/list', authMiddleware, async (req: Request, res: Response) => {
  const posts = Array.from(devPosts.values()).filter((p) => p.authorOpenId === req.user!.openId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  res.json({ code: 0, data: { list: posts.map((p) => ({ id: p.id, title: p.title, content: p.content.slice(0, 200), category: p.category, likes: p.likes, commentCount: p.commentCount, views: p.views, createdAt: p.createdAt })), total: posts.length, page: 1, pageSize: 100, hasMore: false } })
})

export default router
