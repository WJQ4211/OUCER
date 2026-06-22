/**
 * 校友据点相关 Hooks
 */

import { useCallback } from 'react'
import Taro from '@tarojs/taro'
import { useLocationStore } from '@/store/location'
import {
  getLocationList,
  getLocationDetail,
  getActivityList,
  getActivityDetail,
  joinActivity,
  leaveActivity,
  publishActivity,
} from '@/services/api/location'
import type { ActivityForm } from '@/types'

/**
 * 据点列表 Hook
 */
export const useLocationList = () => {
  const { locations, loading, setLocations, setLoading } = useLocationStore()

  /** 刷新据点列表 */
  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const list = await getLocationList()
      setLocations(list)
    } catch (error) {
      console.error('获取据点列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [setLocations, setLoading])

  return {
    locations,
    loading,
    refresh,
  }
}

/**
 * 据点详情 Hook
 */
export const useLocationDetail = () => {
  const { currentLocation, setCurrentLocation, setLoading } = useLocationStore()

  /** 加载据点详情 */
  const loadDetail = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const detail = await getLocationDetail(id)
        setCurrentLocation(detail)
      } catch (error) {
        console.error('获取据点详情失败:', error)
        Taro.showToast({ title: '加载失败', icon: 'error' })
      } finally {
        setLoading(false)
      }
    },
    [setCurrentLocation, setLoading]
  )

  return {
    location: currentLocation,
    loadDetail,
  }
}

/**
 * 活动相关 Hook
 */
export const useActivity = () => {
  const {
    activities,
    currentActivity,
    loading,
    setActivities,
    appendActivities,
    setCurrentActivity,
    setLoading,
    updateActivityParticipants,
  } = useLocationStore()

  /** 刷新活动列表 */
  const refreshActivities = useCallback(
    async (locationId?: string) => {
      setLoading(true)
      try {
        const result = await getActivityList(locationId)
        setActivities(result.list)
      } catch (error) {
        console.error('获取活动列表失败:', error)
      } finally {
        setLoading(false)
      }
    },
    [setActivities, setLoading]
  )

  /** 加载活动详情 */
  const loadActivityDetail = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const detail = await getActivityDetail(id)
        setCurrentActivity(detail)
      } catch (error) {
        console.error('获取活动详情失败:', error)
        Taro.showToast({ title: '加载失败', icon: 'error' })
      } finally {
        setLoading(false)
      }
    },
    [setCurrentActivity, setLoading]
  )

  /** 报名活动 */
  const handleJoin = useCallback(
    async (activityId: string) => {
      try {
        await joinActivity(activityId)
        updateActivityParticipants(activityId, 1)
        Taro.showToast({ title: '报名成功', icon: 'success' })
      } catch {
        Taro.showToast({ title: '报名失败', icon: 'error' })
      }
    },
    [updateActivityParticipants]
  )

  /** 取消报名 */
  const handleLeave = useCallback(
    async (activityId: string) => {
      const confirm = await Taro.showModal({
        title: '取消报名',
        content: '确定要取消报名吗？',
      })
      if (!confirm.confirm) return
      try {
        await leaveActivity(activityId)
        updateActivityParticipants(activityId, -1)
        Taro.showToast({ title: '已取消报名', icon: 'success' })
      } catch {
        Taro.showToast({ title: '操作失败', icon: 'error' })
      }
    },
    [updateActivityParticipants]
  )

  /** 发布活动 */
  const handlePublish = useCallback(async (data: ActivityForm) => {
    try {
      await publishActivity(data)
      Taro.showToast({ title: '活动发布成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      return true
    } catch (error) {
      console.error('发布活动失败:', error)
      return false
    }
  }, [])

  return {
    activities,
    currentActivity,
    loading,
    refreshActivities,
    loadActivityDetail,
    handleJoin,
    handleLeave,
    handlePublish,
  }
}
