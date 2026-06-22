/**
 * 骨架屏组件
 * 用于页面/内容加载时的占位效果
 */

import { FC } from 'react'
import { View } from '@tarojs/components'
import styles from './Skeleton.module.scss'

export interface SkeletonProps {
  /** 骨架屏类型 */
  type?: 'card' | 'list' | 'text' | 'avatar' | 'header'
  /** 行数（text 类型） */
  rows?: number
  /** 卡片数量（card/list 类型） */
  count?: number
  /** 是否显示动画 */
  animated?: boolean
  /** 自定义 className */
  className?: string
}

/**
 * 文本骨架
 */
const TextSkeleton: FC<{ rows: number; animated: boolean }> = ({ rows, animated }) => (
  <View className={styles.textBlock}>
    {Array.from({ length: rows }).map((_, i) => (
      <View
        key={i}
        className={`${styles.textLine} ${animated ? styles.shimmer : ''}`}
        style={{ width: i === rows - 1 ? '60%' : '100%' }}
      />
    ))}
  </View>
)

/**
 * 卡片骨架
 */
const CardSkeleton: FC<{ animated: boolean }> = ({ animated }) => (
  <View className={styles.card}>
    <View className={`${styles.cardHeader} ${animated ? styles.shimmer : ''}`} />
    <View className={styles.cardBody}>
      <View className={`${styles.cardTitle} ${animated ? styles.shimmer : ''}`} />
      <View className={`${styles.cardLine} ${animated ? styles.shimmer : ''}`} />
      <View
        className={`${styles.cardLine} ${animated ? styles.shimmer : ''}`}
        style={{ width: '60%' }}
      />
    </View>
  </View>
)

/**
 * 头像骨架
 */
const AvatarSkeleton: FC<{ animated: boolean }> = ({ animated }) => (
  <View className={styles.avatarBlock}>
    <View className={`${styles.avatarCircle} ${animated ? styles.shimmer : ''}`} />
    <View className={styles.avatarInfo}>
      <View className={`${styles.avatarName} ${animated ? styles.shimmer : ''}`} />
      <View className={`${styles.avatarDesc} ${animated ? styles.shimmer : ''}`} />
    </View>
  </View>
)

/**
 * 头部骨架
 */
const HeaderSkeleton: FC<{ animated: boolean }> = ({ animated }) => (
  <View className={styles.headerBlock}>
    <View className={`${styles.headerBanner} ${animated ? styles.shimmer : ''}`} />
    <View className={styles.headerRow}>
      <View className={`${styles.headerItem} ${animated ? styles.shimmer : ''}`} />
      <View className={`${styles.headerItem} ${animated ? styles.shimmer : ''}`} />
      <View className={`${styles.headerItem} ${animated ? styles.shimmer : ''}`} />
    </View>
  </View>
)

const Skeleton: FC<SkeletonProps> = ({
  type = 'card',
  rows = 3,
  count = 3,
  animated = true,
  className = '',
}) => {
  switch (type) {
    case 'text':
      return (
        <View className={`${styles.container} ${className}`}>
          <TextSkeleton rows={rows} animated={animated} />
        </View>
      )

    case 'avatar':
      return (
        <View className={`${styles.container} ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <AvatarSkeleton key={i} animated={animated} />
          ))}
        </View>
      )

    case 'header':
      return (
        <View className={`${styles.container} ${className}`}>
          <HeaderSkeleton animated={animated} />
        </View>
      )

    case 'list':
      return (
        <View className={`${styles.container} ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <View key={i} className={styles.listItem}>
              <View className={`${styles.listThumb} ${animated ? styles.shimmer : ''}`} />
              <View className={styles.listInfo}>
                <View className={`${styles.listTitle} ${animated ? styles.shimmer : ''}`} />
                <View className={`${styles.listDesc} ${animated ? styles.shimmer : ''}`} />
              </View>
            </View>
          ))}
        </View>
      )

    case 'card':
    default:
      return (
        <View className={`${styles.container} ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} animated={animated} />
          ))}
        </View>
      )
  }
}

export default Skeleton
