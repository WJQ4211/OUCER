import { Router, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { authMiddleware, optionalAuth } from '@/middlewares/auth'

const router = Router()

interface DevActivity {
  id: string
  title: string
  description: string
  category: string
  coverImage: string | null
  startTime: string
  endTime: string
  address: string
  capacity: number
  participantCount: number
  participants: { openId: string; nickname: string; identityDisplay: string }[]
  organizer: { openId: string; nickname: string; identityDisplay: string }
  comments: DevActivityComment[]
  status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled'
  createdAt: string
}
interface DevActivityComment {
  id: string
  activityId: string
  authorOpenId: string
  authorNickname: string
  authorIdentityDisplay: string
  content: string
  createdAt: string
}
const devActivities = new Map<string, DevActivity>()

// List
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  const locationId = req.query.locationId as string
  const page = parseInt(req.query.page as string) || 1
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100)
  let acts = Array.from(devActivities.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  if (locationId) acts = acts.filter((a) => true) // future: filter by city
  const total = acts.length
  res.json({ code: 0, data: { list: acts.slice((page - 1) * pageSize, page * pageSize).map(format), total, page, pageSize, hasMore: page * pageSize < total } })
})

// Detail
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  const a = devActivities.get(req.params.id)
  if (!a) return res.status(404).json({ code: 404, message: 'Not found' })
  res.json({ code: 0, data: format(a) })
})

// Create
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { title, description, category, startTime, endTime, address, capacity } = req.body
  if (!title || !description || !startTime || !endTime || !address) {
    return res.status(400).json({ code: 400, message: 'Fill required fields' })
  }
  const openId = req.user!.openId
  const a: DevActivity = {
    id: uuid(), title, description, category: category || 'other',
    coverImage: null, startTime, endTime, address,
    capacity: parseInt(capacity) || 50, participantCount: 0, participants: [],
    organizer: { openId, nickname: `校友${openId.slice(-6)}`, identityDisplay: `校友${openId.slice(-6)}` },
    comments: [], status: 'upcoming', createdAt: new Date().toISOString(),
  }
  devActivities.set(a.id, a)
  res.json({ code: 0, data: { id: a.id, message: 'Published' } })
})

// Join
router.post('/:id/join', authMiddleware, async (req: Request, res: Response) => {
  const a = devActivities.get(req.params.id)
  if (!a) return res.status(404).json({ code: 404, message: 'Not found' })
  const openId = req.user!.openId
  if (a.participants.find((p) => p.openId === openId)) return res.status(400).json({ code: 400, message: 'Already joined' })
  if (a.participantCount >= a.capacity) return res.status(400).json({ code: 400, message: 'Full' })
  a.participants.push({ openId, nickname: `校友${openId.slice(-6)}`, identityDisplay: `校友${openId.slice(-6)}` })
  a.participantCount = a.participants.length
  res.json({ code: 0, data: { message: 'Joined' } })
})

// Add comment
router.post('/:id/comments', authMiddleware, async (req: Request, res: Response) => {
  const { content } = req.body
  if (!content?.trim()) return res.status(400).json({ code: 400, message: 'Empty' })
  const a = devActivities.get(req.params.id)
  if (!a) return res.status(404).json({ code: 404, message: 'Not found' })
  const openId = req.user!.openId
  const c: DevActivityComment = {
    id: uuid(), activityId: a.id, authorOpenId: openId,
    authorNickname: `校友${openId.slice(-6)}`, authorIdentityDisplay: `校友${openId.slice(-6)}`,
    content: content.trim(), createdAt: new Date().toISOString(),
  }
  a.comments.push(c)
  res.json({ code: 0, data: c })
})

// My activities
router.get('/mine/list', authMiddleware, async (req: Request, res: Response) => {
  const acts = Array.from(devActivities.values()).filter((a) => a.organizer.openId === req.user!.openId || a.participants.find((p) => p.openId === req.user!.openId))
  res.json({ code: 0, data: { list: acts.map(format), total: acts.length, page: 1, pageSize: 100, hasMore: false } })
})

function format(a: DevActivity) {
  return {
    id: a.id, title: a.title, description: a.description, category: a.category,
    startTime: a.startTime, endTime: a.endTime, address: a.address,
    capacity: a.capacity, participantCount: a.participantCount,
    participants: a.participants, organizer: a.organizer, comments: a.comments.map((c) => ({
      id: c.id, author: { id: c.authorOpenId, nickname: c.authorNickname, identityDisplay: c.authorIdentityDisplay },
      content: c.content, createdAt: c.createdAt,
    })),
    status: a.status, createdAt: a.createdAt,
  }
}

export default router
