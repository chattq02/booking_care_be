
import { PrismaClient } from '@prisma/client'
import { createLogger } from './logger.config'

const logger = createLogger('Database')

// Build cấu hình không qua URL
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
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
