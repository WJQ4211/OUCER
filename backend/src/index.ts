import 'reflect-metadata'
import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import config from '@/config'
import { connectDB } from '@/config/database'
import { errorHandler } from '@/middlewares/errorHandler'
import authRoutes from '@/routes/auth'
import discussionRoutes from '@/routes/discussions'
import notificationRoutes from '@/routes/notifications'

const app = express()

// ===== Middleware =====

app.use(helmet())
app.use(cors({ origin: config.frontendUrl, credentials: true }))

if (config.isDevelopment) {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests',
})
app.use(limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// ===== Routes =====

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Haidaren API is running' })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/discussions', discussionRoutes)
app.use('/api/notifications', notificationRoutes)

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ code: 404, message: 'Resource not found' })
})

app.use(errorHandler)

// ===== Start =====

const PORT = config.port

const startServer = async () => {
  try {
    // Connect to database (skip if DB not available for dev)
    if (process.env.SKIP_DB !== 'true') {
      try {
        await connectDB()
      } catch (dbError) {
        console.warn('[Server] Database not available, running without DB:', (dbError as Error).message)
      }
    }

    app.listen(PORT, () => {
      console.log(`[Server] Haidaren API running on port ${PORT}`)
      console.log(`[Server] Environment: ${config.nodeEnv}`)
      console.log(`[Server] Health: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('[Server] Failed to start:', error)
    process.exit(1)
  }
}

startServer()

export default app
