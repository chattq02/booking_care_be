import express, { Application } from 'express'
import cors from 'cors'
import { corsMiddleware } from '../middlewares/cors.middleware'
import { errorMiddleware } from 'src/middlewares/error.middlewares'
import { swaggerSpec } from 'src/config/swagger.config'
import swaggerUi from 'swagger-ui-express'

export function registerMiddlewares(app: Application) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(corsMiddleware)
  app.use(cors())

  // Đăng ký route chính
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // 5️⃣ Routes
  // registerRoutes(app);

  // 6️⃣ Health Check
  app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }))

  app.use(errorMiddleware)
}
