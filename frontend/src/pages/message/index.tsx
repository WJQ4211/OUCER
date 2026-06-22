/**
 * 消息/通知页
 */

import { FC, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { PageLayout, Header, Skeleton, EmptyState, Badge, Card } from '@/components'
import { getDateGroup } from '@/utils/date'
import styles from './index.module.scss'

/** 消息类型 Tab */
const MESSAGE_TABS = [
  { key: 'all', label: '全部' },
  { key: 'like', label: '点赞' },
  { key: 'comment', label: '评论' },
  { key: 'application', label: '投递' },
  { key: 'activity', label: '活动' },
]

/** 模拟通知数据 */
const MOCK_NOTIFICATIONS: any[] = []

const MessagePage: FC = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState<any[]>(MOCK_NOTIFICATIONS)

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([])
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  usePullDownRefresh(() => {
    Taro.stopPullDownRefresh()
  })

  const handleNotificationClick = (notification: any) => {
    // 跳转到目标页面
    if (notification.target?.type === 'recruitment') {
      Taro.navigateTo({
        url: `/pages/recruitment/detail?id=${notification.target.id}`,
      })
    } else if (notification.target?.type === 'activity') {
      Taro.navigateTo({
        url: `/pages/location/activity-detail?id=${notification.target.id}`,
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      like: '❤️',
      comment: '💬',
      application: '📄',
      activity: '🎉',
      system: '📢',
    }
    return icons[type] || '🔔'
  }

  // 按日期分组
  const groupedNotifications = notifications.reduce((groups: any[], notification) => {
    const dateGroup = getDateGroup(notification.createdAt)
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.date === dateGroup) {
      lastGroup.items.push(notification)
    } else {
      groups.push({ date: dateGroup, items: [notification] })
    }
    return groups
  }, [])

  return (
    <PageLayout activeTab="message" showTabBar>
      <Header title="消息中心" />

      {/* 消息类型 Tab */}
      <View className={styles.tabBar}>
        <ScrollView scrollX className={styles.tabScroll}>
          {MESSAGE_TABS.map((tab) => (
            <View
              key={tab.key}
              className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text
                className={`${styles.tabLabel} ${activeTab === tab.key ? styles.tabLabelActive : ''}`}
              >
                {tab.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 通知列表 */}
      {loading ? (
        <Skeleton type="avatar" count={5} />
      ) : notifications.length > 0 ? (
        <ScrollView scrollY className={styles.listContainer}>
          {groupedNotifications.map((group, groupIdx) => (
            <View key={groupIdx}>
              <Text className={styles.dateGroup}>{group.date}</Text>
              {group.items.map((item: any) => (
                <View
                  key={item.id}
                  className={`${styles.notifItem} ${!item.read ? styles.unread : ''}`}
                  onClick={() => handleNotificationClick(item)}
                >
                  <View className={styles.notifAvatar}>
                    <Text className={styles.notifIcon}>
                      {getNotificationIcon(item.type)}
                    </Text>
                  </View>
                  <View className={styles.notifContent}>
                    <View className={styles.notifHeader}>
                      <Text className={styles.notifActor} numberOfLines={1}>
                        {item.actor?.nickname || '系统'}
                      </Text>
                      {!item.read && <Badge dot />}
                    </View>
                    <Text className={styles.notifText} numberOfLines={2}>
                      {item.content}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <EmptyState
          type="data"
          title="暂无消息"
          description="当有人点赞、评论或投递时，会在这里通知你"
        />
      )}
    </PageLayout>
  )
}

export default MessagePage
