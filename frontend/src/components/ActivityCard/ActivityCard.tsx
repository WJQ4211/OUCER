/**
 * 活动卡片业务组件
 */

import { FC, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Tag } from '@/components'
import { formatActivityTime, isExpired } from '@/utils/date'
import styles from './ActivityCard.module.scss'

export interface ActivityCardProps {
  id: string
  title: string
  description: string
  category: string
  coverImage?: string
  startTime: string
  endTime: string
  address: string
  capacity: number
  participantCount: number
  status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled'
  organizer?: {
    nickname: string
    avatar: string
  }
  onClick?: (id: string) => void
  onJoin?: (id: string) => void
}

const ActivityCard: FC<ActivityCardProps> = ({
  id,
  title,
  description,
  category,
  startTime,
  endTime,
  address,
  capacity,
  participantCount,
  status,
  organizer,
  onClick,
  onJoin,
}) => {
  const handleClick = useCallback(() => {
    onClick?.(id)
  }, [id, onClick])

  const handleJoin = useCallback(() => {
    onJoin?.(id)
  }, [id, onJoin])

  const isFull = participantCount >= capacity
  const isEnded = status === 'ended' || status === 'cancelled'
  const remaining = capacity - participantCount

  const statusConfig: Record<string, { label: string; type: 'primary' | 'success' | 'warning' | 'error' | 'default' }> = {
    upcoming: { label: '即将开始', type: 'primary' },
    ongoing: { label: '进行中', type: 'success' },
    ended: { label: '已结束', type: 'default' },
    cancelled: { label: '已取消', type: 'error' },
  }

  const statusInfo = statusConfig[status] || { label: status, type: 'default' as const }

  return (
    <View className={styles.card} onClick={handleClick}>
      {/* 封面图 */}
      <View className={styles.cover}>
        <View className={styles.coverPlaceholder}>
          <Text className={styles.coverEmoji}>
            {category === '运动' ? '🏃' : category === '聚餐' ? '🍽️' : '🎉'}
          </Text>
        </View>
        <View className={styles.statusBadge}>
          <Tag type={statusInfo.type} size="sm">
            {statusInfo.label}
          </Tag>
        </View>
      </View>

      {/* 信息区 */}
      <View className={styles.body}>
        <Text className={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text className={styles.desc} numberOfLines={2}>
          {description}
        </Text>

        <View className={styles.meta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>🕐</Text>
            <Text className={styles.metaText} numberOfLines={1}>
              {formatActivityTime(startTime, endTime)}
            </Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>📍</Text>
            <Text className={styles.metaText} numberOfLines={1}>
              {address}
            </Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>👥</Text>
            <Text className={styles.metaText}>
              {participantCount}/{capacity}人
              {isFull && <Text className={styles.fullText}>（已满）</Text>}
            </Text>
          </View>
        </View>

        {/* 报名按钮 */}
        <View className={styles.footer}>
          {organizer && (
            <Text className={styles.organizer} numberOfLines={1}>
              发起人：{organizer.nickname}
            </Text>
          )}
          {!isEnded && (
            <Button
              type="primary"
              size="sm"
              shape="round"
              disabled={isFull}
              onClick={handleJoin}
            >
              {isFull ? '已满员' : '立即报名'}
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}

export default ActivityCard
