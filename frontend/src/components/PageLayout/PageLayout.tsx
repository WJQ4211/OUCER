/**
 * 页面布局容器
 * 提供统一的页面结构：Header + 内容区 + TabBar
 */

import { FC, ReactNode } from 'react'
import { View } from '@tarojs/components'
import TabBar from '@/components/TabBar/TabBar'
import styles from './PageLayout.module.scss'

export interface PageLayoutProps {
  /** 页面内容 */
  children: ReactNode
  /** 当前激活的 tab */
  activeTab?: string
  /** 是否显示 TabBar */
  showTabBar?: boolean
  /** 消息未读数 */
  messageBadge?: number
  /** 自定义 className */
  className?: string
  /** 是否使用安全区域（顶部） */
  safeTop?: boolean
}

const PageLayout: FC<PageLayoutProps> = ({
  children,
  activeTab,
  showTabBar = false,
  messageBadge,
  className = '',
  safeTop = false,
}) => {
  return (
    <View
      className={`${styles.layout} ${safeTop ? styles.safeTop : ''} ${className}`}
    >
      {/* 内容区 */}
      <View className={styles.content}>{children}</View>

      {/* TabBar */}
      {showTabBar && (
        <TabBar activeKey={activeTab} messageBadge={messageBadge} />
      )}
    </View>
  )
}

export default PageLayout
