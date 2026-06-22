/**
 * 求职圈状态管理
 */

import { create } from 'zustand'
import type { Recruitment, RecruitmentFilter } from '@/types'

interface RecruitmentState {
  /** 招聘列表 */
  list: Recruitment[]
  /** 当前查看的招聘详情 */
  current: Recruitment | null
  /** 筛选条件 */
  filter: RecruitmentFilter
  /** 加载状态 */
  loading: boolean
  /** 当前页 */
  page: number
  /** 是否还有更多 */
  hasMore: boolean

  /** 设置列表 */
  setList: (list: Recruitment[], page: number, hasMore: boolean) => void
  /** 追加列表 */
  appendList: (list: Recruitment[], page: number, hasMore: boolean) => void
  /** 设置当前详情 */
  setCurrent: (recruitment: Recruitment | null) => void
  /** 设置筛选条件 */
  setFilter: (filter: Partial<RecruitmentFilter>) => void
  /** 清除筛选 */
  clearFilter: () => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
  /** 更新列表中的项 */
  updateItem: (id: string, data: Partial<Recruitment>) => void
  /** 从列表移除 */
  removeItem: (id: string) => void
}

const defaultFilter: RecruitmentFilter = {}

export const useRecruitmentStore = create<RecruitmentState>((set) => ({
  list: [],
  current: null,
  filter: { ...defaultFilter },
  loading: false,
  page: 1,
  hasMore: true,

  setList: (list, page, hasMore) => set({ list, page, hasMore }),

  appendList: (list, page, hasMore) =>
    set((state) => ({
      list: [...state.list, ...list],
      page,
      hasMore,
    })),

  setCurrent: (recruitment) => set({ current: recruitment }),

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),

  clearFilter: () => set({ filter: { ...defaultFilter } }),

  setLoading: (loading) => set({ loading }),

  updateItem: (id, data) =>
    set((state) => ({
      list: state.list.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
      current:
        state.current?.id === id
          ? { ...state.current, ...data }
          : state.current,
    })),

  removeItem: (id) =>
    set((state) => ({
      list: state.list.filter((item) => item.id !== id),
      current: state.current?.id === id ? null : state.current,
    })),
}))
