import { Router, Request, Response } from 'express'
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import config from '@/config'
import { signToken } from '@/utils/jwt'
import { authMiddleware } from '@/middlewares/auth'
import {
  generateCode,
  storeDevCode,
  verifyDevCode,
} from '@/services/email'

const router = Router()

// In-memory storage for dev mode (no DB needed)
interface DevUser {
  openId: string
  nickname: string
  avatar: string | null
  graduationYear: number | null
  department: string | null
  major: string | null
  realName: string | null
  gender: 'male' | 'female' | 'hidden'
  showDepartment: boolean
  showMajor: boolean
  showRealName: boolean
  ipProvince: string | null
  phone: string | null
  email: string | null
  wechat: string | null
  city: string | null
  bio: string | null
  isVerified: boolean
  verificationMethod: 'email' | 'chsi' | null
  oucEmail: string | null
  createdAt: string
}
const devUsers = new Map<string, DevUser>()

const getOrCreateDevUser = (openId: string): DevUser => {
  let user = devUsers.get(openId)
  if (!user) {
    user = {
      openId,
      nickname: `校友${openId.slice(-6)}`,
      avatar: null,
      graduationYear: null,
      department: null,
      major: null,
      realName: null,
      gender: 'hidden',
      showDepartment: true,
      showMajor: true,
      showRealName: false,
      ipProvince: null,
      phone: null,
      email: null,
      wechat: null,
      city: null,
      bio: null,
      isVerified: false,
      verificationMethod: null,
      oucEmail: null,
      createdAt: new Date().toISOString(),
    }
    devUsers.set(openId, user)
  }
  return user
}

const formatDevUser = (u: DevUser) => {
  const identityParts: string[] = [`${u.graduationYear || '未知'}级`]
  if (u.showDepartment && u.department) identityParts.push(u.department)
  if (u.showMajor && u.major) identityParts.push(u.major)
  const name = u.showRealName && u.realName ? u.realName : u.nickname
  identityParts.push(name)
  if (u.gender !== 'hidden') identityParts.push(u.gender === 'male' ? '男' : '女')
  return {
    id: u.openId, openId: u.openId,
    graduationYear: u.graduationYear, department: u.department,
    major: u.major, realName: u.realName, nickname: u.nickname,
    gender: u.gender, showDepartment: u.showDepartment,
    showMajor: u.showMajor, showRealName: u.showRealName,
    identityDisplay: identityParts.join('-'),
    ipProvince: u.ipProvince, avatar: u.avatar,
    phone: u.phone, email: u.email, wechat: u.wechat,
    city: u.city, bio: u.bio,
    isVerified: u.isVerified, verificationMethod: u.verificationMethod,
    oucEmail: u.oucEmail, createdAt: u.createdAt,
  }
}

// ==================== WeChat Login ====================

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { code } = req.body
    if (!code) {
      return res.status(400).json({ code: 400, message: 'Missing login code' })
    }

    let openId: string
    let ipProvince: string | null = null

    // Exchange code for OpenID from WeChat
    const hasWechatConfig = config.wechat.appId && config.wechat.secret &&
      config.wechat.secret !== 'your_wechat_app_secret'

    if (hasWechatConfig) {
      try {
        const wxRes = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
          params: {
            appid: config.wechat.appId,
            secret: config.wechat.secret,
            js_code: code,
            grant_type: 'authorization_code',
          },
        })
        if (wxRes.data.errcode) {
          throw new Error(wxRes.data.errmsg || 'WeChat error')
        }
        openId = wxRes.data.openid
        console.log(`[Auth] WeChat login success: ${openId}`)
      } catch (err: any) {
        if (config.isDevelopment) {
          openId = `dev_openid_${code.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`
          console.log(`[DEV] WeChat unavailable, using dev openId: ${openId}`)
        } else {
          return res.status(500).json({ code: 500, message: `WeChat login failed: ${err.message}` })
        }
      }
    } else {
      openId = `dev_openid_${code.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`
      console.log(`[DEV] Login (no WeChat config): ${openId}`)
    }

    // Get IP from request (province level)
    const forwarded = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    // In production, use IP geolocation service. For dev, set from header.
    ipProvince = (req.headers['x-ip-province'] as string) || null

    // Get or create user
    let user: DevUser
    let isNewUser = false
    const existing = devUsers.get(openId)
    if (!existing) {
      user = getOrCreateDevUser(openId)
      if (ipProvince) user.ipProvince = ipProvince
      isNewUser = true
    } else {
      user = existing
      if (ipProvince) user.ipProvince = ipProvince
    }

    const token = signToken({ openId })

    res.json({
      code: 0,
      data: {
        token,
        user: formatDevUser(user),
        isNewUser,
      },
    })
  } catch (error) {
    console.error('[Auth] Login failed:', error)
    res.status(500).json({ code: 500, message: 'Login failed' })
  }
})

