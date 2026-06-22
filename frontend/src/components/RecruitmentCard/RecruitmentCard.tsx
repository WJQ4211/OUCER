/**
 * 招聘卡片业务组件
 */

import { FC, useCallback } from 'react'
import { View, Text, ITouchEvent } from '@tarojs/components'
import { Tag } from '@/components'
import {
  formatSalary,
  getIndustryName,
  getIndustryColor,
  getWorkYearsName,
  formatCity,
} from '@/utils/format'
import { formatDeadline } from '@/utils/date'
import styles from './RecruitmentCard.module.scss'

export interface RecruitmentCardProps {
  id: string
  company: string
  position: string
  industry: string
  city: string
  workYears: string
  minSalary: number
  maxSalary: number
  degree: string
  deadline: string
  views: number
  applications: number
  likes: number
  isLiked: boolean
  /** 发布者信息 */
  referrer?: {
    nickname: string
    avatar: string
  }
  /** 点击事件 */
  onClick?: (id: string) => void
  /** 点赞事件 */
  onLike?: (id: string) => void
}

const RecruitmentCard: FC<RecruitmentCardProps> = ({
  id,
  company,
  position,
  industry,
  city,
  workYears,
  minSalary,
  maxSalary,
  deadline,
  views,
  applications,
  likes,
  isLiked,
  referrer,
  onClick,
  onLike,
}) => {
  const handleClick = useCallback(() => {
    onClick?.(id)
  }, [id, onClick])

  const handleLike = useCallback(
    (e: ITouchEvent) => {
      e.stopPropagation()
      onLike?.(id)
    },
    [id, onLike]
  )

  const deadlineInfo = formatDeadline(deadline)
  const industryColor = getIndustryColor(industry)

  return (
    <View className={styles.card} onClick={handleClick}>
      {/* 头部：公司 + 薪资 */}
      <View className={styles.header}>
        <View className={styles.companyInfo}>
          <Text className={styles.company} numberOfLines={1}>
            {company}
          </Text>
          <Text className={styles.position} numberOfLines={1}>
            {position}
          </Text>
        </View>
        <View className={styles.salaryBlock}>
          <Text className={styles.salary}>{formatSalary(minSalary, maxSalary)}</Text>
          <Text className={styles.salaryUnit}>/月</Text>
        </View>
      </View>

      {/* 标签行 */}
      <View className={styles.tags}>
        <Tag type="default" size="sm">
          {getIndustryName(industry)}
        </Tag>
        <Tag type="default" size="sm">
          {formatCity(city)}
        </Tag>
        <Tag type="default" size="sm">
          {getWorkYearsName(workYears)}
        </Tag>
        {deadlineInfo.isUrgent && (
          <Tag type="warning" size="sm">
            {deadlineInfo.text}
          </Tag>
        )}
      </View>

      {/* 底部：发布者 + 数据 */}
      <View className={styles.footer}>
        <View className={styles.publisher}>
          {referrer && (
            <Text className={styles.referrer} numberOfLines={1}>
              {referrer.nickname}
            </Text>
          )}
        </View>

        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>👁</Text>
            <Text className={styles.statText}>{views}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>📄</Text>
            <Text className={styles.statText}>{applications}</Text>
          </View>
          <View
            className={`${styles.statItem} ${styles.likeBtn}`}
            onClick={handleLike}
          >
            <Text className={styles.statIcon}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            <Text className={styles.statText}>{likes}</Text>
          </View>
        </View>
      </View>

      {/* 行业色条 */}
      <View
        className={styles.industryBar}
        style={{ backgroundColor: industryColor }}
      />
    </View>
  )
}

export default RecruitmentCard
