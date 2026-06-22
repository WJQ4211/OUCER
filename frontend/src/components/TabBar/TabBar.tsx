/**
 * 自定义底部 TabBar 导航组件
 */

import { FC, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './TabBar.module.scss'

/** Tab 项定义 */
export interface TabItem {
  key: string
  label: string
  icon: string // emoji 或 icon 代码
  path: string
  badge?: number
}

/** TabBar 默认配置 */
export const TAB_LIST: TabItem[] = [
  { key: 'index', label: '首页', icon: '🏠', path: '/pages/index/index' },
  { key: 'recruitment', label: '论坛', icon: '💬', path: '/pages/recruitment/index' },
  { key: 'location', label: '据点', icon: '📍', path: '/pages/location/index' },
  { key: 'message', label: '消息', icon: '🔔', path: '/pages/message/index' },
  { key: 'profile', label: '我的', icon: '👤', path: '/pages/profile/index' },
]

export interface TabBarProps {
  /** 当前激活的 tab key */
  activeKey?: string
  /** 消息未读数 */
  messageBadge?: number
}

const TabBar: FC<TabBarProps> = ({ activeKey = 'index', messageBadge }) => {
  const handleTabClick = useCallback((item: TabItem) => {
    Taro.switchTab({ url: item.path }).catch(() => {
      // fallback: navigate
      Taro.navigateTo({ url: item.path }).catch(() => {
        Taro.redirectTo({ url: item.path })
      })
    })
  }, [])

  return (
    <View className={styles.tabbar}>
      {TAB_LIST.map((item) => {
        const isActive = item.key === activeKey
        const showBadge =
          item.key === 'message' && messageBadge && messageBadge > 0

        return (
          <View
            key={item.key}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => handleTabClick(item)}
          >
            <View className={styles.iconWrap}>
              <Text className={styles.icon}>{item.icon}</Text>
              {showBadge && (
                <View className={styles.badge}>
                  <Text className={styles.badgeText}>
                    {messageBadge > 99 ? '99+' : messageBadge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              className={`${styles.label} ${isActive ? styles.activeLabel : ''}`}
            >
              {item.label}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

export default TabBar
