/**
 * User / Auth hooks
 */

import { useCallback, useState } from 'react'
import Taro from '@tarojs/taro'
import { useUserStore } from '@/store/user'
import {
  wxLogin,
  getCurrentUser,
  updateProfile,
  sendVerifyCode,
  confirmEmailVerify,
  submitChsiVerify,
} from '@/services/api/user'
import { setStorage, removeStorage, STORAGE_KEYS } from '@/utils/storage'
import type { ProfileForm } from '@/types'

/** Auth hook */
export const useAuth = () => {
  const { user, isLoggedIn, login, logout, setLoginLoading } = useUserStore()
  const [loginLoading, setLoading] = useState(false)

  /** WeChat login */
  const handleLogin = useCallback(async () => {
    setLoading(true)
    setLoginLoading(true)
    try {
      const { code } = await Taro.login()
      const { token, user: userInfo } = await wxLogin(code)
      await setStorage(STORAGE_KEYS.TOKEN, token)
      await setStorage(STORAGE_KEYS.USER_INFO, userInfo)
      login(userInfo)
      Taro.showToast({ title: 'Login success', icon: 'success' })
    } catch {
      Taro.showToast({ title: 'Login failed', icon: 'error' })
    } finally {
      setLoading(false)
      setLoginLoading(false)
    }
  }, [login, setLoginLoading])

  /** Restore session */
  const checkLogin = useCallback(async (): Promise<boolean> => {
    try {
      const userInfo = await getCurrentUser()
      login(userInfo)
      return true
    } catch {
      return false
    }
  }, [login])

  /** Logout */
  const handleLogout = useCallback(async () => {
    await removeStorage(STORAGE_KEYS.TOKEN)
    await removeStorage(STORAGE_KEYS.USER_INFO)
    logout()
    Taro.showToast({ title: 'Logged out', icon: 'success' })
  }, [logout])

  return {
    user, isLoggedIn, loginLoading: loading || loginLoading,
    login: handleLogin, logout: handleLogout, checkLogin,
  }
}

/** Profile hook */
export const useProfile = () => {
  const { user, updateUser } = useUserStore()

  const handleUpdateProfile = useCallback(async (data: ProfileForm) => {
    try {
      const updated = await updateProfile(data)
      updateUser(updated)
      await setStorage(STORAGE_KEYS.USER_INFO, updated)
      Taro.showToast({ title: 'Saved', icon: 'success' })
      return true
    } catch {
      Taro.showToast({ title: 'Save failed', icon: 'error' })
      return false
    }
  }, [updateUser])

  return { user, updateProfile: handleUpdateProfile }
}

/** Verification hook */
export const useVerification = () => {
  const [sending, setSending] = useState(false)
  const [codeSent, setCodeSent] = useState(false)

  const handleSendCode = useCallback(async (oucEmail: string) => {
    setSending(true)
    try {
      const result = await sendVerifyCode(oucEmail)
      setCodeSent(true)
      if (result.devCode) {
        Taro.showToast({ title: `Dev code: ${result.devCode}`, icon: 'none', duration: 5000 })
      } else {
        Taro.showToast({ title: 'Code sent! Check email', icon: 'success' })
      }
    } catch {
      setCodeSent(false)
    } finally {
      setSending(false)
    }
  }, [])

  const handleEmailVerify = useCallback(async (oucEmail: string, code: string) => {
    try {
      await confirmEmailVerify(oucEmail, code)
      Taro.showToast({ title: 'Verified!', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1500)
      return true
    } catch {
      return false
    }
  }, [])

  const handleChsiVerify = useCallback(async (verifyCode: string, realName: string) => {
    try {
      await submitChsiVerify(verifyCode, realName)
      Taro.showToast({ title: 'Submitted for review', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1500)
      return true
    } catch {
      return false
    }
  }, [])

  return { sending, codeSent, handleSendCode, handleEmailVerify, handleChsiVerify }
}
