import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger'

export interface ApiError extends Error {
  statusCode?: number
  code?: string
  details?: any
}

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  error: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error.statusCode || 500
  const code = error.code || 'INTERNAL_SERVER_ERROR'
  const message = error.message || '服务器内部错误'

  logger.error(`[${code}] ${message}`, {
    statusCode,
    details: error.details,
    stack: error.stack,
  })

  res.status(statusCode).json({
    code,
    message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { details: error.details }),
  })
}

/**
 * 异步错误包装
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
