/**
 * 我的活动 - 已报名的活动列表
 */

import { FC, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { Header, Card, Tag, Skeleton, EmptyState, Button } from '@/components'
import { ActivityCard } from '@/components/ActivityCard'
import { formatActivityTime } from '@/utils/date'
import styles from './my-activity.module.scss'

const TABS = [
  { key: 'upcoming', label: '即将开始' },
  { key: 'past', label: '已结束' },
]

const MyActivityPage: FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [loading, setLoading] = useState(true)
  const [upcomingList, setUpcomingList] = useState<any[]>([])
  const [pastList, setPastList] = useState<any[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setUpcomingList([])
      setPastList([])
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const currentList = activeTab === 'upcoming' ? upcomingList : pastList
  const isEmpty = !loading && currentList.length === 0

  return (
    <View className={styles.page}>
      <Header title="我的活动" showBack />

      <View className={styles.tabBar}>
        {TABS.map((tab) => (
          <View
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className={`${styles.tabText} ${activeTab === tab.key ? styles.tabTextActive : ''}`}>
              {tab.label}
            </Text>
            {activeTab === tab.key && <View className={styles.tabIndicator} />}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.content}>
        {loading ? (
          <Skeleton type="card" count={3} />
        ) : isEmpty ? (
          <EmptyState
            type="data"
            title={activeTab === 'upcoming' ? '还没有报名的活动' : '没有历史活动'}
            description={activeTab === 'upcoming' ? '去看看有哪些精彩活动' : '报名参加活动后，可以在这里查看'}
            actionText="去看看活动"
            onAction={() => Taro.switchTab({ url: '/pages/location/index' })}
          />
        ) : (
          currentList.map((item) => (
            <ActivityCard
              key={item.id}
              {...item}
              onClick={(id) => Taro.navigateTo({ url: `/pages/location/activity-detail?id=${id}` })}
            />
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default MyActivityPage
