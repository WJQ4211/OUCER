/**
 * Identity verification page
 */

import { FC, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Header, Input, Button, Card, Tag } from '@/components'
import { useVerification } from '@/hooks/useUser'
import styles from './verify.module.scss'

type VerifyMethod = 'email' | 'chsi'

const VerifyPage: FC = () => {
  const [method, setMethod] = useState<VerifyMethod>('email')
  const [oucEmail, setOucEmail] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [chsiCode, setChsiCode] = useState('')
  const [realName, setRealName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { sending, codeSent, handleSendCode, handleEmailVerify, handleChsiVerify } = useVerification()

  const onSendCode = async () => {
    if (!oucEmail.trim()) { Taro.showToast({ title: 'Enter OUC email', icon: 'none' }); return }
    if (!oucEmail.match(/@(ouc|stu\.ouc)\.edu\.cn$/)) {
      Taro.showToast({ title: 'Invalid OUC email (@ouc.edu.cn or @stu.ouc.edu.cn)', icon: 'none' }); return
    }
    await handleSendCode(oucEmail)
  }

  const onEmailVerify = async () => {
    if (!emailCode.trim()) { Taro.showToast({ title: 'Enter code', icon: 'none' }); return }
    setSubmitting(true)
    await handleEmailVerify(oucEmail, emailCode)
    setSubmitting(false)
  }

  const onChsiVerify = async () => {
    if (!chsiCode.trim()) { Taro.showToast({ title: 'Enter CHSI code', icon: 'none' }); return }
    if (!realName.trim()) { Taro.showToast({ title: 'Enter real name', icon: 'none' }); return }
    setSubmitting(true)
    await handleChsiVerify(chsiCode, realName)
    setSubmitting(false)
  }

  return (
    <View className={styles.page}>
      <Header title="校友身份认证" showBack />
      <View className={styles.scrollContent}>
        <Card className={styles.introCard}>
          <Text className={styles.introTitle}>🔒 为什么需要认证？</Text>
          <Text className={styles.introText}>
            确保平台上的每一位用户都是海大校友。认证后您可以发帖、评论、报名活动。只需验证一次，永久有效。
          </Text>
        </Card>

        {/* Method selection */}
        <View className={styles.methodSelect}>
          <View className={`${styles.methodOption} ${method === 'email' ? styles.methodActive : ''}`} onClick={() => setMethod('email')}>
            <Text className={styles.methodIcon}>📧</Text><Text className={styles.methodLabel}>校内邮箱验证</Text><Text className={styles.methodDesc}>快速自动</Text>
          </View>
          <View className={`${styles.methodOption} ${method === 'chsi' ? styles.methodActive : ''}`} onClick={() => setMethod('chsi')}>
            <Text className={styles.methodIcon}>🎓</Text><Text className={styles.methodLabel}>学信网验证</Text><Text className={styles.methodDesc}>人工审核</Text>
          </View>
        </View>

        {/* Email verification */}
        {method === 'email' && (
          <Card className={styles.card}>
            <Text className={styles.cardTitle}>📧 校内邮箱验证</Text>
            <Text className={styles.cardDesc}>请输入海大邮箱，我们将发送 6 位验证码。</Text>
            <Input label="海大邮箱" required placeholder="如：2020123456@stu.ouc.edu.cn" value={oucEmail} onChange={setOucEmail} />
            <View style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <View style={{ flex: 1 }}><Input label="验证码" required placeholder="6位数字" value={emailCode} onChange={setEmailCode} /></View>
              <Button type={codeSent ? 'tertiary' : 'secondary'} size="md" disabled={!oucEmail.trim() || sending} loading={sending} onClick={onSendCode}>
                {codeSent ? '重新发送' : '发送验证码'}
              </Button>
            </View>
            <View style={{ marginTop: 16 }}>
              <Button type="primary" size="lg" block loading={submitting} onClick={onEmailVerify}>确认验证</Button>
            </View>
          </Card>
        )}

        {/* CHSI verification */}
        {method === 'chsi' && (
          <Card className={styles.card}>
            <Text className={styles.cardTitle}>🎓 学信网在线验证</Text>
            <View className={styles.steps}>
              <Text className={styles.step}>1️⃣ 登录学信网 (chsi.com.cn)</Text>
              <Text className={styles.step}>2️⃣ 申请"在线验证报告"并复制验证码</Text>
              <Text className={styles.step}>3️⃣ 填入学信网在线验证码和真实姓名</Text>
              <Text className={styles.step}>4️⃣ 人工核验（通常 1-2 小时）</Text>
            </View>
            <Input label="真实姓名" required placeholder="学信网上的姓名" value={realName} onChange={setRealName} />
            <Input label="学信网在线验证码" required placeholder="12位在线验证码" value={chsiCode} onChange={setChsiCode} />
            <View style={{ marginTop: 16 }}>
              <Button type="primary" size="lg" block loading={submitting} onClick={onChsiVerify}>提交审核</Button>
            </View>
          </Card>
        )}

        <Text className={styles.footerNote}>您的信息仅用于身份验证，不会公开。</Text>
      </View>
    </View>
  )
}

export default VerifyPage
