/**
 * Create discussion post
 */

import { FC, useState } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Header, Input, Button, Tag, Card } from '@/components'
import { usePublishDiscussion } from '@/hooks/useRecruitment'
import type { DiscussionCategory } from '@/types/discussion'
import styles from './publish.module.scss'

const CATEGORIES: { key: DiscussionCategory; label: string; icon: string }[] = [
  { key: 'company', label: '聊聊公司', icon: '🏢' },
  { key: 'career', label: '学长去向', icon: '🎓' },
  { key: 'study', label: '深造/考研', icon: '📚' },
  { key: 'life', label: '校园生活', icon: '🏫' },
  { key: 'other', label: '其他', icon: '💬' },
]

const PublishPage: FC = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<DiscussionCategory | ''>('')
  const { publish, submitting } = usePublishDiscussion()

  const handleSubmit = async () => {
    if (!title.trim()) { Taro.showToast({ title: '请输入标题', icon: 'none' }); return }
    if (!content.trim()) { Taro.showToast({ title: '请输入内容', icon: 'none' }); return }
    if (!category) { Taro.showToast({ title: '请选择分类', icon: 'none' }); return }
    await publish({ title: title.trim(), content: content.trim(), category })
  }

  return (
    <View className={styles.page}>
      <Header title="发起讨论" showBack />
      <View className={styles.scrollContent}>
        <Card className={styles.card}>
          <Text className={styles.cardTitle}>选择分类</Text>
          <View className={styles.tagGroup}>
            {CATEGORIES.map((cat) => (
              <Tag key={cat.key} type={category === cat.key ? 'primary' : 'default'} size="md" onClick={() => setCategory(cat.key)}>
                {cat.icon} {cat.label}
              </Tag>
            ))}
          </View>
        </Card>

        <Card className={styles.card}>
          <Text className={styles.cardTitle}>内容</Text>
          <Input label="标题" required placeholder="用一句话概括你的话题" value={title} onChange={setTitle} />
          <View className={styles.fieldGroup}>
            <Text className={styles.fieldLabel}>
              正文 <Text className={styles.required}>*</Text>
            </Text>
            <Textarea
              className={styles.textarea}
              placeholder="说说你想讨论的内容..."
              value={content}
              onInput={(e) => setContent(e.detail.value)}
              maxlength={5000}
            />
          </View>
        </Card>

        <View className={styles.submitArea}>
          <Button type="primary" size="lg" block loading={submitting} onClick={handleSubmit}>
            发布讨论
          </Button>
          <Text className={styles.submitTip}>发布即表示同意社区规范</Text>
        </View>
      </View>
    </View>
  )
}

export default PublishPage
