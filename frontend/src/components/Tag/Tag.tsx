import { FC, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import styles from './Tag.module.scss'

export type TagType = 'primary' | 'success' | 'warning' | 'error' | 'default'
export type TagSize = 'sm' | 'md' | 'lg'

export interface TagProps {
  /** 标签类型 */
  type?: TagType
  /** 标签大小 */
  size?: TagSize
  /** 标签内容 */
  children: ReactNode
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭事件 */
  onClose?: () => void
  /** 自定义className */
  className?: string
  /** 点击事件 */
  onClick?: () => void
}

const Tag: FC<TagProps> = ({
  type = 'default',
  size = 'md',
  children,
  closable = false,
  onClose,
  className = '',
  onClick,
}) => {
  const tagClass = `
    ${styles.tag}
    ${styles[`tag-${type}`]}
    ${styles[`tag-${size}`]}
    ${className}
  `.trim()

  return (
    <View
      className={tagClass}
      onClick={onClick}
    >
      <Text className={styles['tag-content']}>
        {children}
      </Text>
      {closable && (
        <Text
          className={styles['tag-close']}
          onClick={(e) => {
            e.stopPropagation?.()
            onClose?.()
          }}
        >
          ×
        </Text>
      )}
    </View>
  )
}

export default Tag
