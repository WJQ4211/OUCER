/**
 * 活动详情页
 */

import { FC, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Header, Card, Tag, Button, Avatar, Skeleton, EmptyState } from '@/components'
import { formatActivityTime } from '@/utils/date'
import styles from './activity-detail.module.scss'

const ActivityDetailPage: FC = () => {
  const router = useRouter()
  const { activityId: id } = router.params
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<any>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDetail(null)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [id])

  const handleJoin = () => {
    setJoining(true)
    setTimeout(() => {
      setJoining(false)
      Taro.showToast({ title: '报名成功', icon: 'success' })
    }, 1000)
  }

  if (loading) {
    return (
      <View className={styles.page}>
        <Header title="活动详情" showBack />
        <Skeleton type="card" count={2} />
      </View>
    )
  }

  if (!detail) {
    return (
      <View className={styles.page}>
        <Header title="活动详情" showBack />
        <EmptyState
          type="data"
          title="活动不存在"
          description="该活动可能已结束或取消"
          actionText="返回"
          onAction={() => Taro.navigateBack()}
        />
      </View>
    )
  }

  const isFull = detail.participantCount >= detail.capacity

  return (
    <View className={styles.page}>
      <Header title="活动详情" showBack />
      <ScrollView scrollY className={styles.content}>
        {/* 封面 */}
        <View className={styles.cover}>
          <Text className={styles.coverEmoji}>🎉</Text>
        </View>

        <Card className={styles.infoCard}>
          <Text className={styles.title}>{detail.title}</Text>
          <View className={styles.meta}>
            <View className={styles.metaRow}>
              <Text className={styles.metaIcon}>🕐</Text>
              <Text className={styles.metaText}>
                {formatActivityTime(detail.startTime, detail.endTime)}
              </Text>
            </View>
            <View className={styles.metaRow}>
              <Text className={styles.metaIcon}>📍</Text>
              <Text className={styles.metaText}>{detail.address}</Text>
            </View>
            <View className={styles.metaRow}>
              <Text className={styles.metaIcon}>👥</Text>
              <Text className={styles.metaText}>
                {detail.participantCount}/{detail.capacity}人
                {isFull && <Text className={styles.fullBadge}>（已满）</Text>}
              </Text>
            </View>
          </View>
        </Card>

        <Card className={styles.descCard}>
          <Text className={styles.sectionTitle}>活动详情</Text>
          <Text className={styles.desc}>{detail.description}</Text>
        </Card>

        {/* 组织者 */}
        <Card className={styles.organizerCard}>
          <Text className={styles.sectionTitle}>发起人</Text>
          <View className={styles.organizerRow}>
            <Avatar name={detail.organizer?.nickname || '?'} />
            <Text className={styles.organizerName}>
              {detail.organizer?.nickname || '未知用户'}
            </Text>
          </View>
        </Card>

        <View className={styles.bottomSpace} />
      </ScrollView>

      {/* 底部报名栏 */}
      <View className={styles.bottomBar}>
        <View className={styles.participantInfo}>
          <Text className={styles.participantCount}>
            已有 {detail.participantCount} 人报名
          </Text>
        </View>
        <Button
          type="primary"
          size="md"
          disabled={isFull}
          loading={joining}
          onClick={handleJoin}
        >
          {isFull ? '已满员' : '立即报名'}
        </Button>
      </View>
    </View>
  )
}

export default ActivityDetailPage
