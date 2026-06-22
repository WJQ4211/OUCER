import { Router, Request, Response } from 'express'
import { AppDataSource } from '@/config/database'
import { Notification } from '@/entities/Notification'
import { authMiddleware } from '@/middlewares/auth'

const router = Router()
const notifRepo = () => AppDataSource.getRepository(Notification)

// Get notifications for current user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 30, 100)
    const type = req.query.type as string
    const unreadOnly = req.query.unread === 'true'

    const qb = notifRepo().createQueryBuilder('notif')
      .where('notif.userId = :userId', { userId: req.user!.openId })

    if (type && type !== 'all') qb.andWhere('notif.type = :type', { type })
    if (unreadOnly) qb.andWhere('notif.read = :read', { read: false })

    qb.orderBy('notif.createdAt', 'DESC')

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()

    // Count unread
    const unreadCounts = await Promise.all([
      notifRepo().count({ where: { userId: req.user!.openId, read: false, type: 'like' } }),
      notifRepo().count({ where: { userId: req.user!.openId, read: false, type: 'comment' } }),
      notifRepo().count({ where: { userId: req.user!.openId, read: false, type: 'activity' } }),
      notifRepo().count({ where: { userId: req.user!.openId, read: false, type: 'system' } }),
      notifRepo().count({ where: { userId: req.user!.openId, read: false } }),
    ])

    res.json({
      code: 0,
      data: {
        list: list.map((n) => ({
          id: n.id,
          type: n.type,
          actor: n.actorOpenId ? { id: n.actorOpenId } : undefined,
          content: n.content,
          target: n.targetType ? { type: n.targetType, id: n.targetId } : undefined,
          read: n.read,
          createdAt: n.createdAt.toISOString(),
        })),
        total,
        page,
        pageSize,
        hasMore: page * pageSize < total,
        unreadCount: {
          likes: unreadCounts[0],
          comments: unreadCounts[1],
          activities: unreadCounts[2],
          system: unreadCounts[3],
          total: unreadCounts[4],
        },
      },
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取失败' })
  }
})

// Mark as read
router.put('/:id/read', authMiddleware, async (req: Request, res: Response) => {
  try {
    await notifRepo().update(
      { id: req.params.id, userId: req.user!.openId },
      { read: true }
    )
    res.json({ code: 0, data: { message: '已读' } })
  } catch (error) {
    res.status(500).json({ code: 500, message: '操作失败' })
  }
})

// Mark all as read
router.put('/read-all', authMiddleware, async (req: Request, res: Response) => {
  try {
    await notifRepo().update(
      { userId: req.user!.openId, read: false },
      { read: true }
    )
    res.json({ code: 0, data: { message: '全部已读' } })
  } catch (error) {
    res.status(500).json({ code: 500, message: '操作失败' })
  }
})

export default router
