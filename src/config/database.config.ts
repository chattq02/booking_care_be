import { PrismaClient } from 'src/generated/prisma/client'
import { createLogger } from './logger.config'

const logger = createLogger('Database')

// Các biến môi trường riêng lẻ
const {
  DB_HOST = 'localhost',
  DB_PORT = '5436',
  DB_USER = 'postgres',
  DB_PASS = '123456',
  DB_NAME = 'postgres',
  DB_SCHEMA = 'public',
  DB_POOL = '50',
  DB_TIMEOUT = '5'
} = process.env

export const DataBaseUrl = `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}&connection_limit=${DB_POOL}&pool_timeout=${DB_TIMEOUT}`

// Build cấu hình không qua URL
export const prisma = new PrismaClient({
  datasources: {
    db: {
      // Prisma vẫn cần 1 URL ở đây, nhưng ta tự build ẩn, không đọc từ env
      url: DataBaseUrl
    }
  },
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' }
  ]
})

export async function connectDb() {
  try {
    await prisma.$connect()
    logger.info('✅ Connected to PostgreSQL')
  } catch (err) {
    logger.error('❌ Database connection failed:', err)
    process.exit(1)
  }
}
