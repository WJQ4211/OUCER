/**
 * Publish activity page
 */

import { FC, useState } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Header, Input, Button, Tag, Card } from '@/components'
import { publishActivity } from '@/services/api/location'
import styles from './publish-activity.module.scss'

const CATEGORIES = [
  { key: 'sports', label: '运动', icon: '⚽' },
  { key: 'dining', label: '聚餐', icon: '🍽️' },
  { key: 'study', label: '学习交流', icon: '📚' },
  { key: 'outing', label: '户外郊游', icon: '🏔️' },
  { key: 'networking', label: '人脉拓展', icon: '🤝' },
  { key: 'other', label: '其他', icon: '🎉' },
]

const PublishActivityPage: FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [address, setAddress] = useState('')
  const [capacity, setCapacity] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category || !startTime.trim() || !endTime.trim() || !address.trim()) {
      Taro.showToast({ title: '请填写所有必填项', icon: 'none' }); return
    }
    setSubmitting(true)
    try {
      await publishActivity({
        title: title.trim(), description: description.trim(), category,
        startTime: startTime.trim(), endTime: endTime.trim(), address: address.trim(),
        capacity: parseInt(capacity) || 30,
      })
      Taro.eventCenter.trigger('refreshActivities')
      Taro.eventCenter.trigger('refreshHome')
      Taro.showToast({ title: '活动发布成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1500)
    } catch {
      Taro.showToast({ title: '发布失败', icon: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className={styles.page}>
      <Header title="发起活动" showBack />
      <View className={styles.scrollContent}>
        <Card className={styles.card}>
          <Text className={styles.cardTitle}>活动分类</Text>
          <View className={styles.tagGroup}>
            {CATEGORIES.map((c) => (
              <Tag key={c.key} type={category === c.key ? 'primary' : 'default'} size="md" onClick={() => setCategory(c.key)}>{c.icon} {c.label}</Tag>
            ))}
          </View>
        </Card>

        <Card className={styles.card}>
          <Text className={styles.cardTitle}>活动信息</Text>
          <Input label="活动标题" required placeholder="给活动起一个吸引人的标题" value={title} onChange={setTitle} />
          <Input label="开始时间" required placeholder="如：2026-07-01 14:00" value={startTime} onChange={setStartTime} />
          <Input label="结束时间" required placeholder="如：2026-07-01 17:00" value={endTime} onChange={setEndTime} />
          <Input label="活动地点" required placeholder="请填写详细地址" value={address} onChange={setAddress} />
          <Input label="人数上限" required placeholder="如：30" value={capacity} onChange={setCapacity} />
        </Card>

        <Card className={styles.card}>
          <Text className={styles.cardTitle}>活动描述</Text>
          <View className={styles.fieldGroup}>
            <Text className={styles.fieldLabel}>描述 <Text className={styles.required}>*</Text></Text>
            <Textarea
              className={styles.textarea}
              placeholder="详细介绍活动内容、流程和注意事项..."
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={2000}
            />
          </View>
        </Card>

        <View className={styles.submitArea}>
          <Button type="primary" size="lg" block loading={submitting} onClick={handleSubmit}>发布活动</Button>
          <Text className={styles.submitTip}>发布即表示同意社区规范，请确保信息真实准确</Text>
        </View>
      </View>
    </View>
  )
}

export default PublishActivityPage
