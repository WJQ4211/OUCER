import nodemailer from 'nodemailer'
import config from '@/config'

// In production, configure with real SMTP credentials through .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.qq.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

/** Send verification code to OUC email */
export const sendVerificationCode = async (to: string, code: string): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"海大人校友论坛" <noreply@haidaren.com>',
      to,
      subject: '海大人校友论坛 - 身份验证码',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #0066CC;">海大人校友论坛</h2>
          <p>您正在进行校友身份验证。</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #666;">您的验证码是：</p>
            <h1 style="font-size: 36px; color: #0066CC; margin: 10px 0; letter-spacing: 8px;">${code}</h1>
            <p style="margin: 0; color: #999; font-size: 12px;">有效期10分钟</p>
          </div>
          <p style="color: #999; font-size: 12px;">如果这不是您的操作，请忽略此邮件。</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('[Email] Failed to send:', error)
    return false
  }
}

// Simulated email for development (when SMTP not configured)
const devVerificationCodes = new Map<string, { code: string; expires: number }>()

export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const storeDevCode = (email: string, code: string) => {
  devVerificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 })
  console.log(`[DEV] Verification code for ${email}: ${code}`)
}

export const verifyDevCode = (email: string, code: string): boolean => {
  const record = devVerificationCodes.get(email)
  if (!record) return false
  if (Date.now() > record.expires) {
    devVerificationCodes.delete(email)
    return false
  }
  return record.code === code
}
