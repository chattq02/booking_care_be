import 'reflect-metadata'
import express from 'express'
import http from 'http'
import { config } from 'dotenv'

import { Run } from './initialize/run'
import { createLogger } from './config/logger.config'
import { prisma } from './config/database.config'

config() // Load biến môi trường

const PORT = process.env.PORT || 4530
const logger = createLogger('Main')

async function bootstrap() {
  const app = express()

  try {
    const server = http.createServer(app)

    server.listen(PORT, async () => {
      Run(app)
      logger.info(`🚀 Server is running on port ${PORT}`)
    })

    // 5️⃣ Graceful shutdown
    const shutdown = async () => {
      logger.info('🛑 Shutting down gracefully...')
      await prisma.$disconnect()
      server.close(() => {
        logger.info('✅ Server closed')
        process.exit(0)
      })
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } catch (error) {
    logger.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

bootstrap()
