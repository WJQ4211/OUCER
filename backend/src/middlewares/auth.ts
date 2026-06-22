import { Request, Response, NextFunction } from 'express'
import { verifyToken, JwtPayload } from '@/utils/jwt'

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

/** JWT authentication middleware */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '请先登录' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ code: 401, message: '登录已过期，请重新登录' })
  }
}

/** Optional auth - doesn't fail if no token */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1]
      req.user = verifyToken(token)
    } catch {
      // ignore invalid token
    }
  }
  next()
}
