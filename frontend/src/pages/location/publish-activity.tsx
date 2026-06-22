/**
 * 发布活动页
 */

import { FC, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Header, Input, Button, Tag, Card } from '@/components'
import styles from './publish-activity.module.scss'

const CATEGORIES = [
  { key: 'sports', label: '运动' },
  { key: 'dining', label: '聚餐' },
  { key: 'study', label: '学习交流' },
  { key: 'outing', label: '户外郊游' },
  { key: 'networking', label: '人脉拓展' },
  { key: 'other', label: '其他' },
]

const ActivityPublishPage: FC = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    startTime: '',
    endTime: '',
    address: '',
    capacity: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.startTime || !form.endTime || !form.address || !form.capacity) {
      Taro.showToast({ title: '请填写所有必填项', icon: 'none' })
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      Taro.showToast({ title: '活动发布成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1500)
    }, 1000)
  }

  return (
    <View className={styles.page}>
      <Header title="发起活动" showBack />

      <View className={styles.scrollContent}>
        <Card className={styles.card}>
          <Text className={styles.cardTitle}>活动信息</Text>

          <Input
            label="活动标题"
            required
            placeholder="给活动起一个吸引人的标题"
            value={form.title}
            onChange={(v) => updateField('title', v)}
          />

          <View className={styles.fieldGroup}>
            <Text className={styles.fieldLabel}>
              活动分类 <Text className={styles.required}>*</Text>
            </Text>
            <View className={styles.tagGroup}>
              {CATEGORIES.map((cat) => (
                <Tag
                  key={cat.key}
                  type={form.category === cat.key ? 'primary' : 'default'}
                  size="sm"
                  onClick={() => updateField('category', cat.key)}
                >
                  {cat.label}
                </Tag>
              ))}
            </View>
          </View>

          <Input
            label="开始时间"
            required
            placeholder="如：2026-07-01 14:00"
            value={form.startTime}
            onChange={(v) => updateField('startTime', v)}
          />

          <Input
            label="结束时间"
            required
            placeholder="如：2026-07-01 17:00"
            value={form.endTime}
            onChange={(v) => updateField('endTime', v)}
          />

          <Input
            label="活动地点"
            required
            placeholder="请填写详细地址"
            value={form.address}
            onChange={(v) => updateField('address', v)}
          />

          <Input
            label="人数上限"
            required
            placeholder="如：30"
            value={form.capacity}
            onChange={(v) => updateField('capacity', v)}
          />
        </Card>

        <Card className={styles.card}>
          <Text className={styles.cardTitle}>活动描述</Text>
          <View className={styles.textareaField}>
            <Text className={styles.fieldLabel}>
              描述 <Text className={styles.required}>*</Text>
            </Text>
            <textarea
              className={styles.textarea}
              placeholder="详细介绍活动内容、流程和注意事项..."
              value={form.description}
              onInput={(e) => updateField('description', (e.target as any).value)}
              rows={6}
            />
          </View>
        </Card>

        <View className={styles.submitArea}>
          <Button
            type="primary"
            size="lg"
            block
            loading={submitting}
            onClick={handleSubmit}
          >
            发布活动
          </Button>
          <Text className={styles.submitTip}>
            发布即表示同意社区规范，请确保信息真实准确
          </Text>
        </View>
      </View>
    </View>
  )
}

export default ActivityPublishPage
