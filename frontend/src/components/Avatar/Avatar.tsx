import { FC } from 'react'
import { Image, Text, View } from '@tarojs/components'
import styles from './Avatar.module.scss'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  /** ͷ��ͼƬURL */
  src?: string
  /** ͷ���С */
  size?: AvatarSize
  /** ͷ�����֣���ʾ����ĸ�� */
  name?: string
  /** ����ɫ */
  bg?: string
  /** �Զ���className */
  className?: string
  /** �Ƿ���ʾ�߿� */
  bordered?: boolean
  /** ����¼� */
  onClick?: () => void
}

const getAvatarBg = (index: number) => {
  const colors = [
    '#0066CC', // primary
    '#FF6B35', // accent
    '#2ECC71', // success
    '#F39C12', // warning
    '#9C9CFF', // purple
  ]
  return colors[index % colors.length]
}

const Avatar: FC<AvatarProps> = ({
  src,
  size = 'md',
  name = '',
  bg,
  className = '',
  bordered = false,
  onClick,
}) => {
  const avatarClass = `
    ${styles.avatar}
    ${styles[`avatar-${size}`]}
    ${bordered ? styles['avatar-bordered'] : ''}
    ${className}
  `.trim()

  const getInitial = () => {
    if (name) {
      return name.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const bgColor = bg || getAvatarBg(name.charCodeAt(0) || 0)

  return (
    <View
      className={avatarClass}
      onClick={onClick}
    >
      {src ? (
        <Image
          src={src}
          className={styles['avatar-image']}
          mode="aspectFill"
        />
      ) : (
        <View
          className={styles['avatar-fallback']}
          style={{ backgroundColor: bgColor }}
        >
          <Text className={styles['avatar-text']}>
            {getInitial()}
          </Text>
        </View>
      )}
    </View>
  )
}

export default Avatar
