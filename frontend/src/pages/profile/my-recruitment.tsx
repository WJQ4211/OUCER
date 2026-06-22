/**
 * My posts - manage my discussion posts
 */

import { FC, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Header, Card, Tag, Skeleton, EmptyState, Button } from '@/components'
import { CATEGORY_MAP } from '@/types/discussion'
import { timeAgo } from '@/utils/date'
import { formatCount } from '@/utils/format'
import styles from './my-recruitment.module.scss'

const MyPostsPage: FC = () => {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    setTimeout(() => {
      setList([])
      setLoading(false)
    }, 600)
  }, [])

  const handleDelete = async (id: string) => {
    const res = await Taro.showModal({ title: '确认删除', content: '删除后无法恢复' })
    if (!res.confirm) return
    // TODO: delete API
    setList((prev) => prev.filter((p) => p.id !== id))
    Taro.showToast({ title: '已删除', icon: 'success' })
  }

  return (
    <View className={styles.page}>
      <Header title="我的帖子" showBack />
      <ScrollView scrollY className={styles.content}>
        {loading ? (
          <Skeleton type="list" count={3} />
        ) : list.length > 0 ? (
          list.map((post) => {
            const cat = CATEGORY_MAP[post.category as keyof typeof CATEGORY_MAP]
            return (
              <Card key={post.id} className={styles.itemCard} onClick={() => {
                Taro.navigateTo({ url: `/pages/recruitment/detail?id=${post.id}` })
              }}>
                <View style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Text className={styles.itemTitle} numberOfLines={1}>{post.title}</Text>
                  {cat && <Tag type="default" size="sm">{cat.icon} {cat.label}</Tag>}
                </View>
                <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ display: 'flex', gap: '16px' }}>
                    <Text style={{ fontSize: '12px', color: '#999' }}>💬 {formatCount(post.commentCount)}</Text>
                    <Text style={{ fontSize: '12px', color: '#999' }}>❤️ {formatCount(post.likes)}</Text>
                  </View>
                  <View style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Text style={{ fontSize: '12px', color: '#999' }}>{timeAgo(post.createdAt)}</Text>
                    <Text style={{ fontSize: '14px', color: '#e74c3c' }} onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}>
                      🗑️
                    </Text>
                  </View>
                </View>
              </Card>
            )
          })
        ) : (
          <EmptyState type="data" title="还没有发过帖子" description="去论坛发表你的第一条讨论" actionText="去论坛" onAction={() => Taro.switchTab({ url: '/pages/recruitment/index' })} />
        )}
      </ScrollView>
    </View>
  )
}

export default MyPostsPage
