/**
 * 本地存储工具
 * 封装 Taro 存储 API
 */

import Taro from '@tarojs/taro'

const PREFIX = 'haidaren_'

/**
 * 设置存储
 */
export const setStorage = async <T>(key: string, value: T): Promise<void> => {
  try {
    await Taro.setStorage({
      key: PREFIX + key,
      data: JSON.stringify(value),
    })
  } catch (error) {
    console.error(`[Storage] set ${key} failed:`, error)
  }
}

/**
 * 读取存储
 */
export const getStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const { data } = await Taro.getStorage({ key: PREFIX + key })
    return JSON.parse(data) as T
  } catch {
    return null
  }
}

/**
 * 删除存储
 */
export const removeStorage = async (key: string): Promise<void> => {
  try {
    await Taro.removeStorage({ key: PREFIX + key })
  } catch (error) {
    console.error(`[Storage] remove ${key} failed:`, error)
  }
}

/**
 * 清除所有本应用存储
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    const info = await Taro.getStorageInfo()
    const appKeys = ((info as any).keys || []).filter((k: string) => k.startsWith(PREFIX))
    for (const key of appKeys) {
      await Taro.removeStorage({ key })
    }
  } catch (error) {
    console.error('[Storage] clear all failed:', error)
  }
}

// 常用存储 key
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'user_info',
  USER_SETTINGS: 'user_settings',
  RECENT_SEARCH: 'recent_search',
  BROWSING_HISTORY: 'browsing_history',
} as const
