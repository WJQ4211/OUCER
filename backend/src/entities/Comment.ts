import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './User'
import { DiscussionPost } from './DiscussionPost'

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text' })
  content!: string

  @ManyToOne(() => DiscussionPost, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post!: DiscussionPost

  @Column({ type: 'varchar', length: 64 })
  postId!: string

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinColumn({ name: 'authorOpenId', referencedColumnName: 'openId' })
  author!: User

  @Column({ type: 'varchar', length: 64 })
  authorOpenId!: string

  @Column({ type: 'varchar', length: 64, nullable: true })
  parentId: string | null = null // for nested replies

  @Column({ type: 'int', default: 0 })
  likes: number = 0

  @Column({ type: 'simple-json', nullable: true })
  likedBy: string[] = []

  @CreateDateColumn()
  createdAt!: Date
}
