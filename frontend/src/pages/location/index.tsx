/**
 * Location hub - city selection + activity list
 */

import { FC, useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { PageLayout, Header, Skeleton, EmptyState, Button } from '@/components'
import { ActivityCard } from '@/components/ActivityCard'
import { getActivityList } from '@/services/api/location'
import styles from './index.module.scss'

const MOCK_CITIES = [
  { name: '北京', count: 1280, icon: '🏛️' },
  { name: '上海', count: 960, icon: '🌃' },
  { name: '青岛', count: 1500, icon: '🌊' },
  { name: '深圳', count: 850, icon: '🌆' },
  { name: '杭州', count: 560, icon: '🏯' },
  { name: '成都', count: 420, icon: '🐼' },
]

const LocationListPage: FC = () => {
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('')
  const [activities, setActivities] = useState<any[]>([])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const result = await getActivityList()
      setActivities((result as any).list || [])
    } catch {
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  // Listen for navigation back from publish page
  useEffect(() => {
    Taro.eventCenter.on('refreshActivities', fetchActivities)
    return () => { Taro.eventCenter.off('refreshActivities', fetchActivities) }
  }, [])

  const handleCityClick = (city: string) => setSelectedCity(city)
  const handleActivityClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/location/activity-detail?id=${id}` })
  }
  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/location/publish-activity' })
  }

  return (
    <PageLayout activeTab="location" showTabBar>
      <Header title="校友据点" subtitle="找到你所在城市的校友" />

      <View className={styles.citySection}>
        <ScrollView scrollX className={styles.cityScroll}>
          {MOCK_CITIES.map((city) => (
            <View key={city.name} className={`${styles.cityItem} ${selectedCity === city.name ? styles.cityActive : ''}`} onClick={() => handleCityClick(city.name)}>
              <Text className={styles.cityIcon}>{city.icon}</Text>
              <Text className={styles.cityName}>{city.name}</Text>
              <Text className={styles.cityCount}>{city.count}人</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.activitySection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📅 {selectedCity ? selectedCity : '全部'}近期活动</Text>
          <Text className={styles.sectionMore} onClick={handlePublish}>发起活动 +</Text>
        </View>

        {loading && activities.length === 0 ? (
          <Skeleton type="card" count={2} />
        ) : activities.length > 0 ? (
          activities.map((a) => (
            <ActivityCard key={a.id} {...a} onClick={handleActivityClick} />
          ))
        ) : (
          <EmptyState type="data" title="暂无活动" description="发起第一个校友活动吧" actionText="发起活动" onAction={handlePublish} />
        )}
      </View>

      <View className={styles.fab}>
        <Button type="primary" shape="circle" size="lg" onClick={handlePublish}>＋</Button>
      </View>
    </PageLayout>
  )
}

export default LocationListPage
