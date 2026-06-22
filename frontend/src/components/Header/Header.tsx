/**
 * Page Header component with safe area / Dynamic Island support
 */

import { FC, ReactNode, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getSafeAreaInfo, getHeaderPaddingStyle } from '@/utils/safeArea'
import styles from './Header.module.scss'

export interface HeaderProps {
  title: string
  showBack?: boolean
  backText?: string
  onBack?: () => void
  right?: ReactNode
  className?: string
  transparent?: boolean
  subtitle?: string
}

const Header: FC<HeaderProps> = ({
  title,
  showBack = false,
  backText,
  onBack,
  right,
  className = '',
  transparent = false,
  subtitle,
}) => {
  const [statusBarH, setStatusBarH] = useState(20)

  useEffect(() => {
    const info = getSafeAreaInfo()
    setStatusBarH(info.statusBarHeight)
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.navigateBack()
    }
  }

  const safeStyle = getHeaderPaddingStyle()

  return (
    <View
      className={`${styles.header} ${transparent ? styles.transparent : ''} ${className}`}
      style={safeStyle}
    >
      {/* Return button */}
      {showBack && (
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backIcon}>←</Text>
          {backText && <Text className={styles.backText}>{backText}</Text>}
        </View>
      )}

      {/* Title area */}
      <View className={styles.titleWrap}>
        <Text className={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text className={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right area */}
      <View className={styles.right}>{right}</View>
    </View>
  )
}

export default Header
