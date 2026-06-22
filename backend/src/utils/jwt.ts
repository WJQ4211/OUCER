import jwt from 'jsonwebtoken'
import config from '@/config'

export interface JwtPayload {
  openId: string
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as any || '7d',
  })
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload
}
