/**
 * User / Auth API
 */

import { get, post, put } from '../request'
import type { User, ProfileForm, LoginResponse, EmailVerifyRequest, VerifyResponse } from '@/types'

/** WeChat login */
export const wxLogin = (code: string): Promise<LoginResponse> => {
  return post('/api/auth/login', { code })
}

/** Get current user */
export const getCurrentUser = (): Promise<User> => {
  return get('/api/auth/me')
}

/** Update profile */
export const updateProfile = (data: ProfileForm): Promise<User> => {
  return put('/api/auth/me', data)
}

/** Send verification code to OUC email */
export const sendVerifyCode = (oucEmail: string): Promise<{ message: string; devCode?: string }> => {
  return post('/api/auth/verify/send-code', { oucEmail })
}

/** Confirm email verification */
export const confirmEmailVerify = (oucEmail: string, code: string): Promise<VerifyResponse> => {
  return post('/api/auth/verify/confirm-email', { oucEmail, code })
}

/** Submit CHSI verification */
export const submitChsiVerify = (verifyCode: string, realName: string): Promise<VerifyResponse> => {
  return post('/api/auth/verify/chsi', { verifyCode, realName })
}
