import { FC, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import styles from './Badge.module.scss'

export type BadgeType = 'primary' | 'success' | 'warning' | 'error' | 'info'

export interface BadgeProps {
  /** 徽章内容 */
  content?: ReactNode
  /** 徽章类型 */
  type?: BadgeType
  /** 是否显示小圆点 */
  dot?: boolean
  /** 最大显示数字（超过显示+） */
  max?: number
  /** 自定义className */
  className?: string
  /** 子元素 */
  children?: ReactNode
}

const Badge: FC<BadgeProps> = ({
  content,
  type = 'error',
  dot = false,
  max = 99,
  className = '',
  children,
}) => {
  const showContent = content !== undefined && content !== null
  
  const getBadgeContent = () => {
    if (typeof content === 'number' && content > max) {
      return `${max}+`
    }
    return content
  }

  const wrapperClass = `
    ${styles['badge-wrapper']}
    ${children ? styles['badge-has-children'] : ''}
    ${className}
  `.trim()

  const badgeClass = `
    ${styles.badge}
    ${styles[`badge-${type}`]}
    ${dot ? styles['badge-dot'] : ''}
  `.trim()

  return (
    <View className={wrapperClass}>
      {children}
      {showContent && (
        <View className={badgeClass}>
          {!dot && (
            <Text className={styles['badge-content']}>
              {getBadgeContent()}
            </Text>
          )}
        </View>
      )}
    </View>
  )
}

export default Badge
