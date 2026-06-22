/**
 * Discussion post card component
 */

import { FC, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components'
import { Tag, Avatar } from '@/components'
import { CATEGORY_MAP, type DiscussionCategory } from '@/types/discussion'
import { timeAgo } from '@/utils/date'
import { formatCount } from '@/utils/format'
import styles from './PostCard.module.scss'

export interface PostCardProps {
  id: string
  title: string
  content: string
  category: DiscussionCategory
  author: {
    nickname: string
    avatar: string
    identityDisplay?: string
    ipProvince?: string
    isVerified?: boolean
  }
  likes: number
  isLiked: boolean
  commentCount: number
  views: number
  isPinned?: boolean
  isHot?: boolean
  createdAt: string
  onClick?: (id: string) => void
  onLike?: (id: string) => void
}

const PostCard: FC<PostCardProps> = ({
  id,
  title,
  content,
  category,
  author,
  likes,
  isLiked,
  commentCount,
  views,
  isPinned,
  isHot,
  createdAt,
  onClick,
  onLike,
}) => {
  const handleClick = useCallback(() => onClick?.(id), [id, onClick])

  const handleLike = useCallback(
    (e: ITouchEvent) => { e.stopPropagation(); onLike?.(id) },
    [id, onLike]
  )

  const cat = CATEGORY_MAP[category] || CATEGORY_MAP.other

  return (
    <View className={styles.card} onClick={handleClick}>
      {/* Pin/Hot badge */}
      {(isPinned || isHot) && (
        <View className={styles.badges}>
          {isPinned && <Tag type="primary" size="sm">📌 置顶</Tag>}
          {isHot && <Tag type="warning" size="sm">🔥 热门</Tag>}
        </View>
      )}

      {/* Author info */}
      <View className={styles.authorRow}>
        <Avatar src={author.avatar} name={author.nickname} size="sm" />
        <View className={styles.authorMeta}>
          <View className={styles.authorNameRow}>
            <Text className={styles.authorName} numberOfLines={1}>
              {author.identityDisplay || author.nickname}
            </Text>
            {author.isVerified && <Text className={styles.verifiedBadge}>✅</Text>}
          </View>
          <View className={styles.authorSub}>
            {author.ipProvince && (
              <Text className={styles.ipLocation}>{author.ipProvince}</Text>
            )}
            <Text className={styles.time}>{timeAgo(createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Title and content */}
      <Text className={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text className={styles.content} numberOfLines={3}>
        {content}
      </Text>

      {/* Category tag */}
      <View className={styles.categoryRow}>
        <Tag type="default" size="sm">{cat.icon} {cat.label}</Tag>
      </View>

      {/* Stats */}
      <View className={styles.footer}>
        <View className={styles.statItem}>
          <Text className={styles.statIcon}>👁</Text>
          <Text className={styles.statText}>{formatCount(views)}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statIcon}>💬</Text>
          <Text className={styles.statText}>{formatCount(commentCount)}</Text>
        </View>
        <View className={`${styles.statItem} ${styles.likeBtn}`} onClick={handleLike}>
          <Text className={styles.statIcon}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text className={styles.statText}>{formatCount(likes)}</Text>
        </View>
      </View>
    </View>
  )
}

export default PostCard
