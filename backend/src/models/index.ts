import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'

/**
 * 用户实体
 */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true, comment: '微信 openId' })
  openId!: string

  @Column({ comment: '昵称' })
  nickname!: string

  @Column({ nullable: true, comment: '头像' })
  avatar?: string

  @Column({ nullable: true, comment: '手机号' })
  phone?: string

  @Column({ nullable: true, comment: '邮箱' })
  email?: string

  @Column({ nullable: true, comment: '微信号' })
  wechat?: string

  @Column({ comment: '所在城市' })
  city!: string

  @Column({ nullable: true, comment: '院系' })
  department?: string

  @Column({ nullable: true, type: 'int', comment: '毕业年份' })
  graduationYear?: number

  @Column({ nullable: true, type: 'text', comment: '个人简介' })
  bio?: string

  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date

  // 关系
  @OneToMany(() => RecruitmentEntity, (recruitment) => recruitment.referrer)
  recruitments?: RecruitmentEntity[]

  @OneToMany(() => ApplicationEntity, (app) => app.user)
  applications?: ApplicationEntity[]

  @OneToMany(() => ActivityParticipantEntity, (participant) => participant.user)
  activityParticipants?: ActivityParticipantEntity[]
}

/**
 * 内推实体
 */
@Entity('recruitments')
export class RecruitmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ comment: '公司名称' })
  company!: string

  @Column({ comment: '岗位名称' })
  position!: string

  @Column({ comment: '行业类型' })
  industry!: string

  @Column({ comment: '工作城市' })
  city!: string

  @Column({ comment: '工作年限要求' })
  workYears!: string

  @Column({ type: 'int', comment: '最低薪资（万元）' })
  minSalary!: number

  @Column({ type: 'int', comment: '最高薪资（万元）' })
  maxSalary!: number

  @Column({ comment: '学位要求' })
  degree!: string

  @Column({ type: 'datetime', comment: '截止日期' })
  deadline!: Date

  @Column({ type: 'text', comment: '岗位描述' })
  description!: string

  @Column({ comment: '推荐人 ID' })
  referrerId!: string

  @Column({ default: 0, comment: '浏览次数' })
  views!: number

  @Column({ default: 0, comment: '投递次数' })
  applications!: number

  @Column({ default: 0, comment: '点赞数' })
  likes!: number

  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date

  // 关系
  @ManyToOne(() => UserEntity, (user) => user.recruitments)
  @JoinColumn({ name: 'referrerId' })
  referrer?: UserEntity

  @OneToMany(() => ApplicationEntity, (app) => app.recruitment)
  applicationList?: ApplicationEntity[]

  @OneToMany(() => CommentEntity, (comment) => comment.recruitment)
  comments?: CommentEntity[]
}

/**
 * 投递应用实体
 */
@Entity('applications')
export class ApplicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ comment: '内推 ID' })
  recruitmentId!: string

  @Column({ comment: '用户 ID' })
  userId!: string

  @Column({ default: 'pending', comment: '投递状态' })
  status!: string

  @CreateDateColumn({ comment: '投递时间' })
  appliedAt!: Date

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date

  // 关系
  @ManyToOne(() => RecruitmentEntity, (recruitment) => recruitment.applicationList)
  @JoinColumn({ name: 'recruitmentId' })
  recruitment?: RecruitmentEntity

  @ManyToOne(() => UserEntity, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity
}

/**
 * 城市据点实体
 */
@Entity('locations')
export class LocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true, comment: '城市名称' })
  city!: string

  @Column({ comment: '据点名称' })
  name!: string

  @Column({ nullable: true, type: 'text', comment: '描述' })
  description?: string

  @Column({ default: 0, comment: '成员数' })
  memberCount!: number

  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date

  // 关系
  @OneToMany(() => ActivityEntity, (activity) => activity.location)
  activities?: ActivityEntity[]
}

/**
 * 活动实体
 */
@Entity('activities')
export class ActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ comment: '据点 ID' })
  locationId!: string

  @Column({ comment: '活动名称' })
  title!: string

  @Column({ type: 'text', comment: '活动描述' })
  description!: string

  @Column({ comment: '活动分类' })
  category!: string

  @Column({ type: 'datetime', comment: '开始时间' })
  startTime!: Date

  @Column({ type: 'datetime', comment: '结束时间' })
  endTime!: Date

  @Column({ comment: '活动地点' })
  location!: string

  @Column({ type: 'int', comment: '人数上限' })
  capacity!: number

  @Column({ default: 0, type: 'int', comment: '参与人数' })
  participantCount!: number

  @Column({ comment: '组织者 ID' })
  organizerId!: string

  @Column({ nullable: true, comment: '微信群二维码' })
  groupQrcode?: string

  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date

  // 关系
  @ManyToOne(() => LocationEntity, (location) => location.activities)
  @JoinColumn({ name: 'locationId' })
  location_rel?: LocationEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'organizerId' })
  organizer?: UserEntity

  @OneToMany(
    () => ActivityParticipantEntity,
    (participant) => participant.activity
  )
  participants?: ActivityParticipantEntity[]

  @OneToMany(() => CommentEntity, (comment) => comment.activity)
  comments?: CommentEntity[]
}

/**
 * 活动参与者实体
 */
@Entity('activity_participants')
export class ActivityParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ comment: '活动 ID' })
  activityId!: string

  @Column({ comment: '用户 ID' })
  userId!: string

  @Column({ default: 'joined', comment: '状态' })
  status!: string

  @CreateDateColumn({ comment: '加入时间' })
  joinedAt!: Date

  @Column({ nullable: true, type: 'datetime', comment: '取消时间' })
  cancelledAt?: Date

  // 关系
  @ManyToOne(() => ActivityEntity, (activity) => activity.participants)
  @JoinColumn({ name: 'activityId' })
  activity?: ActivityEntity

  @ManyToOne(() => UserEntity, (user) => user.activityParticipants)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity
}

/**
 * 评论实体
 */
@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ comment: '目标类型' })
  targetType!: string

  @Column({ comment: '目标 ID' })
  targetId!: string

  @Column({ comment: '作者 ID' })
  authorId!: string

  @Column({ type: 'text', comment: '评论内容' })
  content!: string

  @Column({ default: 0, type: 'int', comment: '点赞数' })
  likes!: number

  @Column({ nullable: true, comment: '父评论 ID' })
  parentId?: string

  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date

  // 关系
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author?: UserEntity

  @ManyToOne(() => RecruitmentEntity, (recruitment) => recruitment.comments)
  @JoinColumn({ name: 'targetId' })
  recruitment?: RecruitmentEntity

  @ManyToOne(() => ActivityEntity, (activity) => activity.comments)
  @JoinColumn({ name: 'targetId' })
  activity?: ActivityEntity

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  replies?: CommentEntity[]

  @ManyToOne(() => CommentEntity, (comment) => comment.replies)
  @JoinColumn({ name: 'parentId' })
  parent?: CommentEntity
}

/**
 * 通知实体
 */
@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ comment: '用户 ID' })
  userId!: string

  @Column({ comment: '通知类型' })
  type!: string

  @Column({ comment: '操作者 ID' })
  actorId!: string

  @Column({ type: 'text', comment: '通知内容' })
  content!: string

  @Column({ nullable: true, comment: '目标类型' })
  targetType?: string

  @Column({ nullable: true, comment: '目标 ID' })
  targetId?: string

  @Column({ default: false, comment: '已读' })
  read!: boolean

  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date

  @Column({ nullable: true, type: 'datetime', comment: '读取时间' })
  readAt?: Date

  // 关系
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'actorId' })
  actor?: UserEntity
}
