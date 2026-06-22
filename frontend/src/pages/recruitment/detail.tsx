/**
 * Discussion post detail
 */

import { FC, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Header, Card, Tag, Button, Avatar, Skeleton, EmptyState } from '@/components'
import { useDiscussionDetail } from '@/hooks/useRecruitment'
import { CATEGORY_MAP } from '@/types/discussion'
import { timeAgo } from '@/utils/date'
import { formatCount } from '@/utils/format'
import styles from './detail.module.scss'

const PostDetailPage: FC = () => {
  const router = useRouter()
  const { id } = router.params
  const { post, loading, load, handleLike } = useDiscussionDetail()

  useEffect(() => {
    if (id) load(id as string)
  }, [id])

  if (loading) {
    return (
      <View className={styles.page}>
        <Header title="帖子详情" showBack />
        <Skeleton type="card" count={1} />
      </View>
    )
  }

  if (!post) {
    return (
      <View className={styles.page}>
        <Header title="帖子详情" showBack />
        <EmptyState type="data" title="帖子不存在" description="该帖子可能已被删除" />
        <View className={styles.emptyAction}>
          <Button type="primary" onClick={() => Taro.navigateBack()}>返回列表</Button>
        </View>
      </View>
    )
  }

  const cat = CATEGORY_MAP[post.category as keyof typeof CATEGORY_MAP]
  const author = post.author || {}

  return (
    <View className={styles.page}>
      <Header title="帖子详情" showBack />
      <ScrollView scrollY className={styles.content}>
        {/* Author + Post */}
        <Card className={styles.infoCard}>
          <View className={styles.authorRow}>
            <Avatar src={author.avatar} name={author.nickname || '?'} size="md" />
            <View className={styles.authorMeta}>
              <View className={styles.authorNameRow}>
                <Text className={styles.authorName}>{author.identityDisplay || author.nickname}</Text>
                {author.isVerified && <Text className={styles.verifiedBadge}>✅</Text>}
              </View>
              <View className={styles.authorSub}>
                {author.ipProvince && <Text className={styles.ipText}>IP: {author.ipProvince}</Text>}
                <Text className={styles.timeText}>{timeAgo(post.createdAt)}</Text>
              </View>
            </View>
          </View>

          <Text className={styles.title}>{post.title}</Text>

          <View className={styles.tagRow}>
            {cat && <Tag type="default" size="sm">{cat.icon} {cat.label}</Tag>}
            {post.isPinned && <Tag type="primary" size="sm">📌 置顶</Tag>}
            {post.isHot && <Tag type="warning" size="sm">🔥 热门</Tag>}
          </View>

          <Text className={styles.body}>{post.content}</Text>

          <View className={styles.stats}>
            <Text className={styles.statItem}>👁 {formatCount(post.views || 0)}</Text>
            <Text className={styles.statItem}>💬 {formatCount(post.commentCount || 0)}</Text>
          </View>
        </Card>

        {/* Comments */}
        <Card className={styles.commentCard}>
          <Text className={styles.sectionTitle}>评论 ({post.commentCount || 0})</Text>
          {(post as any).comments?.length > 0 ? (
            (post as any).comments.map((c: any) => (
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
        <Button type="secondary" shape="round" size="sm" onClick={handleLike}>
          {post.isLiked ? '❤️' : '🤍'} {formatCount(post.likes)}
        </Button>
        <Button type="primary" shape="round" size="sm" onClick={() => Taro.showToast({ title: '评论功能开发中', icon: 'none' })}>
          💬 写评论
        </Button>
      </View>
    </View>
  )
}

export default PostDetailPage
