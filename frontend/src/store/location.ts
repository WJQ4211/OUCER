/**
 * 校友据点状态管理
 */

import { create } from 'zustand'
import type { Location, Activity } from '@/types'

interface LocationState {
  /** 据点列表 */
  locations: Location[]
  /** 当前查看的据点 */
  currentLocation: Location | null
  /** 活动列表 */
  activities: Activity[]
  /** 当前查看的活动 */
  currentActivity: Activity | null
  /** 加载状态 */
  loading: boolean

  /** 设置据点列表 */
  setLocations: (locations: Location[]) => void
  /** 设置当前据点 */
  setCurrentLocation: (location: Location | null) => void
  /** 设置活动列表 */
  setActivities: (activities: Activity[]) => void
  /** 追加活动列表 */
  appendActivities: (activities: Activity[]) => void
  /** 设置当前活动 */
  setCurrentActivity: (activity: Activity | null) => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
  /** 更新活动参与人数 */
  updateActivityParticipants: (activityId: string, delta: number) => void
}

export const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  currentLocation: null,
  activities: [],
  currentActivity: null,
  loading: false,

  setLocations: (locations) => set({ locations }),

  setCurrentLocation: (location) => set({ currentLocation: location }),

  setActivities: (activities) => set({ activities }),

  appendActivities: (activities) =>
    set((state) => ({
      activities: [...state.activities, ...activities],
    })),

  setCurrentActivity: (activity) => set({ currentActivity: activity }),

  setLoading: (loading) => set({ loading }),

  updateActivityParticipants: (activityId, delta) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === activityId
          ? { ...a, participantCount: a.participantCount + delta }
          : a
      ),
      currentActivity:
        state.currentActivity?.id === activityId
          ? {
              ...state.currentActivity,
              participantCount: state.currentActivity.participantCount + delta,
            }
          : state.currentActivity,
    })),
}))