// ==================== Send verification code ====================

router.post('/verify/send-code', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { oucEmail } = req.body
    if (!oucEmail || !oucEmail.match(/@(ouc|stu\.ouc)\.edu\.cn$/)) {
      return res.status(400).json({ code: 400, message: 'Invalid OUC email' })
    }

    const code = generateCode()
    storeDevCode(oucEmail, code)

    console.log(`[DEV] Verification code for ${oucEmail}: ${code}`)

    res.json({
      code: 0,
      data: { message: 'Code sent', devCode: config.isDevelopment ? code : undefined },
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Send failed' })
  }
})

// ==================== Confirm email verification ====================

router.post('/verify/confirm-email', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { oucEmail, code } = req.body
    if (!oucEmail || !code) {
      return res.status(400).json({ code: 400, message: 'Missing params' })
    }

    const valid = verifyDevCode(oucEmail, code)
    if (!valid) {
      return res.status(400).json({ code: 400, message: 'Invalid or expired code' })
    }

    const user = devUsers.get(req.user!.openId)
    if (!user) {
      return res.status(404).json({ code: 404, message: 'User not found' })
    }

    user.isVerified = true
    user.verificationMethod = 'email'
    user.oucEmail = oucEmail

    res.json({
      code: 0,
      data: { success: true, message: 'Verified!', user: formatDevUser(user) },
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Verification failed' })
  }
})

// ==================== CHSI verification ====================

router.post('/verify/chsi', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { verifyCode, realName } = req.body
    if (!verifyCode || !realName) {
      return res.status(400).json({ code: 400, message: 'Missing params' })
    }

    const user = devUsers.get(req.user!.openId)
    if (!user) {
      return res.status(404).json({ code: 404, message: 'User not found' })
    }

    user.realName = realName
    // In production: manual review. Dev: auto-approve after a delay
    user.isVerified = true
    user.verificationMethod = 'chsi'

    console.log(`[DEV] CHSI verified for ${req.user!.openId}: ${realName} / ${verifyCode}`)

    res.json({
      code: 0,
      data: { success: true, message: 'Verification submitted', user: formatDevUser(user) },
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Submission failed' })
  }
})

// ==================== Get current user ====================

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const user = devUsers.get(req.user!.openId)
  if (!user) {
    return res.status(404).json({ code: 404, message: 'User not found' })
  }
  res.json({ code: 0, data: formatDevUser(user) })
})

// ==================== Update profile ====================

router.put('/me', authMiddleware, async (req: Request, res: Response) => {
  const user = devUsers.get(req.user!.openId)
  if (!user) {
    return res.status(404).json({ code: 404, message: 'User not found' })
  }

  const allowedFields = [
    'nickname', 'avatar', 'graduationYear', 'department', 'major',
    'realName', 'gender', 'showDepartment', 'showMajor', 'showRealName',
    'phone', 'email', 'wechat', 'city', 'bio',
  ]

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      ;(user as any)[field] = req.body[field]
    }
  }

  res.json({ code: 0, data: formatDevUser(user) })
})

export default router
