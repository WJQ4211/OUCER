/**
 * 表单验证工具函数
 */

/** 验证规则类型 */
export type ValidationRule = (value: unknown) => string | null

/** 验证结果 */
export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

/**
 * 必填验证
 */
export const required = (message = '此项为必填'): ValidationRule => {
  return (value: unknown) => {
    if (value === undefined || value === null || value === '') return message
    if (Array.isArray(value) && value.length === 0) return message
    return null
  }
}

/**
 * 手机号验证
 */
export const isPhone = (message = '请输入正确的手机号'): ValidationRule => {
  return (value: unknown) => {
    if (!value) return null // 空值由 required 处理
    const phoneReg = /^1[3-9]\d{9}$/
    return phoneReg.test(String(value)) ? null : message
  }
}

/**
 * 邮箱验证
 */
export const isEmail = (message = '请输入正确的邮箱地址'): ValidationRule => {
  return (value: unknown) => {
    if (!value) return null
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailReg.test(String(value)) ? null : message
  }
}

/**
 * 最小长度验证
 */
export const minLength = (min: number, message?: string): ValidationRule => {
  return (value: unknown) => {
    if (!value) return null
    if (String(value).length < min) {
      return message || `最少输入${min}个字符`
    }
    return null
  }
}

/**
 * 最大长度验证
 */
export const maxLength = (max: number, message?: string): ValidationRule => {
  return (value: unknown) => {
    if (!value) return null
    if (String(value).length > max) {
      return message || `最多输入${max}个字符`
    }
    return null
  }
}

/**
 * 数字范围验证
 */
export const numberRange = (min: number, max: number, message?: string): ValidationRule => {
  return (value: unknown) => {
    if (value === undefined || value === null || value === '') return null
    const num = Number(value)
    if (isNaN(num) || num < min || num > max) {
      return message || `请输入${min}-${max}之间的数字`
    }
    return null
  }
}

/**
 * 正数验证
 */
export const isPositiveNumber = (message = '请输入有效的正数'): ValidationRule => {
  return (value: unknown) => {
    if (value === undefined || value === null || value === '') return null
    const num = Number(value)
    return !isNaN(num) && num > 0 ? null : message
  }
}

/**
 * 运行一组验证规则
 */
export const validate = (
  value: unknown,
  rules: ValidationRule[]
): string | null => {
  for (const rule of rules) {
    const error = rule(value)
    if (error) return error
  }
  return null
}

/**
 * 验证表单对象
 */
export const validateForm = (
  values: Record<string, unknown>,
  ruleMap: Record<string, ValidationRule[]>
): ValidationResult => {
  const errors: Record<string, string> = {}

  for (const [field, rules] of Object.entries(ruleMap)) {
    const error = validate(values[field], rules)
    if (error) {
      errors[field] = error
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * 验证招聘表单
 */
export const validateRecruitmentForm = (form: Record<string, unknown>): ValidationResult => {
  return validateForm(form, {
    company: [required('请输入公司名称')],
    position: [required('请输入职位名称')],
    industry: [required('请选择行业')],
    city: [required('请选择城市')],
    workYears: [required('请选择工作年限')],
    minSalary: [required('请输入最低薪资'), isPositiveNumber('请输入有效薪资')],
    maxSalary: [required('请输入最高薪资'), isPositiveNumber('请输入有效薪资')],
    degree: [required('请选择学历要求')],
    deadline: [required('请选择截止日期')],
    description: [required('请输入职位描述'), minLength(10, '职位描述至少10个字')],
  })
}
