/**
 * 校友据点 - 列表页
 */

import { FC, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { PageLayout, Header, Skeleton, EmptyState, Card, Button, Tag } from '@/components'
import { ActivityCard } from '@/components/ActivityCard'
import styles from './index.module.scss'

/** 城市数据 */
const MOCK_CITIES = [
  { name: '北京', count: 1280, icon: '🏛️' },
  { name: '上海', count: 960, icon: '🌃' },
  { name: '广州', count: 720, icon: '🏙️' },
  { name: '深圳', count: 850, icon: '🌆' },
  { name: '杭州', count: 560, icon: '🏯' },
  { name: '成都', count: 420, icon: '🐼' },
]

const LocationListPage: FC = () => {
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('')
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    // 模拟加载
    const timer = setTimeout(() => {
      setActivities([])
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  usePullDownRefresh(() => {
    // 刷新逻辑
    Taro.stopPullDownRefresh()
  })

  const handleCityClick = (city: string) => {
    setSelectedCity(city)
  }

  const handleActivityClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/location/activity-detail?id=${id}` })
  }

  const handlePublishActivity = () => {
    Taro.navigateTo({ url: '/pages/location/publish-activity' })
  }

  return (
    <PageLayout activeTab="location" showTabBar>
      <Header title="校友据点" subtitle="找到你所在城市的校友" />

      {/* 城市选择 */}
      <View className={styles.citySection}>
        <ScrollView scrollX className={styles.cityScroll}>
          {MOCK_CITIES.map((city) => (
            <View
              key={city.name}
              className={`${styles.cityItem} ${selectedCity === city.name ? styles.cityActive : ''}`}
              onClick={() => handleCityClick(city.name)}
            >
              <Text className={styles.cityIcon}>{city.icon}</Text>
              <Text className={styles.cityName}>{city.name}</Text>
              <Text className={styles.cityCount}>{city.count}人</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 据点信息 */}
      {selectedCity ? (
        <View className={styles.locationInfo}>
          <Card className={styles.locationCard}>
            <View className={styles.locationHeader}>
              <Text className={styles.locationName}>{selectedCity}校友据点</Text>
              <Tag type="primary" size="sm">已加入</Tag>
            </View>
            <Text className={styles.locationDesc}>
              欢迎来到{selectedCity}校友据点！在这里你可以找到同城校友，参加各种线上线下的活动。
            </Text>
            <View className={styles.locationActions}>
              <Button type="secondary" size="sm" shape="round">
                进入据点
              </Button>
            </View>
          </Card>

          {/* 该城市的活动 */}
          <View className={styles.activitySection}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>📅 {selectedCity}近期活动</Text>
              <Text className={styles.sectionMore} onClick={handlePublishActivity}>
                发起活动 +
              </Text>
            </View>

            {loading ? (
              <Skeleton type="card" count={2} />
            ) : activities.length > 0 ? (
              activities.map((item) => (
                <ActivityCard
                  key={item.id}
                  {...item}
                  onClick={handleActivityClick}
                />
              ))
            ) : (
              <EmptyState
                type="data"
                title={`${selectedCity}暂无活动`}
                description="发起第一个校友活动吧"
                actionText="发起活动"
                onAction={handlePublishActivity}
              />
            )}
          </View>
        </View>
      ) : (
        <View className={styles.promptSection}>
          <EmptyState
            icon="👆"
            title="选择一个城市"
            description="查看该城市的校友据点和活动"
          />
        </View>
      )}

      {/* 发布按钮 */}
      <View className={styles.fab}>
        <Button type="primary" shape="circle" size="lg" onClick={handlePublishActivity}>
          ＋
        </Button>
      </View>
    </PageLayout>
  )
}

export default LocationListPage
