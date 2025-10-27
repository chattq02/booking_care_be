import 'reflect-metadata'
import express from 'express'
import http from 'http'
import { config } from 'dotenv'

import { registerMiddlewares } from './initialize/run'
import { createLogger } from './config/logger.config'
import { connectDb, prisma } from './config/database.config'

config() // Load biến môi trường

const PORT = process.env.PORT || 3000
const logger = createLogger('Main')

async function bootstrap() {
  const app = express()

  try {
    // 1️⃣ Kết nối Database
    await connectDb()

    // 2️⃣ Load Middleware & Routes
    registerMiddlewares(app)

    // 3️⃣ Tạo HTTP server
    const server = http.createServer(app)

    // 4️⃣ Lắng nghe port
    server.listen(PORT, () => {
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
