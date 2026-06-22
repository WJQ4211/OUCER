/**
 * Edit profile page
 * Identity: xxxx级-学院-专业-姓名 男/女
 */

import { FC, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Header, Input, Button, Avatar, Card, Tag } from '@/components'
import { formatIdentity } from '@/types/user'
import styles from './edit-profile.module.scss'

const EditProfilePage: FC = () => {
  // TODO: load from store
  const [form, setForm] = useState({
    nickname: '',
    avatar: '',
    graduationYear: '',
    department: '',
    major: '',
    realName: '',
    gender: 'hidden' as 'male' | 'female' | 'hidden',
    showDepartment: true,
    showMajor: true,
    showRealName: false,
    phone: '',
    email: '',
    wechat: '',
    city: '',
    bio: '',
  })
  const [saving, setSaving] = useState(false)

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleField = (field: string) => {
    setForm((prev) => ({ ...prev, [field]: !(prev as any)[field] }))
  }

  /** Preview identity display */
  const previewIdentity = () => {
    const gradYear = parseInt(form.graduationYear)
    if (isNaN(gradYear) || gradYear < 1980 || gradYear > 2030) return '请填写有效入学年份'
    return formatIdentity({
      graduationYear: gradYear,
      department: form.department || undefined,
      major: form.major || undefined,
      realName: form.realName || undefined,
      nickname: form.nickname || '昵称',
      gender: form.gender,
      showDepartment: form.showDepartment,
      showMajor: form.showMajor,
      showRealName: form.showRealName,
    })
  }

  const handleSave = async () => {
    if (!form.nickname.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }
    if (!form.graduationYear) {
      Taro.showToast({ title: '请选择入学年份', icon: 'none' })
      return
    }
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      Taro.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1500)
    }, 1000)
  }

  const handleAvatarChange = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        updateField('avatar', res.tempFilePaths[0])
      },
    })
  }

  return (
    <View className={styles.page}>
      <Header title="编辑资料" showBack />

      <View className={styles.scrollContent}>
        {/* Avatar */}
        <Card className={styles.card}>
          <View className={styles.avatarSection}>
            <View className={styles.avatarWrap} onClick={handleAvatarChange}>
              <Avatar size="xl" src={form.avatar} name={form.nickname || '?'} bordered />
              <View className={styles.avatarOverlay}>
                <Text className={styles.avatarHint}>更换头像</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Identity section */}
        <Card className={styles.card}>
          <Text className={styles.cardTitle}>身份信息</Text>
          <Text className={styles.identityPreview}>预览: {previewIdentity()}</Text>

          <Input
            label="入学年份（级）"
            required
            placeholder="如：2020"
            value={form.graduationYear}
            onChange={(v) => updateField('graduationYear', v)}
          />

          <Input
            label="学院"
            placeholder="如：计算机学院（可选）"
            value={form.department}
            onChange={(v) => updateField('department', v)}
            suffix={
              <Tag type={form.showDepartment ? 'primary' : 'default'} size="sm"
                onClick={() => toggleField('showDepartment')}>
                {form.showDepartment ? '显示' : '隐藏'}
              </Tag>
            }
          />

          <Input
            label="专业"
            placeholder="如：软件工程（可选）"
            value={form.major}
            onChange={(v) => updateField('major', v)}
            suffix={
              <Tag type={form.showMajor ? 'primary' : 'default'} size="sm"
                onClick={() => toggleField('showMajor')}>
                {form.showMajor ? '显示' : '隐藏'}
              </Tag>
            }
          />

          <Input
            label="真实姓名"
            placeholder="你的真实姓名"
            value={form.realName}
            onChange={(v) => updateField('realName', v)}
            suffix={
              <Tag type={form.showRealName ? 'primary' : 'default'} size="sm"
                onClick={() => toggleField('showRealName')}>
                {form.showRealName ? '显示' : '隐藏'}
              </Tag>
            }
          />

          {/* Gender */}
          <View className={styles.fieldGroup}>
            <Text className={styles.fieldLabel}>性别</Text>
            <View className={styles.tagGroup}>
              {[
                { key: 'male', label: '♂ 男' },
                { key: 'female', label: '♀ 女' },
                { key: 'hidden', label: '不透露' },
              ].map((g) => (
                <Tag
                  key={g.key}
                  type={form.gender === g.key ? 'primary' : 'default'}
                  size="sm"
                  onClick={() => updateField('gender', g.key)}
                >
                  {g.label}
                </Tag>
              ))}
            </View>
          </View>
        </Card>

        {/* Basic info */}
        <Card className={styles.card}>
          <Text className={styles.cardTitle}>基本信息</Text>
          <Input label="昵称" required placeholder="你的昵称" value={form.nickname} onChange={(v) => updateField('nickname', v)} />
          <Input label="手机号" placeholder="选填" value={form.phone} onChange={(v) => updateField('phone', v)} />
          <Input label="邮箱" placeholder="选填" value={form.email} onChange={(v) => updateField('email', v)} />
          <Input label="微信号" placeholder="选填" value={form.wechat} onChange={(v) => updateField('wechat', v)} />
          <Input label="所在城市" placeholder="如：北京" value={form.city} onChange={(v) => updateField('city', v)} />
        </Card>

        {/* Bio */}
        <Card className={styles.card}>
          <Text className={styles.cardTitle}>个人简介</Text>
          <View className={styles.textareaField}>
            <textarea
              className={styles.textarea}
              placeholder="介绍一下自己..."
              value={form.bio}
              onInput={(e) => updateField('bio', (e.target as any).value)}
              rows={4}
              maxLength={200}
            />
            <Text className={styles.charCount}>{form.bio.length}/200</Text>
          </View>
        </Card>

        <View className={styles.submitArea}>
          <Button type="primary" size="lg" block loading={saving} onClick={handleSave}>
            保存修改
          </Button>
        </View>
      </View>
    </View>
  )
}

export default EditProfilePage
