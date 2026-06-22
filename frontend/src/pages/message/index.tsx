/**
 * Notification / Messages page
 */

import { FC, useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { PageLayout, Header, Skeleton, EmptyState, Badge } from '@/components'
import { getNotifications, markAsRead, markAllAsRead } from '@/services/api/message'
import { timeAgo, getDateGroup } from '@/utils/date'
import styles from './index.module.scss'

const MESSAGE_TABS = [
  { key: 'all', label: '全部' },
  { key: 'like', label: '点赞' },
  { key: 'comment', label: '评论' },
  { key: 'system', label: '系统' },
]

const MessagePage: FC = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [list, setList] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState({ total: 0, likes: 0, comments: 0, activities: 0, system: 0 })

  const fetchData = useCallback(async () => {
    try {
      const result = await getNotifications(1, 30, activeTab === 'all' ? undefined : activeTab)
      setList((result as any).list || [])
      if ((result as any).unreadCount) setUnreadCount((result as any).unreadCount)
    } catch {
      // Silently fail - show empty
      setList([])
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  useDidShow(() => {
    fetchData()
  })

  const handleNotificationClick = async (item: any) => {
    if (!item.read) {
      try { await markAsRead(item.id) } catch {}
      setList((prev) => prev.map((n) => n.id === item.id ? { ...n, read: true } : n))
    }
    if (item.target?.type === 'post' && item.target?.id) {
      Taro.navigateTo({ url: `/pages/recruitment/detail?id=${item.target.id}` })
    } else if (item.target?.type === 'activity' && item.target?.id) {
      Taro.navigateTo({ url: `/pages/location/activity-detail?id=${item.target.id}` })
    }
  }

  const handleMarkAllRead = async () => {
    try { await markAllAsRead(); fetchData() } catch {}
  }

  const getIcon = (type: string) => {
    const icons: Record<string, string> = { like: '❤️', comment: '💬', reply: '💬', activity: '🎉', system: '📢', verify: '✅' }
    return icons[type] || '🔔'
  }

  const grouped = list.reduce((groups: any[], n: any) => {
    const date = getDateGroup(n.createdAt)
    const last = groups[groups.length - 1]
    if (last && last.date === date) { last.items.push(n) } else { groups.push({ date, items: [n] }) }
    return groups
  }, [])

  return (
    <PageLayout activeTab="message" showTabBar messageBadge={unreadCount.total}>
      <Header title="消息中心" />

      <View className={styles.tabBar}>
        <ScrollView scrollX className={styles.tabScroll}>
          {MESSAGE_TABS.map((tab) => (
            <View key={tab.key} className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab.key)}>
              <Text className={`${styles.tabLabel} ${activeTab === tab.key ? styles.tabLabelActive : ''}`}>{tab.label}</Text>
            </View>
          ))}
        </ScrollView>
        {unreadCount.total > 0 && (
          <Text className={styles.markAllRead} onClick={handleMarkAllRead}>全部已读</Text>
        )}
      </View>

      {loading ? (
        <Skeleton type="avatar" count={5} />
      ) : list.length > 0 ? (
        <ScrollView scrollY className={styles.listContainer}>
          {grouped.map((group: any, gi: number) => (
            <View key={gi}>
              <Text className={styles.dateGroup}>{group.date}</Text>
              {group.items.map((item: any) => (
                <View key={item.id} className={`${styles.notifItem} ${!item.read ? styles.unread : ''}`} onClick={() => handleNotificationClick(item)}>
                  <View className={styles.notifAvatar}>
                    <Text className={styles.notifIcon}>{getIcon(item.type)}</Text>
                  </View>
                  <View className={styles.notifContent}>
                    <View className={styles.notifHeader}>
                      <Text className={styles.notifText} numberOfLines={2}>{item.content}</Text>
                      {!item.read && <Badge dot />}
                    </View>
                    <Text className={styles.notifTime}>{timeAgo(item.createdAt)}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <EmptyState type="data" title="暂无消息" description="当有人点赞、评论时，这里会有通知" />
      )}
    </PageLayout>
  )
}

export default MessagePage
