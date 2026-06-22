import { Router, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { authMiddleware, optionalAuth } from '@/middlewares/auth'
import { load, save } from '@/utils/devStore'

const router = Router()

interface DevActivity {
  id: string; title: string; description: string; category: string; coverImage: string | null
  startTime: string; endTime: string; address: string; capacity: number; participantCount: number
  participants: { openId: string; nickname: string; identityDisplay: string }[]
  organizer: { openId: string; nickname: string; identityDisplay: string }
  comments: DevComment[]; status: string; createdAt: string
}
interface DevComment {
  id: string; activityId: string; authorOpenId: string; authorNickname: string; authorIdentityDisplay: string
  content: string; createdAt: string
}

// Persistent storage
const devActivities = load<DevActivity>('activities')

const persist = () => save('activities', devActivities)

// Load users for identity display
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

function fmt(a: DevActivity) {
  return {
    id: a.id, title: a.title, description: a.description, category: a.category,
    startTime: a.startTime, endTime: a.endTime, address: a.address,
    capacity: a.capacity, participantCount: a.participantCount, participants: a.participants,
    organizer: a.organizer, status: a.status, createdAt: a.createdAt,
    comments: a.comments.map((c) => ({
      id: c.id,
      author: { id: c.authorOpenId, ...getUserDisplay(c.authorOpenId) },
      content: c.content, createdAt: c.createdAt,
    })),
  }
}

// List
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100)
    let acts = Array.from(devActivities.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const total = acts.length
    res.json({ code: 0, data: { list: acts.slice((page - 1) * pageSize, page * pageSize).map(fmt), total, page, pageSize, hasMore: page * pageSize < total } })
  } catch (e) { res.status(500).json({ code: 500, message: 'List failed' }) }
})

// Detail
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  const a = devActivities.get(req.params.id)
  if (!a) return res.status(404).json({ code: 404, message: 'Not found' })
  res.json({ code: 0, data: fmt(a) })
})

// Create
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { title, description, category, startTime, endTime, address, capacity } = req.body
  if (!title || !description || !startTime || !endTime || !address) {
    return res.status(400).json({ code: 400, message: 'Fill required fields' })
  }
  const openId = req.user!.openId
  const display = getUserDisplay(openId)
  const a: DevActivity = {
    id: uuid(), title, description, category: category || 'other',
    coverImage: null, startTime, endTime, address,
    capacity: parseInt(capacity) || 50, participantCount: 0, participants: [],
    organizer: { openId, ...display },
    comments: [], status: 'upcoming', createdAt: new Date().toISOString(),
  }
  devActivities.set(a.id, a); persist()
  res.json({ code: 0, data: { id: a.id, message: 'Published' } })
})

// Join
router.post('/:id/join', authMiddleware, async (req: Request, res: Response) => {
  const a = devActivities.get(req.params.id)
  if (!a) return res.status(404).json({ code: 404, message: 'Not found' })
  const openId = req.user!.openId
  if (a.participants.find((p) => p.openId === openId)) return res.status(400).json({ code: 400, message: 'Already joined' })
  if (a.participantCount >= a.capacity) return res.status(400).json({ code: 400, message: 'Full' })
  const display = getUserDisplay(openId)
  a.participants.push({ openId, ...display })
  a.participantCount = a.participants.length; persist()
  res.json({ code: 0, data: { message: 'Joined' } })
})

// Comment
router.post('/:id/comments', authMiddleware, async (req: Request, res: Response) => {
  const { content } = req.body
  if (!content?.trim()) return res.status(400).json({ code: 400, message: 'Empty' })
  const a = devActivities.get(req.params.id)
  if (!a) return res.status(404).json({ code: 404, message: 'Not found' })
  const openId = req.user!.openId
  const display = getUserDisplay(openId)
  const c: DevComment = { id: uuid(), activityId: a.id, authorOpenId: openId, ...display, content: content.trim(), createdAt: new Date().toISOString() }
  a.comments.push(c); persist()
  res.json({ code: 0, data: c })
})

// My
router.get('/mine/list', authMiddleware, async (req: Request, res: Response) => {
  const acts = Array.from(devActivities.values()).filter((a) => a.organizer.openId === req.user!.openId || a.participants.find((p) => p.openId === req.user!.openId))
  res.json({ code: 0, data: { list: acts.map(fmt), total: acts.length, page: 1, pageSize: 100, hasMore: false } })
})

export default router
