import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { DiscussionPost } from './DiscussionPost'
import { Comment } from './Comment'

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  openId!: string

  // Identity fields (xxxx级-学院-专业-姓名 男/女)
  @Column({ type: 'int', nullable: true })
  graduationYear: number | null = null

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string | null = null

  @Column({ type: 'varchar', length: 100, nullable: true })
  major: string | null = null

  @Column({ type: 'varchar', length: 50, nullable: true })
  realName: string | null = null

  @Column({ type: 'varchar', length: 50 })
  nickname: string = ''

  @Column({ type: 'enum', enum: ['male', 'female', 'hidden'], default: 'hidden' })
  gender: 'male' | 'female' | 'hidden' = 'hidden'

  // Display preferences
  @Column({ type: 'boolean', default: true })
  showDepartment: boolean = true

  @Column({ type: 'boolean', default: true })
  showMajor: boolean = true

  @Column({ type: 'boolean', default: false })
  showRealName: boolean = false

  // IP location (province level)
  @Column({ type: 'varchar', length: 20, nullable: true })
  ipProvince: string | null = null

  // Contact
  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string | null = null

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null = null

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string | null = null

  @Column({ type: 'varchar', length: 50, nullable: true })
  wechat: string | null = null

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string | null = null

  @Column({ type: 'text', nullable: true })
  bio: string | null = null

  // Auth / Verification
  @Column({ type: 'boolean', default: false })
  isVerified: boolean = false

  @Column({ type: 'enum', enum: ['email', 'chsi'], nullable: true })
  verificationMethod: 'email' | 'chsi' | null = null

  @Column({ type: 'varchar', length: 100, nullable: true })
  oucEmail: string | null = null

  // Membership
  @Column({ type: 'simple-json', nullable: true })
  joinedLocations: string[] = []

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToMany(() => DiscussionPost, (post) => post.author)
  posts!: DiscussionPost[]

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[]
}
