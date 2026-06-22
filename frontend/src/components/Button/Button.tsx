import { FC, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import styles from './Button.module.scss'

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'default' | 'round' | 'circle'

export interface ButtonProps {
  /** 按钮类型 */
  type?: ButtonType
  /** 按钮大小 */
  size?: ButtonSize
  /** 按钮形状 */
  shape?: ButtonShape
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 按钮内容 */
  children: ReactNode
  /** 点击事件 */
  onClick?: () => void
  /** 自定义className */
  className?: string
  /** 是否为块级按钮 */
  block?: boolean
}

const Button: FC<ButtonProps> = ({
  type = 'primary',
  size = 'md',
  shape = 'default',
  disabled = false,
  loading = false,
  children,
  onClick,
  className = '',
  block = false,
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  const buttonClass = `
    ${styles.button}
    ${styles[`button-${type}`]}
    ${styles[`button-${size}`]}
    ${styles[`button-${shape}`]}
    ${disabled ? styles['button-disabled'] : ''}
    ${loading ? styles['button-loading'] : ''}
    ${block ? styles['button-block'] : ''}
    ${className}
  `.trim()

  return (
    <View
      className={buttonClass}
      onClick={handleClick}
    >
      {loading && <View className={styles['button-spinner']} />}
      <Text className={styles['button-text']}>
        {children}
      </Text>
    </View>
  )
}

export default Button
