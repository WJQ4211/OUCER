/**
 * 空状态组件
 * 用于列表为空、搜索无结果、网络错误等场景
 */

import { FC } from 'react'
import { View, Text } from '@tarojs/components'
import { Button } from '@/components'
import styles from './EmptyState.module.scss'

export interface EmptyStateProps {
  /** 图标（emoji 或文本） */
  icon?: string
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 操作按钮文字 */
  actionText?: string
  /** 操作按钮点击 */
  onAction?: () => void
  /** 自定义 className */
  className?: string
  /** 类型预设 */
  type?: 'default' | 'network' | 'search' | 'data'
}

/** 预设类型 */
const PRESETS: Record<string, { icon: string; title: string; description?: string; actionText?: string }> = {
  network: {
    icon: '📡',
    title: '网络连接失败',
    description: '请检查网络后重试',
    actionText: '重新加载',
  },
  search: {
    icon: '🔍',
    title: '没有找到相关内容',
    description: '换个关键词试试吧',
  },
  data: {
    icon: '📋',
    title: '暂无数据',
    description: '这里还没有内容',
  },
}

const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
  type = 'default',
}) => {
  const preset = PRESETS[type]
  const displayIcon = icon || preset?.icon || '📭'
  const displayTitle = title || preset?.title || '暂无内容'
  const displayDesc = description ?? preset?.description
  const displayAction = actionText ?? preset?.actionText

  return (
    <View className={`${styles.empty} ${className}`}>
      <Text className={styles.icon}>{displayIcon}</Text>
      <Text className={styles.title}>{displayTitle}</Text>
      {displayDesc && (
        <Text className={styles.desc}>{displayDesc}</Text>
      )}
      {displayAction && onAction && (
        <Button
          type="primary"
          size="sm"
          shape="round"
          onClick={onAction}
          className={styles.action}
        >
          {displayAction}
        </Button>
      )}
    </View>
  )
}

export default EmptyState
