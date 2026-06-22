/**
 * Home page - shows latest discussions and activities
 */

import { FC, useEffect, useState, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { PageLayout, Skeleton, EmptyState, Card } from '@/components'
import { PostCard } from '@/components/PostCard'
import { ActivityCard } from '@/components/ActivityCard'
import { getDiscussionList } from '@/services/api/recruitment'
import { getActivityList } from '@/services/api/location'
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
  const [discussions, setDiscussions] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const fetching = useRef(false)

  const fetchData = async () => {
    if (fetching.current) return
    fetching.current = true
    setLoading(true)
    try {
      const [discRes, actRes] = await Promise.all([
        getDiscussionList(1, 5).catch(() => ({ list: [] } as any)),
        getActivityList(undefined, 1, 5).catch(() => ({ list: [] } as any)),
      ])
      setDiscussions(discRes.list || [])
      setActivities(actRes.list || [])
    } catch {
      // keep empty arrays
    } finally {
      setLoading(false)
      fetching.current = false
    }
  }

  useEffect(() => {
    setStatusBarH(getSafeAreaInfo().statusBarHeight)
    fetchData()
  }, [])

  useDidShow(() => {
    fetchData()
  })

  const handleEntryClick = (entry: typeof QUICK_ENTRIES[number]) => {
    if (entry.path.startsWith('/pages/')) {
      Taro.switchTab({ url: entry.path }).catch(() => {
        Taro.navigateTo({ url: entry.path })
      })
    }
  }

  const handlePostClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/recruitment/detail?id=${id}` })
  }

  const handleActivityClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/location/activity-detail?id=${id}` })
  }

  return (
    <PageLayout activeTab="index" showTabBar>
      <View className={styles.banner} style={{ paddingTop: `${statusBarH + 16}px` }}>
        <View className={styles.bannerContent}>
          <Text className={styles.bannerTitle}>海大人校友论坛</Text>
          <Text className={styles.bannerSubtitle}>连接校友 · 共享资源 · 共创未来</Text>
        </View>
      </View>

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
        {loading && discussions.length === 0 ? (
          <Skeleton type="list" count={3} />
        ) : discussions.length > 0 ? (
          discussions.map((post: any) => (
            <PostCard key={post.id} {...post} onClick={handlePostClick} />
          ))
        ) : (
          <Card className={styles.emptyCard}>
            <EmptyState type="data" title="还没有讨论" description="成为第一个发起讨论的校友" actionText="发起讨论"
              onAction={() => Taro.navigateTo({ url: '/pages/recruitment/publish' })} />
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
        {loading && activities.length === 0 ? (
          <Skeleton type="card" count={2} />
        ) : activities.length > 0 ? (
          activities.map((a: any) => (
            <ActivityCard key={a.id} {...a} onClick={handleActivityClick} />
          ))
        ) : (
          <Card className={styles.emptyCard}>
            <EmptyState type="data" title="暂无活动" description="近期没有校友活动" actionText="发起活动"
              onAction={() => Taro.navigateTo({ url: '/pages/location/publish-activity' })} />
          </Card>
        )}
      </View>
    </PageLayout>
  )
}

export default HomePage
