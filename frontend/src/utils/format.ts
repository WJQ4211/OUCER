/**
 * 格式化工具函数
 */

/** 行业标签映射 */
const INDUSTRY_MAP: Record<string, string> = {
  tech: '互联网/技术',
  finance: '金融',
  ecom: '电商/零售',
  estate: '房地产',
  other: '其他行业',
}

/** 工作年限映射 */
const WORK_YEARS_MAP: Record<string, string> = {
  fresh: '应届生',
  '1-3': '1-3年',
  '3-5': '3-5年',
  '5+': '5年以上',
}

/** 学历映射 */
const DEGREE_MAP: Record<string, string> = {
  bachelor: '本科',
  master: '硕士',
  phd: '博士',
  unlimited: '学历不限',
}

/** 投递状态映射 */
const APPLICATION_STATUS_MAP: Record<string, string> = {
  pending: '待投递',
  applied: '已投递',
  interviewed: '面试中',
  offered: '已获Offer',
  rejected: '未通过',
}

/**
 * 格式化薪资范围
 */
export const formatSalary = (min: number, max: number): string => {
  if (min === max) return `${min}K`
  return `${min}-${max}K`
}

/**
 * 格式化数字（超过999显示为999+）
 */
export const formatCount = (num: number, max = 999): string => {
  if (num > max) return `${max}+`
  return String(num)
}

/**
 * 获取行业名称
 */
export const getIndustryName = (industry: string): string => {
  return INDUSTRY_MAP[industry] || industry
}

/**
 * 获取工作年限名称
 */
export const getWorkYearsName = (years: string): string => {
  return WORK_YEARS_MAP[years] || years
}

/**
 * 获取学历名称
 */
export const getDegreeName = (degree: string): string => {
  return DEGREE_MAP[degree] || degree
}

/**
 * 获取投递状态名称
 */
export const getApplicationStatusName = (status: string): string => {
  return APPLICATION_STATUS_MAP[status] || status
}

/**
 * 获取投递状态颜色
 */
export const getApplicationStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: '#999999',
    applied: '#0066CC',
    interviewed: '#F39C12',
    offered: '#2ECC71',
    rejected: '#E74C3C',
  }
  return colorMap[status] || '#999999'
}

/**
 * 获取行业标签颜色
 */
export const getIndustryColor = (industry: string): string => {
  const colorMap: Record<string, string> = {
    tech: '#0066CC',
    finance: '#FFB800',
    ecom: '#FF6B35',
    estate: '#95DE64',
    other: '#9C9CFF',
  }
  return colorMap[industry] || '#9C9CFF'
}

/**
 * 格式化城市名
 */
export const formatCity = (city: string): string => {
  return city.replace(/市$/, '')
}

/**
 * 截断文本
 */
export const truncate = (text: string, maxLen: number): string => {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}
