/**
 * Profile center page
 */

import { FC, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { PageLayout, Header, Avatar, Card, Tag, Button, Badge } from '@/components'
import { useUserStore } from '@/store/user'
import { formatIdentity } from '@/types/user'
import { setStorage, removeStorage, STORAGE_KEYS } from '@/utils/storage'
import styles from './index.module.scss'

interface MenuItem {
  key: string
  label: string
  icon: string
  badge?: number
  path?: string
}

const ProfilePage: FC = () => {
  const { user, logout, setUser, setLoginLoading } = useUserStore()
  const isLoggedIn = !!user
  const [loginLoading, setLocalLoading] = useState(false)

  const handleLogin = async () => {
    setLocalLoading(true)
    setLoginLoading(true)
    try {
      const { code } = await Taro.login()
      const res = await Taro.request({
        url: 'http://localhost:3000/api/auth/login',
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        data: { code },
      })
      if (res.statusCode === 200 && (res.data as any)?.code === 0) {
        const { token, user: userInfo } = (res.data as any).data
        await setStorage(STORAGE_KEYS.TOKEN, token)
        await setStorage(STORAGE_KEYS.USER_INFO, userInfo)
        setUser(userInfo)
        Taro.showToast({ title: '登录成功', icon: 'success' })
      } else {
        Taro.showToast({ title: '登录失败，请确保后端已启动', icon: 'none' })
      }
    } catch (err: any) {
      Taro.showToast({ title: '网络错误，请检查后端', icon: 'none' })
    } finally {
      setLocalLoading(false)
      setLoginLoading(false)
    }
  }

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: '我的内容',
      items: [
        { key: 'my-posts', label: '我的帖子', icon: '📝', path: '/pages/profile/my-recruitment' },
        { key: 'my-activity', label: '我的活动', icon: '🎉', path: '/pages/profile/my-activity' },
      ],
    },
    {
      title: '账号',
      items: [
        { key: 'edit-profile', label: '编辑资料', icon: '✏️', path: '/pages/profile/edit-profile' },
        {
          key: 'verify',
          label: user?.isVerified ? '已认证 ✅' : '身份认证',
          icon: user?.isVerified ? '✅' : '⚠️',
          path: '/pages/profile/verify',
          badge: user?.isVerified ? 0 : 1,
        },
      ],
    },
  ]

  const handleMenuClick = (item: MenuItem) => {
    if (item.path) {
      Taro.navigateTo({ url: item.path })
    }
  }

  const handleLogout = async () => {
    const res = await Taro.showModal({ title: '确认退出', content: '退出后需要重新登录' })
    if (!res.confirm) return
    await removeStorage(STORAGE_KEYS.TOKEN)
    await removeStorage(STORAGE_KEYS.USER_INFO)
    setUser(null)
    Taro.showToast({ title: '已退出', icon: 'success' })
  }

  const identityDisplay = user ? formatIdentity({
    graduationYear: user.graduationYear || 0,
    department: user.department || undefined,
    major: user.major || undefined,
    realName: user.realName || undefined,
    nickname: user.nickname || '未知',
    gender: user.gender || 'hidden',
    showDepartment: user.showDepartment ?? true,
    showMajor: user.showMajor ?? true,
    showRealName: user.showRealName ?? false,
  }) : ''

  return (
    <PageLayout activeTab="profile" showTabBar>
      <Header title="我的" />

      <ScrollView scrollY className={styles.container}>
        <Card className={styles.profileCard}>
          {isLoggedIn ? (
            <View className={styles.userInfo}>
              <Avatar size="xl" name={user.nickname || '?'} src={user.avatar} bordered />
              <View className={styles.userMeta}>
                <Text className={styles.identity}>{identityDisplay}</Text>
                {user.ipProvince && (
                  <Text className={styles.ip}>📍 IP: {user.ipProvince}</Text>
                )}
                <View className={styles.userTags}>
                  {user.isVerified ? (
                    <Tag type="success" size="sm">✅ 已认证</Tag>
                  ) : (
                    <Tag type="warning" size="sm">⚠️ 未认证</Tag>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View className={styles.loginPrompt}>
              <Avatar size="xl" name="?" />
              <Text className={styles.loginText}>点击登录，体验完整功能</Text>
              <Button type="primary" size="sm" shape="round" loading={loginLoading} onClick={handleLogin}>
                微信登录
              </Button>
            </View>
          )}
        </Card>

        {isLoggedIn && menuSections.map((section) => (
          <View key={section.title} className={styles.menuSection}>
            <Text className={styles.sectionTitle}>{section.title}</Text>
            <Card>
              {section.items.map((item, idx) => (
                <View
                  key={item.key}
                  className={`${styles.menuItem} ${idx < section.items.length - 1 ? styles.menuItemBorder : ''}`}
                  onClick={() => handleMenuClick(item)}
                >
                  <Text className={styles.menuIcon}>{item.icon}</Text>
                  <Text className={styles.menuLabel}>{item.label}</Text>
                  <View className={styles.menuRight}>
                    {item.badge && item.badge > 0 ? (
                      <Badge dot={item.badge === 1} content={item.badge > 1 ? item.badge : undefined} />
                    ) : null}
                    <Text className={styles.menuArrow}>›</Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        ))}

        {isLoggedIn && (
          <View className={styles.logoutSection}>
            <Button type="tertiary" block onClick={handleLogout}>退出登录</Button>
          </View>
        )}

        <Text className={styles.version}>海大人 v0.1.0</Text>
      </ScrollView>
    </PageLayout>
  )
}

export default ProfilePage
