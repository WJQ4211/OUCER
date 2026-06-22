/**
 * Home page
 */

import { FC, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { PageLayout, Skeleton, EmptyState, Card } from '@/components'
import { getSafeAreaInfo } from '@/utils/safeArea'
import styles from './index.module.scss'

const QUICK_ENTRIES = [
  { key: 'discuss', label: '校友论坛', icon: '💬', path: '/pages/recruitment/index' },
  { key: 'location', label: '校友据点', icon: '📍', path: '/pages/location/index' },
  { key: 'activity', label: '近期活动', icon: '🎉', path: '/pages/location/index' },
  { key: 'profile', label: '我的', icon: '👤', path: '/pages/profile/index' },
]

const HomePage: FC = () => {
  const [loading, setLoading] = useState(true)
  const [statusBarH, setStatusBarH] = useState(20)

  useEffect(() => {
    setStatusBarH(getSafeAreaInfo().statusBarHeight)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleEntryClick = (entry: typeof QUICK_ENTRIES[number]) => {
    if (entry.path.startsWith('/pages/')) {
      Taro.switchTab({ url: entry.path }).catch(() => {
        Taro.navigateTo({ url: entry.path })
      })
    }
  }

  return (
    <PageLayout activeTab="index" showTabBar>
      {/* Banner with safe area */}
      <View className={styles.banner} style={{ paddingTop: `${statusBarH + 16}px` }}>
        <View className={styles.bannerContent}>
          <Text className={styles.bannerTitle}>海大人校友论坛</Text>
          <Text className={styles.bannerSubtitle}>连接校友 · 共享资源 · 共创未来</Text>
        </View>
      </View>

      {/* Quick entries */}
      <View className={styles.quickEntries}>
        {QUICK_ENTRIES.map((entry) => (
          <View key={entry.key} className={styles.entryItem} onClick={() => handleEntryClick(entry)}>
            <View className={styles.entryIcon}>
              <Text className={styles.entryEmoji}>{entry.icon}</Text>
            </View>
            <Text className={styles.entryLabel}>{entry.label}</Text>
          </View>
        ))}
      </View>

      {/* Recent discussions */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>💬 最新讨论</Text>
          <Text className={styles.sectionMore} onClick={() => Taro.switchTab({ url: '/pages/recruitment/index' })}>
            查看全部 →
          </Text>
        </View>
        {loading ? (
          <Skeleton type="list" count={3} />
        ) : (
          <Card className={styles.emptyCard}>
            <EmptyState
              type="data"
              title="还没有讨论"
              description="成为第一个发起讨论的校友"
              actionText="发起讨论"
              onAction={() => Taro.navigateTo({ url: '/pages/recruitment/publish' })}
            />
          </Card>
        )}
      </View>

      {/* Recent activities */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📅 近期活动</Text>
          <Text className={styles.sectionMore} onClick={() => Taro.switchTab({ url: '/pages/location/index' })}>
            查看全部 →
          </Text>
        </View>
        {loading ? (
          <Skeleton type="card" count={2} />
        ) : (
          <Card className={styles.emptyCard}>
            <EmptyState
              type="data"
              title="暂无活动"
              description="近期没有校友活动"
              actionText="发起活动"
              onAction={() => Taro.navigateTo({ url: '/pages/location/publish-activity' })}
            />
          </Card>
        )}
      </View>
    </PageLayout>
  )
}

export default HomePage
