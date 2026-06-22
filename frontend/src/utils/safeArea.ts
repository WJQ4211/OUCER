/**
 * Safe area / Status bar utility
 * Handles Dynamic Island, notch, and status bar height across devices
 */

import Taro from '@tarojs/taro'

/** Cached safe area info */
let _safeAreaInfo: {
  statusBarHeight: number
  navBarHeight: number
  safeTop: number
  safeBottom: number
  isNotch: boolean
} | null = null

/**
 * Get safe area dimensions
 * Call once on app launch and cache globally
 */
export const getSafeAreaInfo = () => {
  if (_safeAreaInfo) return _safeAreaInfo

  const systemInfo = Taro.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 20

  // Calculate navbar height based on capsule button position
  let navBarHeight = 44 // default
  try {
    const menuButtonInfo = (wx as any).getMenuButtonBoundingClientRect?.()
    if (menuButtonInfo) {
      // Nav bar height = capsule bottom - status bar + capsule margin-bottom
      navBarHeight = (menuButtonInfo.bottom - statusBarHeight) + (menuButtonInfo.top - statusBarHeight)
    }
  } catch {
    // Fallback: use system info
    if (systemInfo.platform === 'android') {
      navBarHeight = 48
    } else {
      navBarHeight = 44
    }
  }

  const safeTop = statusBarHeight + navBarHeight
  const isNotch = statusBarHeight > 20

  // Use system safe area for bottom
  const safeBottom = systemInfo.safeArea
    ? systemInfo.screenHeight - systemInfo.safeArea.bottom
    : 0

  _safeAreaInfo = {
    statusBarHeight,
    navBarHeight,
    safeTop,
    safeBottom,
    isNotch,
  }

  return _safeAreaInfo
}

/**
 * Get CSS var string for header padding
 */
export const getHeaderPaddingStyle = () => {
  const { statusBarHeight } = getSafeAreaInfo()
  return {
    paddingTop: `${statusBarHeight}px`,
  }
}

/**
 * Get header height including status bar
 */
export const getHeaderHeight = () => {
  const { safeTop } = getSafeAreaInfo()
  return safeTop
}
