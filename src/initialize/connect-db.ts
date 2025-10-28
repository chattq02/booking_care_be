import { prisma } from 'src/config/database.config'
import { createLogger } from 'src/config/logger.config'
const logger = createLogger('Database')

export const initDB = async () => {
  try {
    await prisma.$connect()
    logger.info('✅ Connected to PostgreSQL')
  } catch (err) {
    logger.error('❌ Database connection failed:', err)
    process.exit(1)
  }
}
