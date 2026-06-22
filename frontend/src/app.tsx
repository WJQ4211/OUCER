import { PropsWithChildren, useEffect, useState } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import { useUserStore } from '@/store/user'
import { setStorage, getStorage, STORAGE_KEYS } from '@/utils/storage'
import './app.scss'
import '@/styles/global.scss'

function App({ children }: PropsWithChildren) {
  const { user, setUser } = useUserStore()
  const [authChecked, setAuthChecked] = useState(false)

  useLaunch(() => {
    console.log('[App] Launching, auto-login...')
    autoLogin()
  })

  const autoLogin = async () => {
    try {
      // Check if we already have a stored token
      const token = await getStorage<string>(STORAGE_KEYS.TOKEN)
      if (token) {
        // Try to restore session
        console.log('[App] Found stored token, restoring session...')
      }

      // Get WeChat login code
      const { code } = await Taro.login()
      console.log('[App] Got wx.login code:', code.slice(0, 10) + '...')

      // Call backend login
      const res = await Taro.request({
        url: 'http://localhost:3000/api/auth/login',
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        data: { code },
      })

      if (res.statusCode === 200 && res.data) {
        const body = res.data as any
        if (body.code === 0) {
          const { token, user: userInfo } = body.data
          // Persist token
          await setStorage(STORAGE_KEYS.TOKEN, token)
          await setStorage(STORAGE_KEYS.USER_INFO, userInfo)
          // Set user in global store
          setUser(userInfo)
          console.log('[App] Auto-login success, user:', userInfo.nickname)
        }
      }
    } catch (err: any) {
      console.warn('[App] Auto-login failed (dev server might be down):', err.errMsg || err.message)
    } finally {
      setAuthChecked(true)
    }
  }

  return <>{children}</>
}

export default App
