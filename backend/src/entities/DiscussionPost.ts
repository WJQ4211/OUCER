import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { User } from './User'
import { Comment } from './Comment'

@Entity('discussion_posts')
export class DiscussionPost {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 200 })
  title!: string

  @Column({ type: 'text' })
  content!: string

  @Column({ type: 'enum', enum: ['company', 'career', 'study', 'life', 'other'] })
  category!: 'company' | 'career' | 'study' | 'life' | 'other'

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'authorOpenId', referencedColumnName: 'openId' })
  author!: User

  @Column({ type: 'varchar', length: 64 })
  authorOpenId!: string

  @Column({ type: 'simple-json', nullable: true })
  images: string[] = []

  @Column({ type: 'int', default: 0 })
  likes: number = 0

  @Column({ type: 'simple-json', nullable: true })
  likedBy: string[] = [] // openIds of users who liked

  @Column({ type: 'int', default: 0 })
  commentCount: number = 0

  @Column({ type: 'int', default: 0 })
  views: number = 0

  @Column({ type: 'boolean', default: false })
  isPinned: boolean = false

  @Column({ type: 'boolean', default: false })
  isHot: boolean = false

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[]
}
