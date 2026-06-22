import { DataSource } from 'typeorm'
import config from './index'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.isDevelopment, // auto-create tables in dev
  logging: config.isDevelopment ? ['error', 'warn'] : ['error'],
  entities: [__dirname + '/../entities/*.{ts,js}'],
  charset: 'utf8mb4',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
})

export const connectDB = async () => {
  try {
    await AppDataSource.initialize()
    console.log('[DB] Database connected successfully')
  } catch (error) {
    console.error('[DB] Database connection failed:', error)
    throw error
  }
}
