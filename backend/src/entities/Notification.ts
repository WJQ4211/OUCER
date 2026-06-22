import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 64 })
  userId!: string

  @Column({ type: 'enum', enum: ['like', 'comment', 'reply', 'activity', 'system', 'verify'] })
  type!: 'like' | 'comment' | 'reply' | 'activity' | 'system' | 'verify'

  @Column({ type: 'varchar', length: 64, nullable: true })
  actorOpenId: string | null = null

  @Column({ type: 'varchar', length: 500 })
  content!: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  targetType: string | null = null

  @Column({ type: 'varchar', length: 64, nullable: true })
  targetId: string | null = null

  @Column({ type: 'boolean', default: false })
  read: boolean = false

  @CreateDateColumn()
  createdAt!: Date
}
