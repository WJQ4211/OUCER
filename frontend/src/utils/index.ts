/**
 * 工具函数 - 统一导出
 */

export {
  DATE_FORMAT,
  formatDate,
  timeAgo,
  isExpired,
  isUpcoming,
  daysUntil,
  formatDeadline,
  formatActivityTime,
  getDateGroup,
} from './date'

export {
  formatSalary,
  formatCount,
  getIndustryName,
  getWorkYearsName,
  getDegreeName,
  getApplicationStatusName,
  getApplicationStatusColor,
  getIndustryColor,
  formatCity,
  truncate,
} from './format'

export {
  required,
  isPhone,
  isEmail,
  minLength,
  maxLength,
  numberRange,
  isPositiveNumber,
  validate,
  validateForm,
  validateRecruitmentForm,
} from './validate'
export type { ValidationRule, ValidationResult } from './validate'

export {
  setStorage,
  getStorage,
  removeStorage,
  clearAllStorage,
  STORAGE_KEYS,
} from './storage'
