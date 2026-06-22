/**
 * Discussion forum - post list page
 */

import { FC, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useReachBottom, usePullDownRefresh, useDidShow } from '@tarojs/taro'
import { PageLayout, Header, Tag, Button, Skeleton, EmptyState } from '@/components'
import { PostCard } from '@/components/PostCard'
import { useDiscussionList } from '@/hooks/useRecruitment'
import type { DiscussionCategory } from '@/types/discussion'
import styles from './index.module.scss'

const CATEGORY_FILTERS: { key: DiscussionCategory | ''; label: string }[] = [
  { key: '', label: '全部' },
  { key: 'company', label: '🏢 聊聊公司' },
  { key: 'career', label: '🎓 学长去向' },
  { key: 'study', label: '📚 深造/考研' },
  { key: 'life', label: '🏫 校园生活' },
  { key: 'other', label: '💬 其他' },
]

const ForumPage: FC = () => {
  const {
    list, loading, hasMore, filter,
    refresh, loadMore, setFilter, handleLike,
  } = useDiscussionList()
  const refreshing = useRef(false)
  const mounted = useRef(false)

  const doRefresh = async (f?: any) => {
    if (refreshing.current) return
    refreshing.current = true
    try {
      await refresh(f)
    } finally {
      refreshing.current = false
    }
  }

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      doRefresh()
    }
  }, [])

  useDidShow(() => {
    doRefresh()
  })

  usePullDownRefresh(() => {
    doRefresh().finally(() => Taro.stopPullDownRefresh())
  })

  useReachBottom(() => {
    if (!loading && hasMore) loadMore()
  })

  const handleCreatePost = () => {
    Taro.navigateTo({ url: '/pages/recruitment/publish' })
  }

  const handlePostClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/recruitment/detail?id=${id}` })
  }

  const handleCategoryChange = (cat: string) => {
    const nextFilter = cat ? { category: cat as DiscussionCategory } : {}
    setFilter(nextFilter)
    doRefresh(nextFilter)
  }

  return (
    <PageLayout activeTab="recruitment" showTabBar>
      <Header title="校友论坛" subtitle="交流讨论 · 互相帮助" />

      <View className={styles.filterBar}>
        <ScrollView scrollX className={styles.filterScroll}>
          {CATEGORY_FILTERS.map((f) => (
            <Tag
              key={f.key}
              type={filter.category === f.key || (!filter.category && f.key === '') ? 'primary' : 'default'}
              size="sm"
              onClick={() => handleCategoryChange(f.key)}
            >
              {f.label}
            </Tag>
          ))}
        </ScrollView>
      </View>

      <ScrollView scrollY className={styles.listContainer} onScrollToLower={loadMore}>
        {loading && list.length === 0 ? (
          <Skeleton type="list" count={4} />
        ) : list.length > 0 ? (
          <View className={styles.list}>
            {list.map((post: any) => (
              <PostCard
                key={post.id}
                {...post}
                onClick={handlePostClick}
                onLike={handleLike}
              />
            ))}
            {!hasMore && <Text className={styles.noMore}>— 没有更多了 —</Text>}
          </View>
        ) : (
          <EmptyState
            type="data"
            title="还没有讨论帖"
            description="成为第一个发起讨论的校友吧"
            actionText="发起讨论"
            onAction={handleCreatePost}
          />
        )}
      </ScrollView>

      <View className={styles.fab}>
        <Button type="primary" shape="circle" size="lg" onClick={handleCreatePost}>
          ✏️
        </Button>
      </View>
    </PageLayout>
  )
}

export default ForumPage
