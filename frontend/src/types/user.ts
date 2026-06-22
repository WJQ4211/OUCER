/**
 * User related type definitions
 *
 * Identity display format:
 *   "xxxx级-xxx学院-xxx专业-姓名 男/女"
 *   - graduationYear is always required
 *   - department and major are optional (user can hide)
 *   - name can be replaced with nickname
 *   - IP location (province level) shown alongside
 */

/** User profile */
export interface User {
  id: string
  openId: string
  // Identity fields
  graduationYear: number     // e.g. 2020 — REQUIRED
  department?: string        // e.g. 计算机学院 — optional display
  major?: string             // e.g. 软件工程 — optional display
  realName?: string          // real name — can hide; show nickname instead
  nickname: string           // always shown
  gender: 'male' | 'female' | 'hidden'
  // Display preferences
  showDepartment: boolean    // whether to show department in public display
  showMajor: boolean         // whether to show major
  showRealName: boolean      // false = show nickname instead
  // IP location (province/municipality level)
  ipProvince?: string        // e.g. 山东, 北京
  // Contact
  avatar: string
  phone?: string
  email?: string             // OUC email for verification
  wechat?: string
  city: string               // current city
  bio?: string
  // Auth
  isVerified: boolean        // email or CHSI verified
  verificationMethod?: 'email' | 'chsi'  // how they verified
  oucEmail?: string          // @ouc.edu.cn or @stu.ouc.edu.cn
  // Membership
  joinedLocations: string[]
  createdAt: string
}

/** Public user brief (shown in posts/comments) */
export interface UserBrief {
  id: string
  nickname: string
  avatar: string
  // Formatted identity string
  identityDisplay: string    // "2020级-计算机学院-软件工程-张三 男"
  ipProvince?: string        // "山东"
  isVerified: boolean
}

/** Edit user profile form */
export interface ProfileForm {
  nickname: string
  avatar: string
  graduationYear: number
  department?: string
  major?: string
  realName?: string
  gender: 'male' | 'female' | 'hidden'
  showDepartment: boolean
  showMajor: boolean
  showRealName: boolean
  phone?: string
  email?: string
  wechat?: string
  city: string
  bio?: string
}

/** WeChat login params */
export interface WechatLoginParams {
  code: string
}

/** WeChat login response */
export interface LoginResponse {
  token: string
  user: User
  isNewUser: boolean
}

/** Verification request - email method */
export interface EmailVerifyRequest {
  oucEmail: string   // must end with @ouc.edu.cn or @stu.ouc.edu.cn
}

/** Verification request - send code */
export interface SendVerifyCodeRequest {
  oucEmail: string
}

/** Verification request - confirm code */
export interface ConfirmVerifyCodeRequest {
  oucEmail: string
  code: string       // 6-digit code
}

/** Verification - CHSI method */
export interface ChsiVerifyRequest {
  verifyCode: string  // CHSI online verification code
  realName: string    // must match CHSI record
}

/** Verification response */
export interface VerifyResponse {
  success: boolean
  message: string
  user?: User
}

/** Settings item */
export interface SettingItem {
  key: string
  label: string
  icon: string
  type: 'switch' | 'navigate' | 'info'
  value?: string | boolean
  onClick?: () => void
}

/**
 * Format user identity display string
 */
export const formatIdentity = (user: {
  graduationYear: number
  department?: string
  major?: string
  realName?: string
  nickname: string
  gender: 'male' | 'female' | 'hidden'
  showDepartment: boolean
  showMajor: boolean
  showRealName: boolean
}): string => {
  const parts: string[] = [`${user.graduationYear}级`]
  if (user.showDepartment && user.department) parts.push(user.department)
  if (user.showMajor && user.major) parts.push(user.major)
  const name = user.showRealName && user.realName ? user.realName : user.nickname
  parts.push(name)
  if (user.gender !== 'hidden') {
    parts.push(user.gender === 'male' ? '男' : '女')
  }
  return parts.join('-')
}
