import { Application } from 'express'
import { swaggerSpec } from 'src/config/swagger.config'
import use_routes_v1 from 'src/routes/use-routes-v1'
import swaggerUi from 'swagger-ui-express'

export function routesInit(app: Application) {
  // Đăng ký route chính
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.use('/v1', use_routes_v1)
  app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }))
}
