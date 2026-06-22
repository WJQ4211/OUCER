/**
 * Activity detail with comments
 */

import { FC, useEffect, useState } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Header, Card, Button, Avatar, Skeleton, EmptyState } from '@/components'
import { getActivityDetail, joinActivity, addActivityComment } from '@/services/api/location'
import { formatActivityTime } from '@/utils/date'
import { timeAgo } from '@/utils/date'
import styles from './activity-detail.module.scss'

const ActivityDetailPage: FC = () => {
  const router = useRouter()
  const { activityId: id } = router.params
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<any>(null)
  const [joining, setJoining] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  const loadDetail = async (aid: string) => {
    setLoading(true)
    try {
      const d = await getActivityDetail(aid)
      setDetail(d)
    } catch {
      setDetail(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadDetail(id as string)
  }, [id])

  const handleJoin = async () => {
    if (!id) return
    setJoining(true)
    try {
      await joinActivity(id as string)
      Taro.showToast({ title: '报名成功', icon: 'success' })
      loadDetail(id as string)
    } catch {
      Taro.showToast({ title: '报名失败', icon: 'none' })
    } finally {
      setJoining(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !id) return
    setSubmittingComment(true)
    try {
      await addActivityComment(id as string, commentText.trim())
      setCommentText('')
      Taro.showToast({ title: '评论成功', icon: 'success' })
      loadDetail(id as string)
    } catch {
      Taro.showToast({ title: '评论失败', icon: 'none' })
    } finally {
      setSubmittingComment(false)
    }
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
        <EmptyState type="data" title="活动不存在" actionText="返回" onAction={() => Taro.navigateBack()} />
      </View>
    )
  }

  const isFull = detail.participantCount >= detail.capacity
  const comments = detail.comments || []

  return (
    <View className={styles.page}>
      <Header title="活动详情" showBack />
      <ScrollView scrollY className={styles.content}>
        <View className={styles.cover}>
          <Text className={styles.coverEmoji}>🎉</Text>
        </View>

        <Card className={styles.infoCard}>
          <Text className={styles.title}>{detail.title}</Text>
          <View className={styles.meta}>
            <View className={styles.metaRow}>
              <Text className={styles.metaIcon}>🕐</Text>
              <Text className={styles.metaText}>{formatActivityTime(detail.startTime, detail.endTime)}</Text>
            </View>
            <View className={styles.metaRow}>
              <Text className={styles.metaIcon}>📍</Text>
              <Text className={styles.metaText}>{detail.address}</Text>
            </View>
            <View className={styles.metaRow}>
              <Text className={styles.metaIcon}>👥</Text>
              <Text className={styles.metaText}>{detail.participantCount}/{detail.capacity}人{isFull && <Text className={styles.fullBadge}>（已满）</Text>}</Text>
            </View>
          </View>
        </Card>

        <Card className={styles.descCard}>
          <Text className={styles.sectionTitle}>活动详情</Text>
          <Text className={styles.desc}>{detail.description}</Text>
        </Card>

        <Card className={styles.organizerCard}>
          <Text className={styles.sectionTitle}>发起人</Text>
          <View className={styles.organizerRow}>
            <Avatar name={detail.organizer?.nickname || '?'} />
            <Text className={styles.organizerName}>{detail.organizer?.identityDisplay || detail.organizer?.nickname}</Text>
          </View>
        </Card>

        {/* Comments */}
        <Card className={styles.commentCard}>
          <Text className={styles.sectionTitle}>评论 ({comments.length})</Text>
          {comments.length > 0 ? (
            comments.map((c: any) => (
              <View key={c.id} className={styles.commentItem}>
                <View className={styles.commentHeader}>
                  <Avatar name={c.author?.nickname || '?'} size="sm" />
                  <Text className={styles.commentName}>{c.author?.identityDisplay || c.author?.nickname}</Text>
                  <Text className={styles.commentTime}>{timeAgo(c.createdAt)}</Text>
                </View>
                <Text className={styles.commentContent}>{c.content}</Text>
              </View>
            ))
          ) : (
            <EmptyState icon="💬" title="暂无评论" description="来发表第一条评论吧" />
          )}
        </Card>

        <View className={styles.bottomSpace} />
      </ScrollView>

      {/* Bottom bar */}
      <View className={styles.bottomBar}>
        {!isFull ? (
          <Button type="primary" size="md" loading={joining} onClick={handleJoin}>立即报名</Button>
        ) : (
          <Button type="primary" size="md" disabled>已满员</Button>
        )}
        <View className={styles.commentInputWrap}>
          <Input
            className={styles.commentInput}
            type="text" placeholder="写评论..." value={commentText}
            onInput={(e) => setCommentText(e.detail.value)}
            confirmType="send" onConfirm={handleSubmitComment}
          />
        </View>
        <Button type="secondary" size="sm" loading={submittingComment} disabled={!commentText.trim()} onClick={handleSubmitComment}>发送</Button>
      </View>
    </View>
  )
}

export default ActivityDetailPage
