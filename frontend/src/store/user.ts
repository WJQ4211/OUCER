/**
 * 用户状态管理
 */

import { create } from 'zustand'
import type { User, UnreadCount } from '@/types'

interface UserState {
  /** 当前用户信息 */
  user: User | null
  /** 是否已登录 */
  isLoggedIn: boolean
  /** 登录 loading */
  loginLoading: boolean
  /** 未读消息数 */
  unreadCount: UnreadCount

  /** 设置用户信息 */
  setUser: (user: User | null) => void
  /** 设置登录状态 */
  setLoginLoading: (loading: boolean) => void
  /** 登录成功 */
  login: (user: User) => void
  /** 退出登录 */
  logout: () => void
  /** 更新用户资料 */
  updateUser: (partial: Partial<User>) => void
  /** 设置未读消息数 */
  setUnreadCount: (count: UnreadCount) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,
  loginLoading: false,
  unreadCount: {
    total: 0,
    likes: 0,
    comments: 0,
    applications: 0,
    activities: 0,
    system: 0,
  },

  setUser: (user) => set({ user, isLoggedIn: !!user }),

  setLoginLoading: (loading) => set({ loginLoading: loading }),

  login: (user) => set({ user, isLoggedIn: true, loginLoading: false }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      unreadCount: {
        total: 0,
        likes: 0,
        comments: 0,
        applications: 0,
        activities: 0,
        system: 0,
      },
    }),

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    })),

  setUnreadCount: (count) => set({ unreadCount: count }),
}))
