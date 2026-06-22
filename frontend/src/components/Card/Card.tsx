import { FC, ReactNode } from 'react'
import { View } from '@tarojs/components'
import styles from './Card.module.scss'

export interface CardProps {
  /** 卡片内容 */
  children: ReactNode
  /** 是否显示阴影 */
  shadow?: boolean
  /** 是否显示分隔线 */
  divider?: boolean
  /** 自定义className */
  className?: string
  /** 点击事件 */
  onClick?: () => void
  /** 是否为可点击状态 */
  clickable?: boolean
}

const Card: FC<CardProps> = ({
  children,
  shadow = true,
  divider = false,
  className = '',
  onClick,
  clickable = false,
}) => {
  const cardClass = `
    ${styles.card}
    ${shadow ? styles['card-shadow'] : ''}
    ${divider ? styles['card-divider'] : ''}
    ${clickable ? styles['card-clickable'] : ''}
    ${className}
  `.trim()

  return (
    <View
      className={cardClass}
      onClick={onClick}
    >
      {children}
    </View>
  )
}

export default Card
