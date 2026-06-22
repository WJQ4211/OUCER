import { FC } from 'react'
import { View, Text } from '@tarojs/components'
import styles from './Loading.module.scss'

export type LoadingSize = 'sm' | 'md' | 'lg'
export type LoadingType = 'spinner' | 'dots' | 'bar'

export interface LoadingProps {
  /** 是否显示 */
  visible?: boolean
  /** 加载类型 */
  type?: LoadingType
  /** 大小 */
  size?: LoadingSize
  /** 加载提示文本 */
  text?: string
  /** 是否全屏 */
  fullscreen?: boolean
  /** 自定义className */
  className?: string
}

const Loading: FC<LoadingProps> = ({
  visible = true,
  type = 'spinner',
  size = 'md',
  text,
  fullscreen = false,
  className = '',
}) => {
  if (!visible) return null

  const wrapperClass = `
    ${styles['loading-wrapper']}
    ${fullscreen ? styles['loading-fullscreen'] : ''}
    ${className}
  `.trim()

  const loaderClass = `
    ${styles.loader}
    ${styles[`loader-${type}`]}
    ${styles[`loader-${size}`]}
  `.trim()

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <View className={loaderClass}>
            <View className={styles['loader-dot']} />
            <View className={styles['loader-dot']} />
            <View className={styles['loader-dot']} />
          </View>
        )
      case 'bar':
        return <View className={loaderClass} />
      case 'spinner':
      default:
        return <View className={loaderClass} />
    }
  }

  return (
    <View className={wrapperClass}>
      <View className={styles['loading-content']}>
        {renderLoader()}
        {text && (
          <Text className={styles['loading-text']}>
            {text}
          </Text>
        )}
      </View>
    </View>
  )
}

export default Loading
