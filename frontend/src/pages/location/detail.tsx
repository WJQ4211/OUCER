/**
 * 据点详情页
 */

import { FC, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Header, Card, Tag, Button, Avatar, Skeleton, EmptyState } from '@/components'
import styles from './detail.module.scss'

const LocationDetailPage: FC = () => {
  const router = useRouter()
  const { id } = router.params
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<any>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDetail(null) // 模拟
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [id])

  const handleJoin = () => {
    Taro.showToast({ title: '已加入该据点', icon: 'success' })
  }

  const handleCreateActivity = () => {
    Taro.navigateTo({ url: '/pages/location/publish-activity' })
  }

  if (loading) {
    return (
      <View className={styles.page}>
        <Header title="据点详情" showBack />
        <Skeleton type="card" count={2} />
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <Header title="据点详情" showBack />
      <ScrollView scrollY className={styles.content}>
        <EmptyState
          type="data"
          title="据点建设中"
          description="该据点详细信息即将上线"
          actionText="返回"
          onAction={() => Taro.navigateBack()}
        />
      </ScrollView>
    </View>
  )
}

export default LocationDetailPage
